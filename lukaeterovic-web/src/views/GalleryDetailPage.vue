<!-- src/views/GalleryDetailPage.vue -->
<template>
  <section v-if="gallery" class="min-h-screen">

    <!-- HERO -->
    <header class="pt-28 pb-24 text-center max-w-3xl mx-auto px-4 reveal is-visible">
      <h1 class="text-4xl md:text-5xl font-bold mb-4">
        {{ gallery.title }}
      </h1>

      <p v-if="gallery.tagline" class="text-lg opacity-70 mb-4">
        {{ gallery.tagline }}
      </p>

      <div class="text-sm uppercase tracking-wide opacity-50">
        <span v-if="gallery.location">{{ gallery.location }}</span>
        <span v-if="gallery.year"> · {{ gallery.year }}</span>
      </div>

      <p
        v-if="gallery.description"
        class="mt-8 text-base opacity-80 leading-relaxed"
      >
        {{ gallery.description }}
      </p>
    </header>

    <!-- GRID -->
    <div class="max-w-7xl mx-auto px-4 pb-32">
      <div class="columns-1 sm:columns-2 lg:columns-3 gap-6">
        <div
        v-for="(img, i) in gallery.images"
        :key="img"
        class="mb-6 break-inside-avoid cursor-zoom-in reveal"
        :style="{ transitionDelay: `${Math.min(i * 40, 240)}ms` }"
        @click="openLightbox(i)"
        ref="revealEls"
        >
          <img
            :src="img.url || img"
            loading="lazy"
            class="w-full rounded-lg hover:opacity-90 transition"
          />
        </div>
      </div>
    </div>

    <!-- LIGHTBOX -->
    <teleport to="body">
      <div
        v-if="lightbox.open"
        class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center touch-pan-y"
        @click.self="closeLightbox"
        @touchstart.passive="onTouchStart"
        @touchmove.passive="onTouchMove"
        @touchend="onTouchEnd"
        >

        <!-- IMAGE -->
        <img
          :src="gallery.images[lightbox.index].url || gallery.images[lightbox.index]"
          class="max-h-[90vh] max-w-[90vw] object-contain"
          @click.stop="toggleExif"
        />

        <!-- EXIF OVERLAY -->
        <div
          v-if="currentExif"
          class="absolute bottom-6 left-1/2 -translate-x-1/2
                bg-black/60 backdrop-blur
                text-white text-xs
                px-4 py-2 rounded-full
                opacity-0 transition-opacity duration-300"
          :class="{ 'opacity-100': showExif }"
        >
          <span v-if="currentExif.camera">{{ currentExif.camera }}</span>
          <span v-if="currentExif.lens"> · {{ currentExif.lens }}</span>
          <span v-if="currentExif.aperture"> · {{ currentExif.aperture }}</span>
          <span v-if="currentExif.shutter"> · {{ currentExif.shutter }}</span>
          <span v-if="currentExif.iso"> · ISO {{ currentExif.iso }}</span>
        </div>

        <!-- CLOSE -->
        <button
          class="absolute top-6 right-6 text-white text-3xl opacity-70 hover:opacity-100"
          @click="closeLightbox"
        >
          ✕
        </button>

        <!-- NAV -->
       <button
        v-if="lightbox.index > 0"
        class="absolute left-6 text-white text-3xl opacity-50 hover:opacity-100 hidden md:block"
        @click.stop="prev"
        >
          ‹
        </button>

        <button
        v-if="lightbox.index < gallery.images.length - 1"
        class="absolute right-6 text-white text-3xl opacity-50 hover:opacity-100 hidden md:block"
        @click.stop="next"
        >
          ›
        </button>
      </div>
    </teleport>

  </section>

  <!-- LOADING / NOT FOUND -->
  <div v-else class="min-h-screen flex items-center justify-center opacity-60">
    Loading gallery…
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useGalleries } from '@/composables/useGalleries'
import { nextTick } from 'vue'

const route = useRoute()
const { galleries, init } = useGalleries()

const gallery = computed(() =>
  galleries.value.find(g => g.slug === route.params.slug)
)

/* ---------------- LIGHTBOX ---------------- */

const revealEls = ref([])

function initReveal() {
  if (!('IntersectionObserver' in window)) {
    revealEls.value.forEach(el => el.classList.add('is-visible'))
    return
  }

  const io = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          io.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    }
  )

  revealEls.value.forEach(el => io.observe(el))
}

const lightbox = ref({
  open: false,
  index: 0
})

function openLightbox(index) {
  lightbox.value.open = true
  lightbox.value.index = index
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightbox.value.open = false
  document.body.style.overflow = ''
}

function next() {
  if (lightbox.value.index < gallery.value.images.length - 1) {
    lightbox.value.index++
    hideExif()
  }
}

function prev() {
  if (lightbox.value.index > 0) {
    lightbox.value.index--
    hideExif()
  }
}

const showExif = ref(false)

const currentExif = computed(() => {
  const img = gallery.value?.images?.[lightbox.value.index]
  return img?.exif || null
})

function toggleExif() {
  showExif.value = !showExif.value
}

function hideExif() {
  showExif.value = false
}

/* ---------------- KEYBOARD ---------------- */
const touch = {
  startX: 0,
  currentX: 0,
  active: false
}

const SWIPE_THRESHOLD = 50

function onTouchStart(e) {
  if (!lightbox.value.open) return
  touch.startX = e.touches[0].clientX
  touch.currentX = touch.startX
  touch.active = true
}

function onTouchMove(e) {
  if (!touch.active) return
  touch.currentX = e.touches[0].clientX
}

function onTouchEnd() {
  if (!touch.active) return

  const delta = touch.currentX - touch.startX

  if (Math.abs(delta) > SWIPE_THRESHOLD) {
    if (delta < 0) next()
    else prev()
  }

  touch.active = false
}

function onKey(e) {
  if (!lightbox.value.open) return

  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowRight') next()
  if (e.key === 'ArrowLeft') prev()
}

onMounted(async () => {
  await init()
  await nextTick()
  initReveal()
  window.addEventListener('keydown', onKey)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})
</script>
<style scoped>
    /* ---- Fade / Reveal ---- */

.reveal {
  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity 0.8s ease,
    transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Slightly faster on mobile */
@media (max-width: 640px) {
  .reveal {
    transition-duration: 0.6s;
  }
}
</style>
