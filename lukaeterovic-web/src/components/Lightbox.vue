<template>
  <div
    class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
    @click.self="close"
  >
    <!-- CLOSE -->
    <button
      class="absolute top-6 right-6 text-white text-2xl opacity-70 hover:opacity-100"
      @click="close"
    >
      ✕
    </button>

    <!-- PREV -->
    <button
      v-if="images.length > 1"
      class="absolute left-4 md:left-8 text-white text-3xl opacity-70 hover:opacity-100"
      @click.stop="prev"
    >
      ‹
    </button>

    <!-- IMAGE -->
    <img
      :src="current.url"
      class="max-h-[90vh] max-w-[90vw] object-contain select-none"
      draggable="false"
    />

    <!-- NEXT -->
    <button
      v-if="images.length > 1"
      class="absolute right-4 md:right-8 text-white text-3xl opacity-70 hover:opacity-100"
      @click.stop="next"
    >
      ›
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  images: { type: Array, required: true }, // [{ url }]
  startIndex: { type: Number, default: 0 }
})

const emit = defineEmits(['close'])

const index = ref(props.startIndex)

const current = computed(() => props.images[index.value])

function close() {
  emit('close')
}

function next() {
  index.value = (index.value + 1) % props.images.length
}

function prev() {
  index.value =
    (index.value - 1 + props.images.length) % props.images.length
}

/* ---------------- KEYBOARD ---------------- */

function onKey(e) {
  if (e.key === 'Escape') close()
  if (e.key === 'ArrowRight') next()
  if (e.key === 'ArrowLeft') prev()
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>
