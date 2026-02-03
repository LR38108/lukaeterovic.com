<!-- src/components/FilmLightbox.vue -->
<template>
  <teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      @click.self="close"
    >
      <!-- Top bar -->
      <div class="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
        <div class="text-white/80 text-sm">
          <span v-if="images?.length">{{ currentIndex + 1 }} / {{ images.length }}</span>
        </div>

        <button
          class="text-white/90 hover:text-white text-sm uppercase tracking-widest"
          type="button"
          @click="close"
        >
          Close ✕
        </button>
      </div>

      <!-- Prev -->
      <button
        v-if="hasMany"
        type="button"
        class="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 px-3 py-3 text-white/90 hover:text-white bg-white/10 hover:bg-white/15 rounded-full backdrop-blur"
        aria-label="Previous image"
        @click.stop="prev"
      >
        ‹
      </button>

      <!-- Image -->
      <div class="w-full h-full px-4 sm:px-10 flex items-center justify-center">
        <img
          :src="currentSrc"
          alt=""
          class="max-w-full max-h-[85vh] object-contain select-none"
          draggable="false"
        />
      </div>

      <!-- Next -->
      <button
        v-if="hasMany"
        type="button"
        class="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 px-3 py-3 text-white/90 hover:text-white bg-white/10 hover:bg-white/15 rounded-full backdrop-blur"
        aria-label="Next image"
        @click.stop="next"
      >
        ›
      </button>

      <!-- Bottom hint -->
      <div class="absolute bottom-0 left-0 right-0 p-4 text-center text-white/60 text-xs">
        <span v-if="hasMany">Use ← → keys to navigate • </span>
        Press ESC to close
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { computed, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  images: { type: Array, default: () => [] },
  startIndex: { type: Number, default: 0 }
})

const emit = defineEmits(['close', 'update:index'])

const hasMany = computed(() => (props.images?.length || 0) > 1)

const currentIndex = computed({
  get() {
    const len = props.images?.length || 0
    if (!len) return 0
    const i = Number(props.startIndex) || 0
    return Math.min(Math.max(i, 0), len - 1)
  },
  set(val) {
    const len = props.images?.length || 0
    if (!len) return
    const safe = Math.min(Math.max(Number(val) || 0, 0), len - 1)
    emit('update:index', safe)
  }
})

const currentSrc = computed(() => {
  const len = props.images?.length || 0
  if (!len) return ''
  return props.images[currentIndex.value]
})

function close() {
  emit('close')
}

function next() {
  const len = props.images?.length || 0
  if (!len) return
  currentIndex.value = (currentIndex.value + 1) % len
}

function prev() {
  const len = props.images?.length || 0
  if (!len) return
  currentIndex.value = (currentIndex.value - 1 + len) % len
}

function onKeydown(e) {
  if (!props.open) return

  if (e.key === 'Escape') close()
  if (e.key === 'ArrowRight') next()
  if (e.key === 'ArrowLeft') prev()
}

// Lock body scroll while open + keyboard controls
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      document.addEventListener('keydown', onKeydown)
      document.body.style.overflow = 'hidden'
    } else {
      document.removeEventListener('keydown', onKeydown)
      document.body.style.overflow = ''
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>