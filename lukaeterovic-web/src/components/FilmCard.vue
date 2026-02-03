<!-- src/components/FilmCard.vue -->
<template>
  <router-link :to="`/film/${slug}`" class="block group">
    <section class="w-full max-w-2xl mx-auto mb-16">
      <!-- Poster -->
      <div class="overflow-hidden rounded-sm">
        <img
          :src="poster"
          alt="Poster"
          class="w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          loading="lazy"
        />
      </div>

      <!-- Title -->
      <h2 class="text-3xl md:text-5xl font-bold text-center mt-6 mb-6 px-4">
        {{ title }}
      </h2>

      <!-- Metadata Row -->
      <div
        class="flex text-center text-sm font-semibold border border-black/20 dark:border-white/30 divide-x divide-black/20 dark:divide-white/30 bg-black text-white rounded-sm overflow-hidden"
      >
        <div class="flex-1 py-2">{{ year }}</div>
        <div class="flex-1 py-2">{{ duration }}</div>
        <div class="flex-1 py-2">{{ type }}</div>
        <div class="flex-1 py-2">
          {{ Array.isArray(genres) ? genres.join(', ') : genres }}
        </div>
      </div>

      <!-- Description -->
      <div class="px-4 mt-5 text-sm md:text-base leading-relaxed">
        <p v-if="tagline" class="italic font-medium mb-2">"{{ tagline }}"</p>
        <p>{{ description }}</p>
      </div>

      <!-- Buttons (visual only; whole card is the link) -->
      <div class="flex flex-col sm:flex-row justify-center items-center gap-3 mt-7 px-4">
        <span
          class="px-6 py-3 rounded border transition-colors duration-300"
          :class="isLight ? 'border-black text-black bg-white' : 'border-white text-white bg-black'"
        >
          Read more
        </span>

        <span
          class="px-6 py-3 rounded border transition-colors duration-300"
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