// src/composables/useTheme.js
import { ref, computed, watch } from 'vue'

const isLight = ref(false)

function applyTheme() {
  const root = document.documentElement
  const mode = isLight.value ? 'light' : 'dark'

  // Drives our CSS canvas
  root.dataset.theme = mode

  // Drives Tailwind dark: utilities (if your tailwind uses class-based dark mode)
  root.classList.toggle('dark', mode === 'dark')
}

const toggleTheme = () => {
  isLight.value = !isLight.value
}

watch(isLight, () => {
  if (typeof window !== 'undefined') applyTheme()
})

if (typeof window !== 'undefined') {
  applyTheme()
}

const themeClass = computed(() => (isLight.value ? 'theme-light' : 'theme-dark'))

export function useTheme() {
  return {
    isLight,
    toggleTheme,
    themeClass
  }
}