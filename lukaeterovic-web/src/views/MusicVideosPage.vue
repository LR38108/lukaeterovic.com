<template>
  <section class="min-h-screen pt-24 pb-32">
    <div class="max-w-6xl mx-auto px-4">

      <!-- HEADER -->
      <header class="mb-16">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          Music Videos
        </h1>
        <p class="max-w-xl text-lg opacity-70">
          Selected works exploring sound, rhythm, and visual identity.
        </p>
      </header>

      <!-- GRID -->
      <div class="space-y-12">
        <RouterLink v-for="mv in musicVideos" :key="mv.slug" :to="`/music-videos/${mv.slug}`" class="group block">
          <div class="grid grid-cols-1 md:grid-cols-[360px_1fr] lg:grid-cols-[420px_1fr] gap-8 items-center">


            <!-- THUMB -->
            <div class="relative aspect-video bg-black/5 overflow-hidden rounded">

              <!-- IMAGE -->
              <img v-if="mv.thumbnail" :src="mv.thumbnail" class="absolute inset-0 w-full h-full object-cover
           transition-transform duration-700 ease-out
           group-hover:scale-105" />

              <!-- OVERLAY -->
              <div class="absolute inset-0 flex items-center justify-center
           bg-black/30 opacity-0
           transition-opacity duration-300
           group-hover:opacity-100">
                <!-- PLAY BUTTON -->
                <div class="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                  <div class="ml-1 w-0 h-0
           border-t-[8px] border-b-[8px]
           border-l-[12px]
           border-t-transparent
           border-b-transparent
           border-l-black" />
                </div>
              </div>

            </div>

            <!-- META -->
            <div>
              <div class="text-sm uppercase tracking-wide opacity-50 mb-1">
                {{ mv.artist }} <span v-if="mv.year">· {{ mv.year }}</span>
              </div>

              <div class="text-2xl font-semibold leading-tight">
                {{ mv.title }}
              </div>

              <p v-if="mv.description" class="mt-3 opacity-70 max-w-xl">
                {{ mv.description }}
              </p>
            </div>

          </div>
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