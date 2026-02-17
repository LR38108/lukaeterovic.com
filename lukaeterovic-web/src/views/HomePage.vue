<!-- src/views/HomePage.vue -->
<template>
  <div :class="pageClass" class="min-h-screen overflow-x-hidden">
    <HeroSection />

    <!-- FULL-BLEED HORIZONTALLY + FORCE BACKGROUND -->
    <section
      class="py-8 sm:py-12 lg:py-18"
      :class="isLight ? 'bg-white' : 'bg-black'"
    >
      <div class="w-full">
        <div class="grid grid-cols-1 gap-y-8">
          <CategoryCard
            title="FILM"
            image="/assets/images/Film.jpeg"
            route="/film"
          />
          <CategoryCard
            title="PHOTOGRAPHY"
            image="/assets/images/Photography.jpeg"
            route="/photography"
          />
          <CategoryCard
            title="MUSIC VIDEOS"
            image="/assets/images/MusicVideo.jpg"
            route="/music-videos"
          />
        </div>
      </div>
    </section>

    <AboutSection />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import HeroSection from '@/components/HeroSection.vue'
import CategoryCard from '@/components/CategoryCard.vue'
import AboutSection from '@/components/AboutSection.vue'
import { useTheme } from '@/composables/useTheme.js'

const { isLight } = useTheme()

const pageClass = computed(() =>
  isLight.value ? 'bg-white text-black' : 'bg-black text-white'
)
</script>