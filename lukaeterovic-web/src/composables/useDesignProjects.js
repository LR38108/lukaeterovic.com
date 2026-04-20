// src/composables/useDesignProjects.js
import { ref, computed, onMounted } from 'vue'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://lukaeterovic-api.radan-luka.workers.dev'
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN

const designProjectsRef = ref([])
const loading = ref(false)
const error = ref(null)

let initialized = false

export function useDesignProjects() {
  async function init() {
    if (initialized) return
    initialized = true
    await fetchDesignProjects()
  }

  async function fetchDesignProjects() {
    loading.value = true
    error.value = null

    try {
      const res = await fetch(`${API_BASE}/design-projects`)
      if (!res.ok) throw new Error('Failed to fetch design projects')

      const raw = await res.json()

      designProjectsRef.value = raw.map(p => ({
        slug: p.slug,
        title: p.title,
        client: p.client,
        year: p.year,
        thumbnail: p.thumbnail,
        heroImage: p.hero_image,
        description: p.description,
        textMiddle: p.text_middle ?? '',
        textFooter: p.text_footer ?? '',
        credits: safeJSON(p.credits, []),
        gallery: normalizeImages(safeJSON(p.gallery, [])),
        createdAt: p.created_at,
        updatedAt: p.updated_at
      }))
    } catch (e) {
      error.value = e.message || 'Unknown error'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  async function addDesignProject(payload) {
    const res = await fetch(`${API_BASE}/design-projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ADMIN_TOKEN}`
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) throw new Error(await res.text())
    await fetchDesignProjects()
  }

  async function updateDesignProject(slug, payload) {
    const res = await fetch(`${API_BASE}/design-projects/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ADMIN_TOKEN}`
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) throw new Error(await res.text())
    await fetchDesignProjects()
  }

  async function removeDesignProject(slug) {
    const res = await fetch(`${API_BASE}/design-projects/${slug}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
    })

    if (!res.ok) throw new Error(await res.text())
    designProjectsRef.value = designProjectsRef.value.filter(p => p.slug !== slug)
  }

  onMounted(() => {
    if (!designProjectsRef.value.length) init()
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

  return {
    designProjects: computed(() => designProjectsRef.value),
    loading,
    error,

    init,
    fetchDesignProjects,
    addDesignProject,
    updateDesignProject,
    removeDesignProject
  }
}
