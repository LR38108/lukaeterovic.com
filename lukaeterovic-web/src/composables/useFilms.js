// src/composables/useFilms.js
import { ref, computed } from 'vue'

const API_BASE = 'https://lukaeterovic-api.radan-luka.workers.dev'
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN

const filmsRef = ref([])
const loading = ref(false)
const error = ref(null)

let initialized = false

export function useFilms() {
  /* -----------------------------
   * INIT (LOAD ONCE)
   * ----------------------------- */
  async function init() {
    if (initialized) return
    initialized = true
    await fetchFilms()
  }

  /* -----------------------------
   * FETCH
   * ----------------------------- */
  async function fetchFilms() {
    loading.value = true
    error.value = null

    try {
      const res = await fetch(`${API_BASE}/films`)
      if (!res.ok) throw new Error('Failed to fetch films')

      const raw = await res.json()

      filmsRef.value = raw.map((f) => ({
        /* identifiers */
        slug: f.slug,
        title: f.title,

        /* FilmCard fields */
        year: f.year,
        duration: f.duration,
        type: f.type,
        genres: f.genres,
        tagline: f.tagline,
        description: f.description,
        poster: f.poster,

        /* FilmDetail fields */
        originalTitle: f.original_title,
        language: f.language,
        runtime: f.runtime,
        releaseYear: f.release_year,
        genreFull: f.genre_full,
        format: f.format,

        plotSummary: f.plot_summary,
        aboutProject: f.about_project,

        /* parsed JSON fields (NO URL MUTATION) */
        credits: safeJSON(f.credits, []),
        gallery: safeJSON(f.gallery, []),
        tech: safeJSON(f.tech, {}),

        watchUrl: f.watch_url,

        createdAt: f.created_at,
        updatedAt: f.updated_at
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
    return filmsRef.value.find((f) => f.slug === slug)
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
  async function addFilm(film) {
    const payload = {
      ...film,
      slug: film.slug ? slugify(film.slug) : slugify(film.title)
    }

    if (!payload.slug) {
      throw new Error('Slug is required')
    }

    const res = await fetch(`${API_BASE}/films`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ADMIN_TOKEN}`
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      const msg = await res.text()
      throw new Error(msg || 'Failed to create film')
    }

    await fetchFilms()
  }

  async function updateFilm(slug, patch) {
    const res = await fetch(`${API_BASE}/films/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ADMIN_TOKEN}`
      },
      body: JSON.stringify(patch)
    })

    if (!res.ok) {
      const msg = await res.text()
      throw new Error(msg || 'Failed to update film')
    }

    await fetchFilms()
  }

  async function removeFilm(slug) {
    const res = await fetch(`${API_BASE}/films/${slug}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${ADMIN_TOKEN}`
      }
    })

    if (!res.ok) {
      const msg = await res.text()
      throw new Error(msg || 'Failed to delete film')
    }

    filmsRef.value = filmsRef.value.filter((f) => f.slug !== slug)
  }

  /* -----------------------------
   * PUBLIC API
   * ----------------------------- */
  return {
    films: computed(() => filmsRef.value),
    loading,
    error,

    init,
    fetchFilms,

    getBySlug,
    addFilm,
    updateFilm,
    removeFilm,
    slugify
  }
}