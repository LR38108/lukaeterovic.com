<template>
  <footer
    class="site-footer px-6 text-center text-sm opacity-60 space-y-6 font-u001-condensed"
    :class="footerClasses"
  >
    <div class="flex justify-center gap-6">
      <img src="/assets/icons/IG.svg" class="h-6" alt="Instagram" />
      <img src="/assets/icons/Threads.svg" class="h-6" alt="Threads" />
      <img src="/assets/icons/vimeo.svg" class="h-6" alt="Vimeo" />
    </div>

    <p class="leading-snug">
      ALL WORK AND MATERIAL ON THIS<br />
      WEBSITE IS 100% AI FREE.<br />
      ALL RIGHTS RESERVED.
    </p>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme.js'

const props = defineProps({
  /** `menu`: inside full-screen menu (no top rule). `page`: sitewide bar under content. */
  variant: {
    type: String,
    default: 'page',
    validator: v => v === 'page' || v === 'menu'
  }
})

const { isLight } = useTheme()

const footerClasses = computed(() => {
  if (props.variant === 'menu') {
    return 'pb-10'
  }
  return [
    'py-10 mt-auto border-t',
    isLight.value ? 'border-black/15' : 'border-white/20'
  ]
})
</script>

<style scoped>
.font-u001-condensed {
  font-family: 'U001 Condensed', sans-serif;
}
</style>
