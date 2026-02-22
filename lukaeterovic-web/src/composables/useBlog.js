// src/composables/useBlog.js
import { ref, computed } from 'vue'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://lukaeterovic-api.radan-luka.workers.dev'

const postsRef = ref([])
const loading = ref(false)
const error = ref(null)

let initialized = false

export function useBlog() {
  async function init() {
    if (initialized) return
    initialized = true
    await fetchPosts()
  }

  async function fetchPosts() {
    loading.value = true
    try {
      const res = await fetch(`${API_BASE}/blog`)
      if (!res.ok) throw new Error('Failed to fetch blog')
      postsRef.value = await res.json()
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  function getBySlug(slug) {
    return postsRef.value.find(p => p.slug === slug)
  }

  return {
    posts: computed(() => postsRef.value),
    loading,
    error,
    init,
    getBySlug
  }
}
