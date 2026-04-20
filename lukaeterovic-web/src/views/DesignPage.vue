<template>
  <section :class="pageClass" class="design-index min-h-screen pt-24 pb-24">
    <div class="max-w-6xl mx-auto px-4">
      <header class="mb-16 md:mb-20">
        <h1 class="design-page-title text-[2.25rem] md:text-[2.7rem] font-bold uppercase mb-6">
          DESIGN
        </h1>
        <p
          class="design-page-intro text-base md:text-lg max-w-2xl leading-relaxed"
          :class="introClass"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </p>
      </header>

      <div class="grid grid-cols-2 gap-x-6 gap-y-12 sm:gap-x-10 md:gap-x-14 md:gap-y-14">
        <RouterLink
          v-for="p in designProjects"
          :key="p.slug"
          :to="`/design/${p.slug}`"
          class="group block"
        >
          <div
            class="relative aspect-video overflow-hidden"
            :class="thumbWrapClass"
          >
            <img
              v-if="p.thumbnail"
              :src="p.thumbnail"
              :alt="p.title"
              class="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <h2 class="design-card-title mt-4 text-left text-base md:text-lg font-bold uppercase tracking-[0.06em] leading-tight">
            {{ p.title }}
          </h2>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useDesignProjects } from '@/composables/useDesignProjects'
import { useTheme } from '@/composables/useTheme'

const { designProjects, init } = useDesignProjects()
const { isLight } = useTheme()

onMounted(init)

const pageClass = computed(() =>
  isLight.value ? 'bg-white text-black' : 'bg-black text-white'
)

const introClass = computed(() =>
  isLight.value ? 'text-black/70' : 'text-white/80'
)

const thumbWrapClass = computed(() =>
  isLight.value ? 'bg-black/5' : 'bg-white/10'
)
</script>

<style scoped>
.design-page-title {
  font-family: 'U001 Condensed', sans-serif;
  font-weight: 700;
}

.design-page-intro {
  font-family: 'U001', sans-serif;
  font-weight: 400;
}

.design-card-title {
  font-family: 'U001 Condensed', sans-serif;
  font-weight: 700;
}
</style>
