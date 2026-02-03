<template>
  <div :class="appClass" class="min-h-screen overflow-x-hidden">
    <HeaderNav /> <!-- Always visible -->
    <router-view /> <!-- Page-specific content -->
  </div>
</template>

<script setup>
import { computed } from 'vue'
import HeaderNav from '@/components/HeaderNav.vue'
import { useTheme } from '@/composables/useTheme'

const { isLight } = useTheme()

// Force the root app canvas to always paint
const appClass = computed(() => (isLight.value ? 'bg-white text-black' : 'bg-black text-white'))
</script>