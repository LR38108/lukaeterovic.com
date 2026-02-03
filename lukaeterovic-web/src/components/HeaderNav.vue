<template>
  <header
    class="fixed top-0 left-0 w-full z-40 px-6 py-5 flex justify-between items-center transition-colors duration-300"
    :class="headerClasses"
  >
    <span class="tracking-widest text-lg md:text-2xl cursor-pointer" @click="isMenuOpen = true">
      MENU
    </span>

    <router-link to="/">
      <img :src="logoSrc" class="h-8 md:h-10" />
    </router-link>

    <FullMenu :isOpen="isMenuOpen" @close="isMenuOpen = false" />
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTheme } from '@/composables/useTheme.js'
import { useRoute, RouterLink } from 'vue-router'
import FullMenu from './FullMenu.vue'

const isMenuOpen = ref(false)
const { isLight } = useTheme()
const route = useRoute()

const isHome = computed(() => route.path === '/')

const headerClasses = computed(() => {
  if (isHome.value) return 'text-white'
  return isLight.value ? 'bg-white text-black' : 'bg-black text-white'
})

const logoSrc = computed(() => {
  if (isHome.value) return '/assets/logos/logo_white.svg'
  return isLight.value ? '/assets/logos/logo_black.svg' : '/assets/logos/logo_white.svg'
})
</script>