<!-- src/views/HomePage.vue -->
<template>
  <div :class="pageClass" class="min-h-screen overflow-x-hidden">
    <HeroSection />

    <!-- FULL-BLEED HORIZONTALLY + FORCE BACKGROUND -->
    <section
      class="py-10 sm:py-14 lg:py-20"
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
          />
          <CategoryCard
            title="MUSIC VIDEOS"
            image="/assets/images/MusicVideo.jpg"
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