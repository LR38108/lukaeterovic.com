// src/composables/useFilms.js
import { computed, ref } from 'vue'
import { films as defaultFilms } from '@/data/films.js'

const STORAGE_KEY = 'films_admin_v1'

function safeParse(json, fallback) {
  try {
    const parsed = JSON.parse(json)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

function loadInitialFilms() {
  if (typeof window === 'undefined') return [...defaultFilms]
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return [...defaultFilms]
  const parsed = safeParse(raw, null)
  return Array.isArray(parsed) ? parsed : [...defaultFilms]
}

const filmsRef = ref(loadInitialFilms())

function persist() {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filmsRef.value))
}

function slugify(input) {
  return String(input || '')
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function useFilms() {
  const films = computed(() => filmsRef.value)

  const getBySlug = (slug) => filmsRef.value.find((f) => f.slug === slug)

  const addFilm = (film) => {
    const next = { ...film }
    next.slug = next.slug ? slugify(next.slug) : slugify(next.title)
    if (!next.slug) throw new Error('Slug is required')

    const exists = filmsRef.value.some((f) => f.slug === next.slug)
    if (exists) throw new Error('Slug already exists')

    filmsRef.value = [next, ...filmsRef.value]
    persist()
  }

  const updateFilm = (slug, patch) => {
    const idx = filmsRef.value.findIndex((f) => f.slug === slug)
    if (idx === -1) throw new Error('Film not found')

    const updated = { ...filmsRef.value[idx], ...patch }

    // If slug changes, ensure uniqueness
    if (patch.slug && patch.slug !== slug) {
      const newSlug = slugify(patch.slug)
      const exists = filmsRef.value.some((f, i) => i !== idx && f.slug === newSlug)
      if (exists) throw new Error('New slug already exists')
      updated.slug = newSlug
    }

    filmsRef.value.splice(idx, 1, updated)
    filmsRef.value = [...filmsRef.value]
    persist()
  }

  const removeFilm = (slug) => {
    filmsRef.value = filmsRef.value.filter((f) => f.slug !== slug)
    persist()
  }

  const resetToDefault = () => {
    filmsRef.value = [...defaultFilms]
    persist()
  }

  return {
    films,
    getBySlug,
    addFilm,
    updateFilm,
    removeFilm,
    resetToDefault,
    slugify
  }
}