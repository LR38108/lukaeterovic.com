<template>
  <section
    :class="sectionClasses"
    class="py-20 px-6 md:px-24 text-center transition-colors duration-300"
  >
    <img
      src="/assets/images/Footer.jpg"
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
    <button
        class="mt-6 px-6 py-3 rounded text-base md:text-lg font-semibold"
        :class="isLight ? 'bg-black text-white' : 'bg-white text-black'"
        >
        Read more
    </button>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme.js'

const { isLight } = useTheme()

const sectionClasses = computed(() =>
  isLight.value ? 'bg-white text-black' : 'bg-black text-white'
)

const readMore = () => {
  alert("Redirecting to full bio...")
}
</script>