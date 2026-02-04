<template>
  <div :class="appClass" class="min-h-screen overflow-x-hidden">
    <HeaderNav /> <!-- Always visible -->
    <router-view /> <!-- Page-specific content -->
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { onMounted } from 'vue'
import HeaderNav from '@/components/HeaderNav.vue'
import { useTheme } from '@/composables/useTheme'
import { useFilms } from '@/composables/useFilms'

const { init } = useFilms()

onMounted(() => {
  init()
})

const { isLight } = useTheme()

// Force the root app canvas to always paint
const appClass = computed(() => (isLight.value ? 'bg-white text-black' : 'bg-black text-white'))
</script>