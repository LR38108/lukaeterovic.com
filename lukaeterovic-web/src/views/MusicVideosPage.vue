<template>
  <section class="min-h-screen pt-24 pb-32">
    <div class="max-w-6xl mx-auto px-4">

      <!-- HEADER -->
      <header class="mb-16 md:mb-20">
        <h1 class="music-videos-page-title text-[2.25rem] md:text-[2.7rem] font-bold uppercase mb-4">
          MUSIC VIDEOS
        </h1>
        <p class="music-videos-page-intro text-base md:text-lg opacity-70 max-w-2xl leading-relaxed">
          Selected works exploring sound, rhythm, and visual identity.
        </p>
      </header>

      <!-- GRID: 1 col mobile, 2 cols (50% each) landscape -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
        <RouterLink
          v-for="mv in musicVideos"
          :key="mv.slug"
          :to="`/music-videos/${mv.slug}`"
          class="group block"
        >
          <!-- COVER -->
          <div class="relative aspect-video bg-black/5 overflow-hidden rounded">
            <img
              v-if="mv.thumbnail"
              :src="mv.thumbnail"
              :alt="mv.title"
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div class="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/90 flex items-center justify-center">
                <div class="ml-1 w-0 h-0 border-t-[6px] border-b-[6px] border-l-[10px] md:border-t-[8px] md:border-b-[8px] md:border-l-[12px] border-t-transparent border-b-transparent border-l-black" />
              </div>
            </div>
          </div>
          <!-- TITLE (below, left) -->
          <h2 class="mt-3 text-left text-lg md:text-xl font-semibold leading-tight group-hover:underline">
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
</style>