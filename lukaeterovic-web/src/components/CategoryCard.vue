<!-- src/components/CategoryCard.vue -->
<template>
  <div
    ref="rootEl"
    class="relative w-full bg-white dark:bg-black
           h-72 sm:h-80 md:h-[420px] lg:h-[520px]
           overflow-hidden cursor-pointer group"
    @click="navigate"
  >
    <!-- Background image layer (THE FIX: background-size: cover) -->
    <div
      class="absolute inset-0"
      :style="bgStyle"
      aria-hidden="true"
    ></div>

    <!-- Gradient overlay -->
    <div
      class="absolute inset-0 bg-gradient-to-t
             from-black/60 via-black/30 to-black/10"
      aria-hidden="true"
    ></div>

    <!-- Title (slow fade in) -->
    <div class="relative z-10 h-full flex items-center justify-center">
      <h2
        class="text-white text-3xl sm:text-4xl md:text-5xl
               font-semibold tracking-widest uppercase
               transition-all duration-1000 ease-out
               group-hover:scale-[1.02]"
        :class="titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'"
      >
        {{ title }}
      </h2>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  title: String,
  image: String,
  route: String
})

const router = useRouter()
const navigate = () => {
  if (props.route) router.push(props.route)
}

const rootEl = ref(null)
const titleVisible = ref(false)

let observer = null
let fadeTimeoutId = null

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function clearFadeTimeout() {
  if (fadeTimeoutId) clearTimeout(fadeTimeoutId)
  fadeTimeoutId = null
}

onMounted(() => {
  if (typeof window === 'undefined') return

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      const isIntersecting = !!entry?.isIntersecting

      if (isIntersecting) {
        if (!titleVisible.value) {
          clearFadeTimeout()
          fadeTimeoutId = setTimeout(() => {
            titleVisible.value = true
          }, 150)
        }
      }
    },
    { threshold: 0.2 }
  )

  if (rootEl.value) observer.observe(rootEl.value)

  if (prefersReducedMotion()) {
    titleVisible.value = true
  }
})

onBeforeUnmount(() => {
  clearFadeTimeout()
  if (observer && rootEl.value) observer.unobserve(rootEl.value)
  if (observer) observer.disconnect()
})

const bgStyle = computed(() => ({
  backgroundImage: `url(${props.image})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center center'
}))
</script>
