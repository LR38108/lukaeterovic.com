export interface Env {
  MEDIA_BUCKET: R2Bucket
  DB: D1Database
  ADMIN_TOKEN: string
  PUBLIC_MEDIA_BASE: string
}

type FilmPayload = {
  slug: string
  title: string
  year?: string
  duration?: string
  type?: string
  genres?: string
  tagline?: string
  description?: string
  poster?: string

  originalTitle?: string
  language?: string
  runtime?: string
  releaseYear?: string
  genreFull?: string
  format?: string

  plotSummary?: string
  aboutProject?: string

  credits?: { role: string; name: string }[]
  gallery?: string[]
  tech?: Record<string, unknown>
  watchUrl?: string
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const method = request.method

    // CORS
    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() })
    }

    // Auth (lock everything except GET)
    if (method !== 'GET') {
      const auth = request.headers.get('Authorization')
      if (!auth || auth !== `Bearer ${env.ADMIN_TOKEN}`) {
        return json({ error: 'Unauthorized' }, 401)
      }
    }

    // Upload
    if (url.pathname === '/upload' && method === 'POST') {
      return uploadMedia(request, env)
    }

    // DELETE /media
    if (url.pathname === '/media' && method === 'DELETE') {
      return deleteMedia(request, env)
    }

    // Films API
    if (url.pathname === '/films' && method === 'GET') {
      return getFilms(env)
    }

    if (url.pathname.startsWith('/films/') && method === 'GET') {
      const slug = url.pathname.split('/')[2]
      return getFilm(slug, env)
    }

    if (url.pathname === '/films' && method === 'POST') {
      return createFilm(request, env)
    }

    if (url.pathname.startsWith('/films/') && method === 'PUT') {
      const slug = url.pathname.split('/')[2]
      return updateFilm(slug, request, env)
    }

    if (url.pathname.startsWith('/films/') && method === 'DELETE') {
      const slug = url.pathname.split('/')[2]
      return deleteFilm(slug, env)
    }

    if (url.pathname === '/health') {
      return json({ ok: true })
    }

    return json({ error: 'Not found' }, 404)
  }
}

/* =====================
   FILMS HANDLERS
===================== */

function hydrateFilm(row: any) {
  return {
    ...row,
    credits: safeJSON(row.credits, []),
    gallery: safeJSON(row.gallery, []),
    tech: safeJSON(row.tech, {}),
    poster: row.poster || null
  }
}

async function getFilms(env: Env) {
  const { results } = await env.DB
    .prepare(`SELECT * FROM films ORDER BY created_at DESC`)
    .all()

  return json(results.map(hydrateFilm))
}

async function getFilm(slug: string, env: Env) {
  const film = await env.DB
    .prepare(`SELECT * FROM films WHERE slug = ?`)
    .bind(slug)
    .first()

  if (!film) return json({ error: 'Not found' }, 404)
  return json(hydrateFilm(film))
}

async function createFilm(request: Request, env: Env) {
  const data = (await request.json()) as FilmPayload

  await env.DB.prepare(`
    INSERT INTO films (
      slug, title, year, duration, type, genres,
      tagline, description, poster,
      original_title, language, runtime, release_year,
      genre_full, format,
      plot_summary, about_project,
      credits, gallery, tech, watch_url
    ) VALUES (
      ?,?,?,?,?,?,
      ?,?,?,?,
      ?,?,?,?,
      ?,?,
      ?,?,
      ?,?,?,?
    )
  `).bind(
    data.slug,
    data.title,
    data.year,
    data.duration,
    data.type,
    data.genres,
    data.tagline,
    data.description,
    data.poster,
    data.originalTitle,
    data.language,
    data.runtime,
    data.releaseYear,
    data.genreFull,
    data.format,
    data.plotSummary,
    data.aboutProject,
    JSON.stringify(data.credits || []),
    JSON.stringify(data.gallery || []),
    JSON.stringify(data.tech || {}),
    data.watchUrl
  ).run()

  return json({ ok: true })
}

async function updateFilm(slug: string, request: Request, env: Env) {
  const data = (await request.json()) as FilmPayload

  await env.DB.prepare(`
    UPDATE films SET
      title = ?, year = ?, duration = ?, type = ?, genres = ?,
      tagline = ?, description = ?, poster = ?,
      original_title = ?, language = ?, runtime = ?, release_year = ?,
      genre_full = ?, format = ?,
      plot_summary = ?, about_project = ?,
      credits = ?, gallery = ?, tech = ?, watch_url = ?,
      updated_at = datetime('now')
    WHERE slug = ?
  `).bind(
    data.title,
    data.year,
    data.duration,
    data.type,
    data.genres,
    data.tagline,
    data.description,
    data.poster,
    data.originalTitle,
    data.language,
    data.runtime,
    data.releaseYear,
    data.genreFull,
    data.format,
    data.plotSummary,
    data.aboutProject,
    JSON.stringify(data.credits || []),
    JSON.stringify(data.gallery || []),
    JSON.stringify(data.tech || {}),
    data.watchUrl,
    slug
  ).run()

  return json({ ok: true })
}

async function deleteFilm(slug: string, env: Env) {
  await env.DB.prepare(`DELETE FROM films WHERE slug = ?`).bind(slug).run()
  return json({ ok: true })
}

/* =====================
   UPLOAD
===================== */

async function uploadMedia(request: Request, env: Env) {
  const form = await request.formData()
  const file = form.get('file')
  const slug = String(form.get('slug') || 'misc').trim()

  if (!(file instanceof File)) {
    return json({ error: 'Missing file' }, 400)
  }

  const ext = file.name.split('.').pop() || 'bin'
  const safeName = `${crypto.randomUUID()}.${ext}`
  const key = `${slug}/${safeName}`

  await env.MEDIA_BUCKET.put(key, file.stream(), {
    httpMetadata: { contentType: file.type }
  })

  const base = env.PUBLIC_MEDIA_BASE.replace(/\/+$/, '')

  return json({
    ok: true,
    key,
    url: `${base}/${key}`,
    name: file.name
  })
}
/* =====================
   DELETE 
===================== */

async function deleteMedia(request: Request, env: Env) {
  const { url } = await request.json() as { url?: string }

  if (!url) {
    return json({ error: 'Missing url' }, 400)
  }

  // extract R2 key from public URL
  const u = new URL(url)
  const key = u.pathname.replace(/^\/+/, '') // hunch/uuid.jpg

  await env.MEDIA_BUCKET.delete(key)

  return json({ ok: true, key })
}

/* =====================
   HELPERS
===================== */

function safeJSON(value: string | null, fallback: any) {
  try {
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders()
    }
  })
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  }
}