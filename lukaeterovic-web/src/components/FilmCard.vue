<!-- src/components/FilmCard.vue -->
<template>
  <router-link :to="`/film/${slug}`" class="block group h-full">
    <section class="flex flex-col w-full max-w-2xl mx-auto mb-16">
      <!-- Poster: fixed 2:3 frame so every film tile matches regardless of source image size -->
      <div class="relative w-full aspect-[2/3] overflow-hidden bg-black/10">
        <img
          :src="poster"
          alt="Poster"
          class="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
          loading="lazy"
        />
      </div>

      <!-- Title -->
      <h2 class="text-3xl md:text-5xl font-bold text-center mt-6 mb-6 px-4">
        {{ title }}
      </h2>

      <!-- Metadata Row -->
      <div
        class="flex text-center text-sm font-semibold border border-black divide-x divide-black bg-white text-black overflow-hidden"
      >
        <div class="flex-1 py-2">{{ year }}</div>
        <div class="flex-1 py-2">{{ duration }}</div>
        <div class="flex-1 py-2">{{ type }}</div>
        <div class="flex-1 py-2">
          {{ Array.isArray(genres) ? genres.join(', ') : genres }}
        </div>
      </div>

      <!-- Buttons (visual only; whole card is the link) -->
      <div class="flex flex-col sm:flex-row justify-center items-center gap-3 mt-7 px-4">
        <span
          class="px-6 py-3 rounded-none border transition-colors duration-300"
          :class="isLight ? 'border-black text-black bg-white' : 'border-white text-white bg-black'"
        >
          Read more
        </span>

        <span
          class="px-6 py-3 rounded-none border transition-colors duration-300"
          :class="isLight ? 'border-black text-black bg-white' : 'border-white text-white bg-black'"
        >
          ▶ Watch Film
        </span>
      </div>
    </section>
  </router-link>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme.js'
const { isLight } = useTheme()

defineProps({
  slug: String,
  title: String,
  year: String,
  duration: String,
  type: String,
  genres: [String, Array],
  tagline: String,
  description: String,
  poster: String
})
</script>