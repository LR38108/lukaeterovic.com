<!-- src/views/GalleriesPage.vue -->
<template>
  <section class="min-h-screen pt-24 pb-24">
    <div class="max-w-7xl mx-auto px-4">

      <!-- HEADER -->
      <header class="mb-16 md:mb-20">
        <h1 class="galleries-page-title text-[2.25rem] md:text-[2.7rem] font-bold uppercase mb-4">
          PHOTOGRAPHY
        </h1>
        <p class="galleries-page-intro text-base md:text-lg opacity-70 max-w-2xl leading-relaxed">
          Curated photographic works — places, moments, and visual essays.
        </p>
      </header>

      <!-- LOADING -->
      <div v-if="loading" class="opacity-60">
        Loading galleries…
      </div>

      <!-- EMPTY -->
      <div v-else-if="galleries.length === 0" class="opacity-60">
        No galleries yet.
      </div>

      <!-- GRID: 1 col mobile, 2 cols on desktop -->
      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12"
      >
        <RouterLink
          v-for="g in galleries"
          :key="g.slug"
          :to="`/photography/${g.slug}`"
          class="group block"
        >
          <!-- IMAGE -->
          <div
            class="relative aspect-[4/5] overflow-hidden bg-black/5"
          >
            <img
              v-if="g.coverImage"
              :src="g.coverImage"
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          </div>

          <!-- Title + meta under banner (all caps title) -->
          <div class="mt-4 text-left">
            <div class="galleries-card-title text-lg md:text-xl font-bold uppercase tracking-[0.06em] leading-tight">
              {{ g.title }}
            </div>
            <div
              v-if="g.location || g.year"
              class="text-sm opacity-60 mt-1"
            >
              {{ [g.location, g.year].filter(Boolean).join(' · ') }}
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useGalleries } from '@/composables/useGalleries'

const { galleries, loading, init } = useGalleries()

onMounted(init)
</script>

<style scoped>
.galleries-page-title {
  font-family: 'U001 Condensed', sans-serif;
  font-weight: 700;
}

.galleries-page-intro {
  font-family: 'U001', sans-serif;
  font-weight: 400;
}

.galleries-card-title {
  font-family: 'U001 Condensed', sans-serif;
  font-weight: 700;
}
</style>
