<!-- src/components/CustomLightbox.vue -->
<template>
  <teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[9999] overflow-hidden"
    >
      <!-- Dynamic Blur Background -->
      <div
        class="absolute inset-0 scale-110 blur-3xl opacity-40 pointer-events-none transition-all duration-700"
        :style="{
          backgroundImage: `url(${currentImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }"
      ></div>

      <!-- Dark Overlay -->
      <div class="absolute inset-0 bg-black/80 pointer-events-none"></div>

      <!-- Swiper -->
      <Swiper
        :modules="modules"
        effect="fade"
        :fade-effect="{ crossFade: true }"
        :initial-slide="index"
        :navigation="true"
        :keyboard="{ enabled: true }"
        :pagination="{ clickable: true }"
        :speed="600"
        :zoom="{
          maxRatio: 4,
          minRatio: 1,
          toggle: false
        }"
        class="h-full w-full relative z-10"
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

          <!-- EXIF -->
          <div
            v-if="showExifIndex === i && img.exif"
            class="absolute bottom-10 left-1/2 -translate-x-1/2
                   bg-black/60 backdrop-blur
                   text-white text-xs
                   px-5 py-2 rounded-full
                   transition-opacity duration-300"
          >
            <span v-if="img.exif.camera">{{ img.exif.camera }}</span>
            <span v-if="img.exif.lens"> · {{ img.exif.lens }}</span>
            <span v-if="img.exif.aperture"> · {{ img.exif.aperture }}</span>
            <span v-if="img.exif.shutter"> · {{ img.exif.shutter }}</span>
            <span v-if="img.exif.iso"> · ISO {{ img.exif.iso }}</span>
          </div>
        </SwiperSlide>
      </Swiper>

      <!-- Close -->
      <button
        class="absolute top-8 right-10 text-white text-3xl opacity-60 z-50 hover:opacity-100 transition"
        @click="close"
      >
        ✕
      </button>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Keyboard, Pagination, EffectFade, Zoom } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/zoom'

const modules = [Navigation, Keyboard, Pagination, EffectFade, Zoom]

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

const activeIndex = ref(index.value)
const showExifIndex = ref(null)

const currentImage = computed(() => {
  return props.images?.[activeIndex.value]?.url ||
         props.images?.[activeIndex.value]
})

function onSwiper(swiper) {
  swiperInstance.value = swiper
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
:deep(.swiper),
:deep(.swiper-wrapper),
:deep(.swiper-slide) {
  height: 100%;
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: white;
}
</style>
