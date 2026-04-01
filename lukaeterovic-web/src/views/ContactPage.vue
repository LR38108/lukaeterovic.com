<!-- src/views/ContactPage.vue -->
<template>
  <div :class="themeClass" class="min-h-screen pt-24 pb-32 transition-colors duration-300 px-4">
    <div class="max-w-6xl mx-auto">
      <header class="mb-16 md:mb-20">
        <h1 class="contact-page-title text-[2.25rem] md:text-[2.7rem] font-bold uppercase mb-4">
          CONTACT
        </h1>
      </header>

      <div class="max-w-2xl mx-auto text-center">
        <h2 class="contact-page-subtitle text-2xl md:text-3xl font-bold uppercase mb-8 md:mb-10 leading-tight">
          LET'S WORK TOGETHER
        </h2>

        <div
          class="contact-page-body text-base md:text-lg leading-relaxed space-y-4"
          :class="isLight ? 'text-black/80' : 'text-white/90'"
        >
          <p>You like what you see and want to collaborate?</p>
          <p>
            Get my recognizable signature on something that will last a lifetime (and basically,
            forever).
          </p>
          <p>Whether it's photography, video, film, or design,</p>
          <p>I guarantee professional results, class, and top-notch aesthetics.</p>
          <p>Feel free to reach out and I'll send you a quote.</p>
          <p>Looking forward to creating something beautiful :)</p>
        </div>

        <a
          href="mailto:lukaeterovic@live.com"
          class="contact-email-glow contact-page-body mt-10 inline-block text-2xl md:text-3xl font-normal underline underline-offset-[0.2em] hover:opacity-90 transition-opacity"
          :class="isLight ? 'text-black decoration-black/35' : 'text-white decoration-white/50'"
        >
          lukaeterovic@live.com
        </a>

        <a
          href="mailto:lukaeterovic@live.com"
          class="mt-8 inline-flex"
          :class="isLight ? 'text-black/70 hover:text-black' : 'text-white/80 hover:text-white'"
          aria-label="Email"
        >
          <svg
            class="w-7 h-7"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>

      <footer
        class="mt-20 md:mt-24 pt-10 max-w-2xl mx-auto text-center border-t"
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
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme.js'

const { isLight } = useTheme()

const themeClass = computed(() =>
  isLight.value ? 'bg-white text-black' : 'bg-black text-white'
)
</script>

<style scoped>
.contact-page-title,
.contact-page-subtitle {
  font-family: 'U001 Condensed', sans-serif;
  font-weight: 700;
}

.contact-page-body {
  font-family: 'U001', sans-serif;
  font-weight: 400;
}

.contact-email-glow {
  transition:
    text-shadow 0.35s ease,
    opacity 0.35s ease;
}

html[data-theme='dark'] .contact-email-glow {
  text-shadow:
    0 0 10px rgba(255, 255, 255, 0.28),
    0 0 26px rgba(255, 255, 255, 0.12);
}

html[data-theme='dark'] .contact-email-glow:hover {
  text-shadow:
    0 0 14px rgba(255, 255, 255, 0.4),
    0 0 32px rgba(255, 255, 255, 0.18);
}

html[data-theme='light'] .contact-email-glow {
  text-shadow:
    0 0 8px rgba(0, 0, 0, 0.06),
    0 0 18px rgba(0, 0, 0, 0.04);
}

footer {
  font-family: 'U001 Condensed', sans-serif;
  font-weight: 700;
}
</style>
