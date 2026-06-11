<template>
  <section class="min-h-screen pt-24 pb-32">
    <div class="max-w-6xl mx-auto px-4">

      <!-- HEADER -->
      <header class="mb-16 md:mb-20">
        <h1 class="music-videos-page-title text-[2.25rem] md:text-[2.7rem] font-bold uppercase mb-4">
          MUSIC VIDEOS
        </h1>
        <p class="music-videos-page-intro text-base md:text-lg opacity-70 max-w-2xl leading-relaxed">
          Shot and/or directed music film by Luka Eterović.
        </p>
      </header>

      <!-- GRID: 2 per row, single item spans full width -->
      <div class="grid grid-cols-2 gap-x-6 gap-y-12 sm:gap-x-10 md:gap-x-14 md:gap-y-14">
        <RouterLink
          v-for="mv in musicVideos"
          :key="mv.slug"
          :to="`/music-videos/${mv.slug}`"
          class="group block"
          :class="musicVideos.length === 1 ? 'col-span-2' : ''"
        >
          <!-- COVER -->
          <div class="relative aspect-video bg-black/5 overflow-hidden">
            <img
              v-if="mv.thumbnail"
              :src="mv.thumbnail"
              :alt="mv.title"
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
          <!-- TITLE (below, left — all caps, condensed) -->
          <h2 class="music-videos-card-title mt-4 text-left text-base md:text-lg font-bold uppercase tracking-[0.06em] leading-tight">
            {{ mv.title }}
          </h2>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { onMounted } from 'vue'
  import { useMusicVideos } from '@/composables/useMusicVideos'

  const { musicVideos, init } = useMusicVideos()
  onMounted(init)
</script>

<style scoped>
.music-videos-page-title {
  font-family: 'U001 Condensed', sans-serif;
  font-weight: 700;
}

.music-videos-page-intro {
  font-family: 'U001', sans-serif;
  font-weight: 400;
}

.music-videos-card-title {
  font-family: 'U001 Condensed', sans-serif;
  font-weight: 700;
}
</style>