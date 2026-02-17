import { ref } from 'vue'

export function useDialog() {
  const isOpen = ref(false)
  const title = ref('')
  const message = ref('')
  const confirmText = ref('Confirm')
  const cancelText = ref('Cancel')
  const destructive = ref(false)

  let resolver = null

  function reset() {
    title.value = ''
    message.value = ''
    confirmText.value = 'Confirm'
    cancelText.value = 'Cancel'
    destructive.value = false
    resolver = null
  }

  function openConfirm(options = {}) {
    title.value = options.title ?? 'Confirm'
    message.value = options.message ?? ''
    confirmText.value = options.confirmText ?? 'Confirm'
    cancelText.value = options.cancelText ?? 'Cancel'
    destructive.value = Boolean(options.destructive)

    isOpen.value = true

    return new Promise((resolve) => {
      resolver = resolve
    })
  }

  function confirm() {
    isOpen.value = false
    if (resolver) resolver(true)
    reset()
  }

  function cancel() {
    isOpen.value = false
    if (resolver) resolver(false)
    reset()
  }

  return {
    isOpen,
    title,
    message,
    confirmText,
    cancelText,
    destructive,
    openConfirm,
    confirm,
    cancel
  }
}
