import ExifReader from 'exifreader'

export interface Env {
  MEDIA_BUCKET: R2Bucket
  DB: D1Database
  ADMIN_TOKEN: string
  PUBLIC_MEDIA_BASE: string
}

/* =====================
   TYPES
===================== */

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
  gallery?: any[]
  tech?: Record<string, unknown>
  watchUrl?: string
}

type GalleryPayload = {
  slug: string
  title: string
  year?: number
  location?: string
  tagline?: string
  description?: string
  coverImage?: string
  images?: any[]
}

type MusicVideoPayload = {
  slug: string
  title: string
  artist: string
  year?: number
  video_url: string
  thumbnail?: string
  description?: string
  credits?: any[]
  gallery?: any[]
}

type BlogPostPayload = {
  slug: string
  title: string
  excerpt?: string
  content: string
  cover_image?: string
  published?: boolean
}

/* =====================
   FETCH
===================== */

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const method = request.method

    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() })
    }

    if (method !== 'GET') {
      const auth = request.headers.get('Authorization')
      if (!auth || auth !== `Bearer ${env.ADMIN_TOKEN}`) {
        return json({ error: 'Unauthorized' }, 401)
      }
    }

    if (url.pathname === '/upload' && method === 'POST') {
      return uploadMedia(request, env)
    }

    if (url.pathname === '/media' && method === 'DELETE') {
      return deleteMedia(request, env)
    }

    /* ===== FILMS ===== */

    if (url.pathname === '/films' && method === 'GET') return getFilms(env)
    if (url.pathname.startsWith('/films/') && method === 'GET')
      return getFilm(url.pathname.split('/')[2], env)
    if (url.pathname === '/films' && method === 'POST')
      return createFilm(request, env)
    if (url.pathname.startsWith('/films/') && method === 'PUT')
      return updateFilm(url.pathname.split('/')[2], request, env)
    if (url.pathname.startsWith('/films/') && method === 'DELETE')
      return deleteFilm(url.pathname.split('/')[2], env)

    /* ===== GALLERIES ===== */

    if (url.pathname === '/galleries' && method === 'GET') return getGalleries(env)
    if (url.pathname.startsWith('/galleries/') && method === 'GET')
      return getGallery(url.pathname.split('/')[2], env)
    if (url.pathname === '/galleries' && method === 'POST')
      return createGallery(request, env)
    if (url.pathname.startsWith('/galleries/') && method === 'PUT')
      return updateGallery(url.pathname.split('/')[2], request, env)
    if (url.pathname.startsWith('/galleries/') && method === 'DELETE')
      return deleteGallery(url.pathname.split('/')[2], env)

    /* ===== MUSIC VIDEOS ===== */

    if (url.pathname === '/music-videos' && method === 'GET')
      return getMusicVideos(env)

    if (url.pathname.startsWith('/music-videos/') && method === 'GET')
      return getMusicVideo(url.pathname.split('/')[2], env)

    if (url.pathname === '/music-videos' && method === 'POST')
      return createMusicVideo(request, env)

    if (url.pathname.startsWith('/music-videos/') && method === 'PUT')
      return updateMusicVideo(url.pathname.split('/')[2], request, env)

    if (url.pathname.startsWith('/music-videos/') && method === 'DELETE')
      return deleteMusicVideo(url.pathname.split('/')[2], env)

    /* ===== BLOG ===== */

    if (url.pathname === '/blog' && method === 'GET')
      return getBlogPosts(env)

    if (url.pathname.startsWith('/blog/') && method === 'GET')
      return getBlogPost(url.pathname.split('/')[2], env)

    if (url.pathname === '/blog' && method === 'POST')
      return createBlogPost(request, env)

    if (url.pathname.startsWith('/blog/') && method === 'PUT')
      return updateBlogPost(url.pathname.split('/')[2], request, env)

    if (url.pathname.startsWith('/blog/') && method === 'DELETE')
      return deleteBlogPost(url.pathname.split('/')[2], env)

    if (url.pathname === '/health') return json({ ok: true })

    return json({ error: 'Not found' }, 404)
  }
}

/* =====================
   FILMS
===================== */

