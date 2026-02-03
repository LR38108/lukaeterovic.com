export interface Env {
  MEDIA_BUCKET: R2Bucket
  ADMIN_TOKEN: string
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    // ---- CORS (simple + permissive for now)
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders()
      })
    }

    // ---- Auth (everything except GET can be locked later)
    if (request.method !== 'GET') {
      const auth = request.headers.get('Authorization')
      if (!auth || auth !== `Bearer ${env.ADMIN_TOKEN}`) {
        return json({ error: 'Unauthorized' }, 401)
      }
    }

    // ---- Upload endpoint
    if (url.pathname === '/media/upload' && request.method === 'POST') {
      return uploadMedia(request, env)
    }

    // ---- Health check
    if (url.pathname === '/health') {
      return json({ ok: true })
    }

    return json({ error: 'Not found' }, 404)
  }
}

// -------------------------
// Upload logic
// -------------------------

async function uploadMedia(request: Request, env: Env) {
  const contentType = request.headers.get('content-type') || ''
  if (!contentType.includes('multipart/form-data')) {
    return json({ error: 'Expected multipart/form-data' }, 400)
  }

  const form = await request.formData()

  const file = form.get('file')
  const type = String(form.get('type') || 'misc') // film | photo | blog
  const slug = String(form.get('slug') || 'unknown')

  if (!(file instanceof File)) {
    return json({ error: 'Missing file' }, 400)
  }

  const ext = file.name.split('.').pop() || 'bin'
  const safeName = `${crypto.randomUUID()}.${ext}`

  const key = `${type}/${slug}/${safeName}`

  await env.MEDIA_BUCKET.put(key, file.stream(), {
    httpMetadata: {
      contentType: file.type
    }
  })

  const publicUrl = `https://cdn.lukaeterovic.com/${key}`

  return json({
    ok: true,
    key,
    url: publicUrl,
    name: file.name
  })
}

// -------------------------
// Helpers
// -------------------------

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
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  }
}