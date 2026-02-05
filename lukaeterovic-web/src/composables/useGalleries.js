// src/composables/useGalleries.js
import { ref, computed } from 'vue'

const API_BASE = 'https://lukaeterovic-api.radan-luka.workers.dev'
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN

const galleriesRef = ref([])
const loading = ref(false)
const error = ref(null)

let initialized = false

export function useGalleries() {
  /* -----------------------------
   * INIT (LOAD ONCE)
   * ----------------------------- */
  async function init() {
    if (initialized) return
    initialized = true
    await fetchGalleries()
  }

  /* -----------------------------
   * FETCH
   * ----------------------------- */
  async function fetchGalleries() {
    loading.value = true
    error.value = null

    try {
      const res = await fetch(`${API_BASE}/galleries`)
      if (!res.ok) throw new Error('Failed to fetch galleries')

      const raw = await res.json()

      galleriesRef.value = raw.map((g) => ({
        /* identifiers */
        slug: g.slug,
        title: g.title,

        /* listing / card fields */
        year: g.year,
        location: g.location,
        tagline: g.tagline,
        coverImage: g.cover_image,

        /* detail page fields */
        description: g.description,

        /* parsed JSON fields (NO URL MUTATION) */
        images: safeJSON(g.images, []).map(img =>
          typeof img === 'string'
            ? { url: img, exif: null }
            : { url: img.url, exif: img.exif || null }
        ),

        createdAt: g.created_at,
        updatedAt: g.updated_at
      }))
    } catch (e) {
      error.value = e.message || 'Unknown error'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  /* -----------------------------
   * HELPERS
   * ----------------------------- */
  function slugify(input) {
    return String(input || '')
      .trim()
      .toLowerCase()
      .replace(/['"]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  function getBySlug(slug) {
    return galleriesRef.value.find((g) => g.slug === slug)
  }

  function safeJSON(value, fallback) {
    try {
      if (typeof value === 'string') return JSON.parse(value)
      return value ?? fallback
    } catch {
      return fallback
    }
  }

  /* -----------------------------
   * CRUD (API-BACKED)
   * ----------------------------- */
  async function addGallery(gallery) {
    const payload = {
      ...gallery,
      slug: gallery.slug ? slugify(gallery.slug) : slugify(gallery.title)
    }

    if (!payload.slug) {
      throw new Error('Slug is required')
    }

    const res = await fetch(`${API_BASE}/galleries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ADMIN_TOKEN}`
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      const msg = await res.text()
      throw new Error(msg || 'Failed to create gallery')
    }

    await fetchGalleries()
  }

  async function updateGallery(slug, patch) {
    const res = await fetch(`${API_BASE}/galleries/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ADMIN_TOKEN}`
      },
      body: JSON.stringify(patch)
    })

    if (!res.ok) {
      const msg = await res.text()
      throw new Error(msg || 'Failed to update gallery')
    }

    await fetchGalleries()
  }

  async function removeGallery(slug) {
    const res = await fetch(`${API_BASE}/galleries/${slug}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${ADMIN_TOKEN}`
      }
    })

    if (!res.ok) {
      const msg = await res.text()
      throw new Error(msg || 'Failed to delete gallery')
    }

    galleriesRef.value = galleriesRef.value.filter((g) => g.slug !== slug)
  }

  /* -----------------------------
   * PUBLIC API
   * ----------------------------- */
  return {
    galleries: computed(() => galleriesRef.value),
    loading,
    error,

    init,
    fetchGalleries,

    getBySlug,
    addGallery,
    updateGallery,
    removeGallery,
    slugify
  }
}
