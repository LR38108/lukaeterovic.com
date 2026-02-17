<template>
  <div class="fixed left-0 right-0 top-6 z-[1100] pointer-events-none">
    <div class="mx-auto w-full max-w-sm px-4 space-y-2">
      <TransitionGroup name="toast" tag="div" class="space-y-2">
        <div
          v-for="t in toasts"
          :key="t.id"
          class="pointer-events-auto px-4 py-3 text-sm tracking-wide"
          :class="toastClass"
          @click="emit('dismiss', t.id)"
        >
          {{ t.text }}
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  toasts: { type: Array, default: () => [] },
  isLight: { type: Boolean, default: true }
})

const emit = defineEmits(['dismiss'])

const toastClass = computed(() =>
  props.isLight
    ? 'bg-black text-white/90'
    : 'bg-white text-black/90'
)
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: opacity 160ms ease, transform 160ms ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
