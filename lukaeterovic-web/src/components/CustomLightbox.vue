<!-- src/components/CustomLightbox.vue -->
<template>
  <teleport to="body">
    <div
      v-if="open"
      class="lightbox-root fixed inset-0 z-[9999] overflow-hidden"
      :class="isLight ? 'lightbox-root--light' : 'lightbox-root--dark'"
    >
      <div
        class="absolute inset-0 pointer-events-none transition-colors duration-300"
        :class="isLight ? 'bg-white' : 'bg-black'"
      />

      <!-- Nav + pagination must live INSIDE Swiper so they exist when Swiper inits (string selectors / pagination el). -->
      <Swiper
        :modules="modules"
        effect="fade"
        :fade-effect="{ crossFade: true }"
        :initial-slide="index"
        :pagination="paginationOptions"
        :keyboard="{ enabled: true }"
        :speed="600"
        :zoom="{
          maxRatio: 4,
          minRatio: 1,
          toggle: false
        }"
        class="lightbox-swiper h-full w-full relative z-10"
        @swiper="onSwiper"
        @slideChange="onSlideChange"
      >
        <SwiperSlide
          v-for="(img, i) in images"
          :key="img.url || img"
          class="!flex items-center justify-center h-full"
        >
          <div class="swiper-zoom-container flex items-center justify-center h-full w-full">
            <img
              :src="img.url || img"
              class="max-h-[88vh] max-w-[88vw] object-contain select-none"
              draggable="false"
              @click="toggleExif(i)"
              @dblclick.stop="handleZoom"
            />
          </div>

          <div
            v-if="showExifIndex === i && img.exif"
            class="absolute bottom-24 md:bottom-32 left-1/2 z-20 -translate-x-1/2 backdrop-blur text-xs px-5 py-2 rounded-full transition-opacity duration-300"
            :class="isLight ? 'bg-white/85 text-black' : 'bg-black/60 text-white'"
          >
            <span v-if="img.exif.camera">{{ img.exif.camera }}</span>
            <span v-if="img.exif.lens"> · {{ img.exif.lens }}</span>
            <span v-if="img.exif.aperture"> · {{ img.exif.aperture }}</span>
            <span v-if="img.exif.shutter"> · {{ img.exif.shutter }}</span>
            <span v-if="img.exif.iso"> · ISO {{ img.exif.iso }}</span>
          </div>
        </SwiperSlide>

        <!-- Prev / next: manual slide — reliable vs Swiper string selectors outside container -->
        <template v-if="images.length > 1">
          <button
            type="button"
            class="lightbox-nav lightbox-nav--prev"
            aria-label="Previous image"
            @click.stop="goPrev"
          >
            <img
              :src="`${navBase}/${isLight ? 'left_black' : 'left_white'}.svg`"
              alt=""
              width="32"
              height="57"
            />
          </button>
          <button
            type="button"
            class="lightbox-nav lightbox-nav--next"
            aria-label="Next image"
            @click.stop="goNext"
          >
            <img
              :src="`${navBase}/${isLight ? 'right_black' : 'right_white'}.svg`"
              alt=""
              width="32"
              height="57"
            />
          </button>
          <div class="lightbox-pagination swiper-pagination clb-pagination" />
        </template>
      </Swiper>

      <button
        type="button"
        class="lightbox-close absolute top-6 right-6 md:top-8 md:right-10 z-50 p-2 opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Close"
        @click="close"
      >
        <img
          :src="`${navBase}/x_white.svg`"
          alt=""
          width="28"
          height="28"
          class="lightbox-close-img"
        />
      </button>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Keyboard, Pagination, EffectFade, Zoom } from 'swiper/modules'
import { useTheme } from '@/composables/useTheme.js'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/zoom'

const modules = [Keyboard, Pagination, EffectFade, Zoom]

const { isLight } = useTheme()

/** Public folder name in repo */
const navBase = '/assets/navigaiton'

const props = defineProps({
  modelValue: Boolean,
  images: {
    type: Array,
    required: true
  },
  initialIndex: {
    type: Number,
    default: 0
  }
})

const swiperInstance = ref(null)

const emit = defineEmits(['update:modelValue'])

