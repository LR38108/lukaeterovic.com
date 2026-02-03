<!-- src/views/FilmPage.vue -->
<template>
  <div :class="themeClass" class="min-h-screen pt-20 transition-colors duration-300 px-4">
    <div class="max-w-6xl mx-auto">
      <div class="grid gap-16 sm:grid-cols-2">
        <FilmCard
          v-for="film in films"
          :key="film.slug"
          v-bind="film"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme.js'
import FilmCard from '@/components/FilmCard.vue'
import { useFilms } from '@/composables/useFilms.js'

const { isLight } = useTheme()
const themeClass = computed(() => (isLight.value ? 'bg-white text-black' : 'bg-black text-white'))

const { films } = useFilms()
</script>