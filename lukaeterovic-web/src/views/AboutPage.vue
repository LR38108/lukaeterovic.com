<!-- src/views/AboutPage.vue -->
<template>
  <div :class="themeClass" class="min-h-screen pt-24 pb-32 transition-colors duration-300 px-4">
    <div class="max-w-6xl mx-auto">
      <header class="mb-12 md:mb-16">
        <h1 class="about-page-title text-[2.25rem] md:text-[2.7rem] font-bold uppercase mb-4">
          ABOUT
        </h1>
      </header>

      <div class="max-w-2xl mx-auto">
        <div class="flex justify-center mb-10 md:mb-12">
          <img
            src="/assets/images/Footer.png"
            alt="Luka Eterović"
            class="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover shrink-0"
          />
        </div>

        <h2 class="about-page-subtitle text-xl md:text-2xl font-bold uppercase text-center mb-8 tracking-[0.06em]">
          HELLO WORLD. I AM LUKA.
        </h2>

        <div
          class="about-page-body text-base md:text-lg leading-relaxed space-y-5 text-left"
          :class="isLight ? 'text-black/85' : 'text-white/90'"
        >
          <p>
            A filmmaker, photographer, videographer, designer, writer and creative freelancer
            based in the sunny city of Split, Croatia.
          </p>
          <p>
            I work across narrative film, music videos, photography, and visual design — with a
            focus on craft, clarity, and images that stay with you. Whether we’re building a
            campaign, a film, or a still frame, the goal is always the same: professional results,
            class, and aesthetics that hold up over time.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center mt-10 md:mt-12">
          <RouterLink
            to="/contact"
            class="about-btn inline-flex justify-center items-center px-8 py-3 text-sm md:text-base font-semibold uppercase tracking-[0.12em] text-center transition-opacity hover:opacity-90"
            :class="isLight ? 'bg-black text-white' : 'bg-white text-black'"
          >
            Contact me
          </RouterLink>
          <a
            href="/assets/cv.pdf"
            download
            class="about-btn inline-flex justify-center items-center gap-2 px-8 py-3 text-sm md:text-base font-semibold uppercase tracking-[0.12em] text-center transition-opacity hover:opacity-90"
            :class="isLight ? 'bg-black text-white' : 'bg-white text-black'"
          >
            Download CV
            <span aria-hidden="true">↓</span>
          </a>
        </div>

        <div
          class="mt-16 md:mt-20 pt-12 border-t"
          :class="isLight ? 'border-black/15' : 'border-white/15'"
        >
          <h3 class="about-follow-title text-center text-lg md:text-xl font-bold uppercase tracking-[0.1em] mb-8">
            FOLLOW ME
          </h3>
          <div class="flex flex-wrap justify-center items-center gap-x-10 gap-y-6">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              class="about-social-link inline-flex items-center gap-3 text-base font-medium hover:opacity-80 transition-opacity"
            >
              <span>Instagram</span>
              <img src="/assets/icons/IG.svg" alt="" class="h-6 w-6" />
            </a>
            <a
              href="https://www.threads.net/"
              target="_blank"
              rel="noopener noreferrer"
              class="about-social-link inline-flex items-center gap-3 text-base font-medium hover:opacity-80 transition-opacity"
            >
              <span>Threads</span>
              <img src="/assets/icons/Threads.svg" alt="" class="h-6 w-6" />
            </a>
            <a
              href="https://vimeo.com/"
              target="_blank"
              rel="noopener noreferrer"
              class="about-social-link inline-flex items-center gap-3 text-base font-medium hover:opacity-80 transition-opacity"
            >
              <span>Vimeo</span>
              <img src="/assets/icons/vimeo.svg" alt="" class="h-6 w-6" />
            </a>
          </div>
        </div>

        <footer
          class="mt-16 md:mt-20 pt-10 border-t text-center"
          :class="isLight ? 'border-black/15' : 'border-white/15'"
        >
          <p
            class="text-xs uppercase tracking-[0.12em] leading-relaxed"
            :class="isLight ? 'text-black/60' : 'text-white/70'"
          >
            ALL WORK AND MATERIAL ON THIS WEBSITE IS 100% AI FREE.
          </p>
          <p
            class="text-xs uppercase tracking-[0.12em] mt-3"
            :class="isLight ? 'text-black/60' : 'text-white/70'"
          >
            ALL RIGHTS RESERVED 2026
          </p>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useTheme } from '@/composables/useTheme.js'

const { isLight } = useTheme()

const themeClass = computed(() =>
  isLight.value ? 'bg-white text-black' : 'bg-black text-white'
)
</script>

<style scoped>
.about-page-title,
.about-page-subtitle,
.about-follow-title {
  font-family: 'U001 Condensed', sans-serif;
  font-weight: 700;
}

.about-page-body,
.about-social-link {
  font-family: 'U001', sans-serif;
  font-weight: 400;
}

.about-btn {
  border-radius: 0;
}
</style>
