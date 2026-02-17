<template>
  <Teleport to="body">
    <Transition name="dialog-fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[1000] flex items-center justify-center"
        @mousedown.self="onCancel"
      >
        <div class="absolute inset-0 bg-black/45 backdrop-blur-sm"></div>

        <div
          class="relative w-[92vw] max-w-sm px-6 py-6"
          :class="panelClass"
          role="dialog"
          aria-modal="true"
          :aria-label="title || 'Dialog'"
          @keydown="onKeydown"
          tabindex="-1"
          ref="panelEl"
        >
          <div class="text-sm uppercase tracking-widest opacity-60 mb-3">
            {{ title }}
          </div>

          <div class="text-base leading-relaxed opacity-85">
            {{ message }}
          </div>

          <div class="mt-6 flex items-center justify-end gap-6">
            <button
              class="text-sm uppercase tracking-widest opacity-60 hover:opacity-100 transition"
              type="button"
              @click="onCancel"
            >
              {{ cancelText }}
            </button>

            <button
              ref="confirmBtnEl"
              class="text-sm uppercase tracking-widest transition"
              :class="confirmClass"
              type="button"
              @click="onConfirm"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  message: { type: String, default: '' },
  confirmText: { type: String, default: 'Confirm' },
  cancelText: { type: String, default: 'Cancel' },
  destructive: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const panelEl = ref(null)
const confirmBtnEl = ref(null)

const panelClass = computed(() => 'bg-transparent text-current')
const confirmClass = computed(() =>
  props.destructive
    ? 'opacity-90 hover:opacity-100'
    : 'opacity-80 hover:opacity-100'
)

watch(
  () => props.modelValue,
  async (open) => {
    if (open) {
      await nextTick()
      panelEl.value?.focus?.()
      confirmBtnEl.value?.focus?.()
    }
  }
)

function onConfirm() {
  emit('confirm')
  emit('update:modelValue', false)
}

function onCancel() {
  emit('cancel')
  emit('update:modelValue', false)
}

function onKeydown(e) {
  if (e.key === 'Escape') {
    e.preventDefault()
    onCancel()
  }
  if (e.key === 'Enter') {
    e.preventDefault()
    onConfirm()
  }
}
</script>

<style scoped>
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 160ms ease;
}
.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}
</style>
