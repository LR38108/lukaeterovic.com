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

        <div
          class="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-lg mx-auto"
        >
          <a
            href="mailto:lukaeterovic@live.com"
            class="contact-cta-btn flex-1 min-w-0 inline-flex items-center justify-center gap-0 px-5 py-3.5 text-sm md:text-base font-semibold no-underline transition-opacity hover:opacity-90 tracking-normal rounded-none"
            :class="ctaBtnClass"
          >
            lukaeterovic<span class="contact-email-at">@</span>live.com
          </a>

          <a
            v-if="hasWhatsapp"
            :href="whatsappHref"
            target="_blank"
            rel="noopener noreferrer"
            class="contact-cta-btn flex-1 min-w-0 inline-flex items-center justify-center gap-2.5 px-5 py-3.5 text-sm md:text-base font-semibold no-underline transition-opacity hover:opacity-90 rounded-none"
            :class="ctaBtnClass"
          >
            <svg
              class="contact-wa-icon h-5 w-5 shrink-0"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
              />
            </svg>
            <span>Chat on Whatsapp</span>
          </a>
          <span
            v-else
            class="contact-cta-btn flex-1 min-w-0 inline-flex items-center justify-center gap-2.5 px-5 py-3.5 text-sm md:text-base font-semibold rounded-none cursor-default opacity-50"
            :class="ctaBtnClass"
            title="Set VITE_CONTACT_WHATSAPP in .env.local (digits only, country code included)"
          >
            <svg class="contact-wa-icon h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
              />
            </svg>
            <span>Chat on Whatsapp</span>
          </span>
        </div>
      </div>
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

/** White buttons on dark page, black on light page (same as previous single CTA). */
const ctaBtnClass = computed(() =>
  isLight.value ? 'bg-black text-white' : 'bg-white text-black'
)

const whatsappDigits = computed(() => {
  const raw = import.meta.env.VITE_CONTACT_WHATSAPP ?? ''
  return String(raw).replace(/\D/g, '')
})

const hasWhatsapp = computed(() => whatsappDigits.value.length >= 10)

const whatsappHref = computed(() =>
  hasWhatsapp.value ? `https://wa.me/${whatsappDigits.value}` : ''
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

.contact-cta-btn {
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
  opacity: 0.92;
}

.contact-wa-icon {
  display: block;
}
</style>
