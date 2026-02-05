<!-- src/views/GalleriesPage.vue -->
<template>
  <section class="min-h-screen pt-24 pb-24">
    <div class="max-w-7xl mx-auto px-4">

      <!-- HEADER -->
      <header class="mb-16">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          Photography
        </h1>
        <p class="max-w-xl text-lg opacity-70">
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

      <!-- GRID -->
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
      >
        <RouterLink
          v-for="g in galleries"
          :key="g.slug"
          :to="`/photography/${g.slug}`"
          class="group block"
        >
          <!-- IMAGE -->
          <div
            class="relative aspect-[4/5] overflow-hidden rounded-lg bg-black/5"
          >
            <img
              v-if="g.coverImage"
              :src="g.coverImage"
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />

            <!-- OVERLAY -->
            <div
              class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />

            <!-- TEXT -->
            <div
              class="absolute bottom-0 left-0 right-0 p-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <div class="text-lg font-semibold leading-tight">
                {{ g.title }}
              </div>
              <div class="text-sm opacity-80 mt-1">
                <span v-if="g.location">{{ g.location }}</span>
                <span v-if="g.year"> · {{ g.year }}</span>
              </div>
            </div>
          </div>

          <!-- BELOW IMAGE (MOBILE / ACCESSIBILITY) -->
          <div class="mt-3 lg:hidden">
            <div class="font-semibold">{{ g.title }}</div>
            <div class="text-sm opacity-60">
              <span v-if="g.location">{{ g.location }}</span>
              <span v-if="g.year"> · {{ g.year }}</span>
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
