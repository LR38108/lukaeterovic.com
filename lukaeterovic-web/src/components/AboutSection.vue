<template>
  <section
    :class="sectionClasses"
    class="py-20 px-6 md:px-24 text-center transition-colors duration-300"
  >
    <img
      src="/assets/images/Footer.png"
      alt="Luka"
      class="w-32 h-32 md:w-48 md:h-48 mx-auto rounded-full mb-6"
    />
    <h3 class="text-3xl md:text-5xl font-semibold mb-5">
      Hello World I am Luka Eterović…
    </h3>
    <p class="max-w-3xl mx-auto text-base md:text-xl leading-relaxed">
      A Filmmaker, photographer, videographer, designer, writer and creative freelancer
      based in sunny city of Split in Croatia.
    </p>
    <RouterLink
      to="/about"
      class="mt-6 inline-block px-6 py-3 rounded text-base md:text-lg font-semibold transition-opacity hover:opacity-90"
      :class="isLight ? 'bg-black text-white' : 'bg-white text-black'"
    >
      Read more
    </RouterLink>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useTheme } from '@/composables/useTheme.js'

const { isLight } = useTheme()

const sectionClasses = computed(() =>
  isLight.value ? 'bg-white text-black' : 'bg-black text-white'
)
</script>