const open = computed(() => props.modelValue)
const index = computed(() => props.initialIndex)

const paginationOptions = computed(() =>
  props.images.length > 1
    ? {
        el: '.lightbox-swiper .clb-pagination',
        clickable: true,
        bulletClass: 'swiper-pagination-bullet clb-bullet',
        bulletActiveClass: 'swiper-pagination-bullet-active clb-bullet-active'
      }
    : false
)

const activeIndex = ref(index.value)
const showExifIndex = ref(null)

function onSwiper(swiper) {
  swiperInstance.value = swiper
}

function goPrev() {
  swiperInstance.value?.slidePrev()
}

function goNext() {
  swiperInstance.value?.slideNext()
}

function handleZoom() {
  const swiper = swiperInstance.value
  if (!swiper || !swiper.zoom) return

  if (swiper.zoom.scale > 1) {
    swiper.zoom.out()
  } else {
    swiper.zoom.in()
  }
}

function onSlideChange(swiper) {
  activeIndex.value = swiper.activeIndex
  showExifIndex.value = null

  if (swiper.zoom && swiper.zoom.scale > 1) {
    swiper.zoom.out()
  }
}

function toggleExif(i) {
  showExifIndex.value =
    showExifIndex.value === i ? null : i
}

function close() {
  emit('update:modelValue', false)
}

watch(open, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})
</script>

<style scoped>
:deep(.lightbox-swiper.swiper),
:deep(.lightbox-swiper .swiper-wrapper),
:deep(.lightbox-swiper .swiper-slide) {
  height: 100%;
}

/* Edge chevrons — small thin arrows (gallery reference) */
.lightbox-nav {
  position: absolute;
  top: 50%;
  z-index: 30;
  transform: translateY(-50%);
  padding: 0.35rem;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.85;
  transition: opacity 0.2s ease;
}

.lightbox-nav:hover {
  opacity: 1;
}

.lightbox-nav img {
  display: block;
  width: 1.5rem;
  height: auto;
  max-height: min(16vh, 3.25rem);
  pointer-events: none;
}

@media (min-width: 768px) {
  .lightbox-nav img {
    width: 1.75rem;
    max-height: min(18vh, 3.75rem);
  }
}

.lightbox-nav--prev {
  left: 0.25rem;
}

.lightbox-nav--next {
  right: 0.25rem;
}

@media (min-width: 768px) {
  .lightbox-nav--prev {
    left: 0.75rem;
  }

  .lightbox-nav--next {
    right: 0.75rem;
  }
}

/* Bottom dash indicators */
:deep(.lightbox-swiper .clb-pagination) {
  position: absolute;
  bottom: 1.75rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 30;
  display: flex !important;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  flex-wrap: wrap;
  width: auto !important;
  max-width: 90vw;
}

/* Dark theme: grey inactive, white active (on black bg) */
.lightbox-root--dark :deep(.lightbox-swiper .clb-pagination .swiper-pagination-bullet.clb-bullet) {
  width: 2.25rem;
  height: 0.35rem;
  margin: 0 !important;
  border-radius: 0;
  opacity: 1;
  background: transparent;
  background-image: url('/assets/navigaiton/inactive_photo_grey.svg');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
}

.lightbox-root--dark :deep(.lightbox-swiper .clb-pagination .swiper-pagination-bullet-active.clb-bullet-active) {
  background-image: url('/assets/navigaiton/active_photo_white.svg');
}

/* Light theme: white canvas; grey inactive, black active */
.lightbox-root--light :deep(.lightbox-swiper .clb-pagination .swiper-pagination-bullet.clb-bullet) {
  width: 2.25rem;
  height: 0.35rem;
  margin: 0 !important;
  border-radius: 0;
  opacity: 1;
  background: transparent;
  background-image: url('/assets/navigaiton/inactive_photo_grey.svg');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
}

.lightbox-root--light :deep(.lightbox-swiper .clb-pagination .swiper-pagination-bullet-active.clb-bullet-active) {
  background-image: url('/assets/navigaiton/active_photo_black.svg');
}

/* Close icon: only white asset in folder — invert to black on light theme */
.lightbox-root--light .lightbox-close-img {
  filter: brightness(0);
}
</style>
