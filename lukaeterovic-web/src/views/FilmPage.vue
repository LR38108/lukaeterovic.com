<!-- src/views/FilmPage.vue -->
<template>
  <div :class="themeClass" class="min-h-screen pt-20 transition-colors duration-300 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- HEADER -->
      <header class="mb-16 md:mb-20">
        <h1 class="film-page-title text-[2.25rem] md:text-[2.7rem] font-bold uppercase mb-4">
          FILM
        </h1>
        <p class="film-page-intro text-base md:text-lg opacity-70 max-w-2xl leading-relaxed">
          A selection of narrative and documentary work. Each project is a chance to explore story, form, and collaboration.
        </p>
      </header>

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

<style scoped>
.film-page-title {
  font-family: 'U001 Condensed', sans-serif;
  font-weight: 700;
}

.film-page-intro {
  font-family: 'U001', sans-serif;
  font-weight: 400;
}
</style>