function hydrateFilm(row: any) {
  return {
    ...row,
    credits: safeJSON(row.credits, []),
    gallery: normalizeImages(safeJSON(row.gallery, [])),
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
      slug,
      title,
      year,
      duration,
      type,
      genres,
      tagline,
      description,
      poster,
      original_title,
      language,
      runtime,
      release_year,
      genre_full,
      format,
      plot_summary,
      about_project,
      credits,
      gallery,
      tech,
      watch_url
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?,
      ?, ?,
      ?, ?, ?
    )
  `).bind(
    data.slug,
    data.title ?? '',

    data.year ?? '',
    data.duration ?? '',
    data.type ?? '',
    data.genres ?? '',

    data.tagline ?? '',
    data.description ?? '',
    data.poster ?? null,

    data.originalTitle ?? '',
    data.language ?? '',
    data.runtime ?? '',
    data.releaseYear ?? '',

    data.genreFull ?? '',
    data.format ?? '',

    data.plotSummary ?? '',
    data.aboutProject ?? '',

    JSON.stringify(data.credits || []),
    JSON.stringify(data.gallery || []),
    JSON.stringify(data.tech || {}),
    data.watchUrl ?? ''
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
    data.title ?? '',
    data.year ?? '',
    data.duration ?? '',
    data.type ?? '',
    data.genres ?? '',
    data.tagline ?? '',
    data.description ?? '',
    data.poster ?? null,

    data.originalTitle ?? '',
    data.language ?? '',
    data.runtime ?? '',
    data.releaseYear ?? '',
    data.genreFull ?? '',
    data.format ?? '',

    data.plotSummary ?? '',
    data.aboutProject ?? '',

    JSON.stringify(data.credits || []),
    JSON.stringify(data.gallery || []),
    JSON.stringify(data.tech || {}),
    data.watchUrl ?? '',

    slug
  ).run()

  return json({ ok: true })
}


async function deleteFilm(slug: string, env: Env) {
  await env.DB.prepare(`DELETE FROM films WHERE slug = ?`).bind(slug).run()
  return json({ ok: true })
}

/* =====================
   GALLERIES
===================== */

function hydrateGallery(row: any) {
  return {
    ...row,
    images: normalizeImages(safeJSON(row.images, [])),
    cover_image: row.cover_image || null
  }
}

async function getGalleries(env: Env) {
  const { results } = await env.DB
    .prepare(`SELECT * FROM galleries ORDER BY created_at DESC`)
    .all()

  return json(results.map(hydrateGallery))
}

async function getGallery(slug: string, env: Env) {
  const gallery = await env.DB
    .prepare(`SELECT * FROM galleries WHERE slug = ?`)
    .bind(slug)
    .first()

  if (!gallery) return json({ error: 'Not found' }, 404)
  return json(hydrateGallery(gallery))
}

async function createGallery(request: Request, env: Env) {
  const data = (await request.json()) as GalleryPayload

  await env.DB.prepare(`
    INSERT INTO galleries (
      slug, title, year, location,
      tagline, description,
      cover_image, images
    ) VALUES (
      ?,?,?,?,?,?,
      ?,?
    )
  `).bind(
    data.slug,
    data.title,
    data.year,
    data.location,
    data.tagline,
    data.description,
    data.coverImage,
    JSON.stringify(normalizeImages(data.images || []))
  ).run()

  return json({ ok: true })
}

async function updateGallery(slug: string, request: Request, env: Env) {
  const data = (await request.json()) as GalleryPayload

  await env.DB.prepare(`
    UPDATE galleries SET
      title = ?, year = ?, location = ?,
      tagline = ?, description = ?,
      cover_image = ?, images = ?,
      updated_at = datetime('now')
    WHERE slug = ?
  `).bind(
    data.title,
    data.year,
    data.location,
    data.tagline,
    data.description,
    data.coverImage,
    JSON.stringify(normalizeImages(data.images || [])),
    slug
  ).run()

  return json({ ok: true })
}

async function deleteGallery(slug: string, env: Env) {
  await env.DB.prepare(`DELETE FROM galleries WHERE slug = ?`).bind(slug).run()
  return json({ ok: true })
}

/* =====================
   MUSIC VIDEOS
===================== */

function hydrateMusicVideo(row: any) {
  return {
    ...row,
    credits: safeJSON(row.credits, []),
    gallery: normalizeImages(safeJSON(row.gallery, []))
  }
}

async function getMusicVideos(env: Env) {
  const { results } = await env.DB
    .prepare(`SELECT * FROM music_videos ORDER BY created_at DESC`)
    .all()

  return json(results.map(hydrateMusicVideo))
}

async function getMusicVideo(slug: string, env: Env) {
  const video = await env.DB
    .prepare(`SELECT * FROM music_videos WHERE slug = ?`)
    .bind(slug)
    .first()

  if (!video) return json({ error: 'Not found' }, 404)
  return json(hydrateMusicVideo(video))
}

async function createMusicVideo(request: Request, env: Env) {
  const data = (await request.json()) as MusicVideoPayload

  await env.DB.prepare(`
    INSERT INTO music_videos (
      slug, title, artist, year,
      video_url, thumbnail, description,
      credits, gallery
    ) VALUES (
      ?,?,?,?,?,?,?,?,?
    )
  `).bind(
    data.slug,
    data.title,
    data.artist,
    data.year,
    data.video_url,
    data.thumbnail,
    data.description,
    JSON.stringify(data.credits || []),
    JSON.stringify(normalizeImages(data.gallery || []))
  ).run()

  return json({ ok: true })
}

async function updateMusicVideo(slug: string, request: Request, env: Env) {
  const data = (await request.json()) as MusicVideoPayload

  await env.DB.prepare(`
    UPDATE music_videos SET
      title = ?, artist = ?, year = ?,
      video_url = ?, thumbnail = ?, description = ?,
      credits = ?, gallery = ?,
      updated_at = datetime('now')
    WHERE slug = ?
  `).bind(
    data.title,
    data.artist,
    data.year,
    data.video_url,
    data.thumbnail,
    data.description,
    JSON.stringify(data.credits || []),
    JSON.stringify(normalizeImages(data.gallery || [])),
    slug
  ).run()

  return json({ ok: true })
}

async function deleteMusicVideo(slug: string, env: Env) {
  await env.DB.prepare(`DELETE FROM music_videos WHERE slug = ?`).bind(slug).run()
  return json({ ok: true })
}

/* =====================
   BLOG
===================== */

async function getBlogPosts(env: Env) {
  const { results } = await env.DB
    .prepare(`
      SELECT
        slug,
        title,
        excerpt,
        cover_image,
        created_at
      FROM blog_posts
      WHERE published = 1
      ORDER BY created_at DESC
    `)
    .all()

  return json(results)
}

async function getBlogPost(slug: string, env: Env) {
  const post = await env.DB
    .prepare(`
      SELECT *
      FROM blog_posts
      WHERE slug = ? AND published = 1
    `)
    .bind(slug)
    .first()

  if (!post) return json({ error: 'Not found' }, 404)
  return json(post)
}

async function createBlogPost(request: Request, env: Env) {
  const data = (await request.json()) as BlogPostPayload

  await env.DB.prepare(`
    INSERT INTO blog_posts (
      slug,
      title,
      excerpt,
      content,
      cover_image,
      published
    ) VALUES (?,?,?,?,?,?)
  `).bind(
    data.slug,
    data.title,
    data.excerpt,
    data.content,
    data.cover_image,
    data.published ? 1 : 0
  ).run()

  return json({ ok: true })
}

async function updateBlogPost(
  slug: string,
  request: Request,
  env: Env
) {
  const body = await request.json() as Partial<BlogPostPayload>

  const title = body.title ?? ''
  const excerpt = body.excerpt ?? ''
  const content = body.content ?? ''
  const cover_image = body.cover_image ?? null
  const published = body.published ? 1 : 0

  await env.DB.prepare(`
    UPDATE blog_posts SET
      title = ?,
      excerpt = ?,
      content = ?,
      cover_image = ?,
      published = ?,
      updated_at = datetime('now')
    WHERE slug = ?
  `).bind(
    title,
    excerpt,
    content,
    cover_image,
    published,
    slug
  ).run()

  return json({ ok: true })
}

async function deleteBlogPost(slug: string, env: Env) {
  await env.DB
    .prepare(`DELETE FROM blog_posts WHERE slug = ?`)
    .bind(slug)
    .run()

  return json({ ok: true })
}


/* =====================
   UPLOAD
===================== */

async function uploadMedia(request: Request, env: Env) {
  const form = await request.formData()

  const file = form.get('file')
  const slug = String(form.get('slug') || 'misc').trim()
  const section = String(form.get('section') || '').trim()

  if (!(file instanceof File)) {
    return json({ error: 'Missing file' }, 400)
  }

  if (!section) {
    return json({ error: 'Missing section' }, 400)
  }

  const ext = file.name.split('.').pop() || 'bin'
  const key = `${section}/${slug}/${crypto.randomUUID()}.${ext}`

  const buffer = await file.arrayBuffer()

  await env.MEDIA_BUCKET.put(key, buffer, {
    httpMetadata: { contentType: file.type }
  })

  const base = env.PUBLIC_MEDIA_BASE.replace(/\/+$/, '')

  return json({
    ok: true,
    key,
    url: `${base}/${key}`
  })
}


/* =====================
   DELETE MEDIA
===================== */

async function deleteMedia(request: Request, env: Env) {
  const { url } = (await request.json()) as { url?: string }
  if (!url) return json({ error: 'Missing url' }, 400)

  const key = new URL(url).pathname.replace(/^\/+/, '')
  await env.MEDIA_BUCKET.delete(key)

  return json({ ok: true, key })
}

/* =====================
   HELPERS
===================== */

function normalizeImages(images: any[]) {
  return images.map(img =>
    typeof img === 'string'
      ? { url: img, exif: null }
      : { url: img.url, exif: img.exif || null }
  )
}

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
