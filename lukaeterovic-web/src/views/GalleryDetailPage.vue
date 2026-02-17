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
          :key="img.url || img"
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
    <!-- LIGHTBOX -->
    <CustomLightbox
      v-model="lightboxOpen"
      :images="gallery.images"
      :initial-index="lightboxIndex"
    />


  </section>

  <div v-else class="min-h-screen flex items-center justify-center opacity-60">
    Loading gallery…
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useGalleries } from '@/composables/useGalleries'
import CustomLightbox from '@/components/CustomLightbox.vue'

/* Swiper */
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Keyboard, Pagination, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const modules = [Navigation, Keyboard, Pagination, EffectFade]

const activeIndex = ref(0)

const currentImage = computed(() => {
  return gallery.value?.images?.[activeIndex.value]?.url ||
         gallery.value?.images?.[activeIndex.value]
})

const route = useRoute()
const { galleries, init } = useGalleries()

const gallery = computed(() =>
  galleries.value.find(g => g.slug === route.params.slug)
)

/* Reveal Animation */

const revealEls = ref([])

function initReveal() {
  if (!('IntersectionObserver' in window)) {
    revealEls.value.forEach(el => el.classList.add('is-visible'))
    return
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        io.unobserve(entry.target)
      }
    })
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  })

  revealEls.value.forEach(el => io.observe(el))
}

/* Lightbox */

const lightboxOpen = ref(false)
const lightboxIndex = ref(0)
const showExifIndex = ref(null)

function openLightbox(index) {
  lightboxIndex.value = index
  activeIndex.value = index
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxOpen.value = false
  showExifIndex.value = null
  document.body.style.overflow = ''
}

function toggleExif(index) {
  showExifIndex.value =
    showExifIndex.value === index ? null : index
}

function onSlideChange(swiper) {
  activeIndex.value = swiper.activeIndex
  lightboxIndex.value = swiper.activeIndex
  showExifIndex.value = null
}

onMounted(async () => {
  await init()
  await nextTick()
  initReveal()
})
</script>

<style scoped>
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
</style>
