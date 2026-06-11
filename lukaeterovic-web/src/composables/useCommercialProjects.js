import { ref, computed, onMounted } from 'vue'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://lukaeterovic-api.radan-luka.workers.dev'
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN

const commercialProjectsRef = ref([])
const loading = ref(false)
const error = ref(null)

let initialized = false

export function useCommercialProjects() {
  async function init() {
    if (initialized) return
    initialized = true
    await fetchCommercialProjects()
  }

  async function fetchCommercialProjects() {
    loading.value = true
    error.value = null

    try {
      const res = await fetch(`${API_BASE}/commercial-projects`)
      if (!res.ok) throw new Error('Failed to fetch commercial projects')

      const raw = await res.json()

      commercialProjectsRef.value = raw.map(p => {
        const title = p.title ?? ''
        const slug = p.slug ?? ''

        return {
          slug,
          publicSlug: slug || slugify(title),
          title,
          client: p.client ?? '',
          subtitle: p.subtitle ?? '',
          about: p.about ?? p.description ?? '',
          thumbnail: p.thumbnail || p.hero_image,
          heroImage: p.hero_image || p.thumbnail,
          credits: safeJSON(p.credits, []),
          gallery: normalizeImages(safeJSON(p.gallery, [])),
          createdAt: p.created_at,
          updatedAt: p.updated_at
        }
      })
    } catch (e) {
      error.value = e.message || 'Unknown error'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  async function addCommercialProject(payload) {
    const res = await fetch(`${API_BASE}/commercial-projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ADMIN_TOKEN}`
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) throw new Error(await res.text())
    initialized = false
    await init()
  }

  async function updateCommercialProject(slug, payload) {
    const res = await fetch(`${API_BASE}/commercial-projects/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ADMIN_TOKEN}`
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) throw new Error(await res.text())
    initialized = false
    await init()
  }

  async function removeCommercialProject(slug) {
    const res = await fetch(`${API_BASE}/commercial-projects/${slug}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
    })

    if (!res.ok) throw new Error(await res.text())
    commercialProjectsRef.value = commercialProjectsRef.value.filter(p => p.slug !== slug)
  }

  onMounted(() => {
    if (!commercialProjectsRef.value.length) init()
  })

  function normalizeImages(images) {
    return images.map(img =>
      typeof img === 'string'
        ? img
        : img.url
    )
  }

  function safeJSON(value, fallback) {
    try {
      return typeof value === 'string' ? JSON.parse(value) : value ?? fallback
    } catch {
      return fallback
    }
  }

  function slugify(value) {
    return String(value)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  return {
    commercialProjects: computed(() => commercialProjectsRef.value),
    loading,
    error,

    init,
    fetchCommercialProjects,
    addCommercialProject,
    updateCommercialProject,
    removeCommercialProject
  }
}
