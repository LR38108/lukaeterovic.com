<template>
  <div v-if="project" :class="rootClass" class="commercial-detail-root min-h-screen pt-24 pb-32">
    <div
      class="relative w-full aspect-video min-h-[min(56vw,72vh)] max-h-[min(90vh,960px)] overflow-hidden"
      :class="heroChromeClass"
    >
      <img
        v-if="heroSrc"
        :src="heroSrc"
        :alt="project.title"
        class="absolute inset-0 h-full w-full object-cover"
      />
    </div>

    <div class="max-w-5xl mx-auto px-6 md:px-10 py-10 md:py-14">
      <section class="text-center mb-10 md:mb-12">
        <h1 class="commercial-detail-heading text-3xl md:text-[2.2rem] font-bold uppercase tracking-[0.06em] mb-4">
          {{ project.title }}
        </h1>

        <p v-if="project.client" class="commercial-body text-sm md:text-base mb-2" :class="bodyClass">
          Client: {{ project.client }}
        </p>

        <p
          v-if="project.subtitle"
          class="commercial-body text-sm md:text-base leading-relaxed"
          :class="bodyClass"
        >
          {{ project.subtitle }}
        </p>
      </section>

      <hr class="commercial-detail-rule mb-10 md:mb-12 border-0 border-t" :class="ruleClass" />

      <section v-if="project.about" class="mb-10 md:mb-12">
        <h2 class="commercial-section-label text-sm md:text-base font-bold uppercase tracking-[0.12em] mb-4">
          ABOUT THE PROJECT
        </h2>

        <p
          class="commercial-body text-sm md:text-base leading-relaxed"
          :class="bodyClass"
        >
          {{ project.about }}
        </p>
      </section>

      <hr
        v-if="project.about && (creditsList.length || normalizedGallery.length)"
        class="commercial-detail-rule mb-10 md:mb-12 border-0 border-t"
        :class="ruleClass"
      />

      <section v-if="creditsList.length" class="mb-10 md:mb-12">
        <h2 class="commercial-section-label text-sm md:text-base font-bold uppercase tracking-[0.12em] mb-4">
          CREDITS
        </h2>
        <div class="space-y-2 text-sm">
          <div
            v-for="(c, i) in creditsList"
            :key="i"
            class="credit-row flex items-baseline gap-2"
          >
            <span class="flex-none">{{ c.role }}</span>
            <span class="credit-dots flex-1 min-w-4" aria-hidden="true" />
            <span class="flex-none font-medium">{{ c.name }}</span>
          </div>
        </div>
      </section>

      <hr
        v-if="creditsList.length && normalizedGallery.length"
        class="commercial-detail-rule mb-10 md:mb-12 border-0 border-t"
        :class="ruleClass"
      />

      <section v-if="normalizedGallery.length">
        <h2 class="commercial-section-label text-sm md:text-base font-bold uppercase tracking-[0.12em] mb-7">
          GALLERY
        </h2>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 md:gap-8">
          <button
            v-for="(img, i) in normalizedGallery"
            :key="img.url"
            type="button"
            class="block w-full overflow-hidden border-0 p-0 cursor-zoom-in"
            :class="galleryChromeClass"
            @click="openLightbox(i)"
          >
            <img :src="img.url" :alt="`${project.title} ${i + 1}`" class="w-full aspect-video object-cover" />
          </button>
        </div>
      </section>
    </div>

    <CustomLightbox
      v-model="lightboxOpen"
      :images="normalizedGallery"
      :initial-index="lightboxIndex"
    />
  </div>

  <div
    v-else-if="!pageReady || loading"
    class="min-h-screen flex items-center justify-center pt-24"
    :class="loadingClass"
  >
    Loading...
  </div>

  <div
    v-else
    class="min-h-screen flex items-center justify-center pt-24 px-4 text-center"
    :class="loadingClass"
  >
    Project not found.
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useCommercialProjects } from '@/composables/useCommercialProjects'
import { useTheme } from '@/composables/useTheme'
import CustomLightbox from '@/components/CustomLightbox.vue'

const route = useRoute()
const { isLight } = useTheme()
const { commercialProjects, init, loading } = useCommercialProjects()
const pageReady = ref(false)

const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

function openLightbox(index) {
  lightboxIndex.value = index
  lightboxOpen.value = true
}

const rootClass = computed(() =>
  isLight.value ? 'bg-white text-black' : 'bg-black text-white'
)

const heroChromeClass = computed(() =>
  isLight.value ? 'bg-black/5' : 'bg-white/10'
)

const ruleClass = computed(() =>
  isLight.value ? 'border-black/20' : 'border-white/25'
)

const bodyClass = computed(() =>
  isLight.value ? 'text-black/85' : 'text-white/85'
)

const galleryChromeClass = computed(() =>
  isLight.value ? 'bg-neutral-200' : 'bg-white/10'
)

const loadingClass = computed(() =>
  isLight.value ? 'bg-neutral-100 text-neutral-600' : 'bg-black text-white/50'
)

const project = computed(() =>
  commercialProjects.value.find(p => (p.publicSlug || p.slug) === route.params.slug)
)

const heroSrc = computed(() => project.value?.heroImage || '')

const creditsList = computed(() => {
  const list = project.value?.credits
  if (!Array.isArray(list)) return []
  return list.filter(c => c && (c.role || c.name)).map(c => ({
    role: c.role || '',
    name: c.name || ''
  }))
})

const normalizedGallery = computed(() => {
  if (!project.value?.gallery) return []
  return project.value.gallery.map(img =>
    typeof img === 'string'
      ? { url: img }
      : img
  )
})

onMounted(async () => {
  await init()
  pageReady.value = true
})
</script>

<style scoped>
.commercial-detail-heading,
.commercial-section-label {
  font-family: 'U001 Condensed', sans-serif;
  font-weight: 700;
}

.commercial-body {
  font-family: 'U001', sans-serif;
  font-weight: 400;
}

.credit-row .credit-dots {
  border-bottom: 1px dotted currentColor;
  opacity: 0.45;
  margin-bottom: 0.25em;
}
</style>
