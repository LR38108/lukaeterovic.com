import { ref } from 'vue'

let _id = 0

export function useToast() {
  const toasts = ref([])

  function dismiss(id) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function toast(text, options = {}) {
    const id = ++_id
    const duration = options.duration ?? 1800

    toasts.value.push({ id, text })

    window.setTimeout(() => {
      dismiss(id)
    }, duration)

    return id
  }

  return { toasts, toast, dismiss }
}
