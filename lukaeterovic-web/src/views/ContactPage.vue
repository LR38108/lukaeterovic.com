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
          class="contact-email-btn mt-10 inline-block px-6 py-3 rounded text-sm md:text-base font-semibold no-underline transition-opacity hover:opacity-90 tracking-normal"
          :class="isLight ? 'bg-black text-white' : 'bg-white text-black'"
        >
          lukaeterovic<span class="contact-email-at">@</span>live.com
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

/* System sans so @ and email read clearly (U001 @ can look cramped) */
.contact-email-btn {
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-weight: 600;
  font-feature-settings: 'kern' 1;
}

.contact-email-at {
  font-weight: 500;
  padding: 0 0.06em;
  opacity: 0.92;
}

footer {
  font-family: 'U001 Condensed', sans-serif;
  font-weight: 700;
}
</style>
