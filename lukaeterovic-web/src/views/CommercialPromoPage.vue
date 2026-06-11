<template>
  <section :class="pageClass" class="commercial-index min-h-screen pt-24 pb-24">
    <div class="max-w-6xl mx-auto px-4">
      <header class="mb-16 md:mb-20">
        <h1 class="commercial-page-title text-[2.25rem] md:text-[2.7rem] font-bold uppercase mb-6">
          COMMERCIAL &amp; PROMO
        </h1>
        <p
          class="commercial-page-intro text-base md:text-lg max-w-2xl leading-relaxed"
          :class="introClass"
        >
          Wide range of different commercial projects - from advertisements to promotional work.
        </p>
      </header>

      <div v-if="loading" class="opacity-60">
        Loading commercial projects...
      </div>

      <div v-else-if="commercialProjects.length === 0" class="opacity-60">
        No commercial projects yet.
      </div>

      <div v-else class="grid grid-cols-2 gap-x-6 gap-y-12 sm:gap-x-10 md:gap-x-14 md:gap-y-14">
        <RouterLink
          v-for="p in commercialProjects"
          :key="p.publicSlug || p.slug"
          :to="{ name: 'CommercialPromoDetail', params: { slug: p.publicSlug || p.slug } }"
          class="group block no-underline hover:no-underline"
        >
          <div
            class="relative aspect-video overflow-hidden"
            :class="thumbWrapClass"
          >
            <img
              v-if="p.thumbnail"
              :src="p.thumbnail"
              :alt="p.title"
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <h2 class="commercial-card-title mt-4 text-left text-base md:text-lg font-bold uppercase tracking-[0.06em] leading-tight group-hover:underline">
            {{ p.title }}
          </h2>
          <p v-if="p.subtitle" class="mt-1 text-sm opacity-60">
            {{ p.subtitle }}
          </p>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useCommercialProjects } from '@/composables/useCommercialProjects'
import { useTheme } from '@/composables/useTheme'

const { commercialProjects, loading, init } = useCommercialProjects()
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
.commercial-page-title {
  font-family: 'U001 Condensed', sans-serif;
  font-weight: 700;
}

.commercial-page-intro {
  font-family: 'U001', sans-serif;
  font-weight: 400;
}

.commercial-card-title {
  font-family: 'U001 Condensed', sans-serif;
  font-weight: 700;
}
</style>
