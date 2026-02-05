// src/composables/useMusicVideos.js
import { ref, computed, onMounted } from 'vue'

const API_BASE = import.meta.env.VITE_API_BASE_URL
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN

const musicVideosRef = ref([])
const loading = ref(false)
const error = ref(null)

let initialized = false

export function useMusicVideos() {
  /* -----------------------------
   * INIT (LOAD ONCE)
   * ----------------------------- */
  async function init() {
    if (initialized) return
    initialized = true
    await fetchMusicVideos()
  }

  /* -----------------------------
   * FETCH
   * ----------------------------- */
  async function fetchMusicVideos() {
    loading.value = true
    error.value = null

    try {
      const res = await fetch(`${API_BASE}/music-videos`)
      if (!res.ok) throw new Error('Failed to fetch music videos')

      const raw = await res.json()

      musicVideosRef.value = raw.map(v => ({
        slug: v.slug,
        title: v.title,
        artist: v.artist,
        year: v.year,
        videoUrl: v.video_url,
        description: v.description,
        thumbnail: v.thumbnail,
        credits: safeJSON(v.credits, []),
        gallery: normalizeImages(safeJSON(v.gallery, [])),
        createdAt: v.created_at,
        updatedAt: v.updated_at
      }))
    } catch (e) {
      error.value = e.message || 'Unknown error'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  /* -----------------------------
   * CRUD
   * ----------------------------- */
  async function addMusicVideo(payload) {
    const res = await fetch(`${API_BASE}/music-videos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ADMIN_TOKEN}`
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) throw new Error(await res.text())
    await fetchMusicVideos()
  }

  async function updateMusicVideo(slug, payload) {
    const res = await fetch(`${API_BASE}/music-videos/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ADMIN_TOKEN}`
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) throw new Error(await res.text())
    await fetchMusicVideos()
  }

  async function removeMusicVideo(slug) {
    const res = await fetch(`${API_BASE}/music-videos/${slug}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
    })

    if (!res.ok) throw new Error(await res.text())
    musicVideosRef.value = musicVideosRef.value.filter(v => v.slug !== slug)
  }

  /* -----------------------------
   * AUTO INIT SAFETY
   * ----------------------------- */
  onMounted(() => {
    if (!musicVideosRef.value.length) init()
  })

  /* -----------------------------
   * HELPERS
   * ----------------------------- */
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

  /* -----------------------------
   * PUBLIC API
   * ----------------------------- */
  return {
    musicVideos: computed(() => musicVideosRef.value),
    loading,
    error,

    init,
    fetchMusicVideos,
    addMusicVideo,
    updateMusicVideo,
    removeMusicVideo
  }
}
