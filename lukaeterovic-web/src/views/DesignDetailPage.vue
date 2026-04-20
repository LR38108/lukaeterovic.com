<template>
  <div v-if="project" :class="rootClass" class="design-detail-root min-h-screen pt-24 pb-32">
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

    <div class="max-w-3xl mx-auto px-6 md:px-10 py-10 md:py-14">
      <h1 class="design-detail-heading text-3xl md:text-[2.2rem] font-bold uppercase tracking-[0.06em] mb-6">
        {{ project.title }}
      </h1>

      <hr class="design-detail-rule mb-10 md:mb-12 border-0 border-t" :class="ruleClass" />

      <h2 class="design-about-label text-sm md:text-base font-bold uppercase tracking-[0.12em] mb-4">
        ABOUT THE PROJECT
      </h2>

      <p
        v-if="project.description"
        class="design-body text-sm md:text-base leading-relaxed mb-10 md:mb-12"
        :class="bodyClass"
      >
        {{ project.description }}
      </p>

      <div
        v-if="galleryFirst.length"
        class="grid grid-cols-2 gap-4 md:gap-5 mb-10 md:mb-12"
      >
        <button
          v-for="(img, i) in galleryFirst"
          :key="img.url"
          type="button"
          class="block w-full overflow-hidden border-0 p-0 cursor-zoom-in"
          :class="galleryChromeClass"
          @click="openLightbox(i)"
        >
          <img :src="img.url" :alt="`${project.title} ${i + 1}`" class="w-full aspect-square object-cover" />
        </button>
      </div>

      <p
        v-if="project.textMiddle"
        class="design-body text-sm md:text-base leading-relaxed mb-10 md:mb-12"
        :class="bodyClass"
      >
        {{ project.textMiddle }}
      </p>

      <button
        v-if="galleryWide"
        type="button"
        class="block w-full overflow-hidden border-0 p-0 mb-10 md:mb-12 cursor-zoom-in"
        :class="galleryChromeClass"
        @click="openLightbox(4)"
      >
        <img
          :src="galleryWide.url"
          :alt="`${project.title} wide`"
          class="w-full max-h-[min(70vh,520px)] object-cover object-center"
        />
      </button>

      <p
        v-if="project.textFooter"
        class="design-body text-sm md:text-base leading-relaxed mb-10 md:mb-12"
        :class="bodyClass"
      >
        {{ project.textFooter }}
      </p>

      <div
        v-if="galleryRest.length"
        class="grid grid-cols-2 gap-4 md:gap-5 mb-12"
      >
        <button
          v-for="(img, j) in galleryRest"
          :key="img.url"
          type="button"
          class="block w-full overflow-hidden border-0 p-0 cursor-zoom-in"
          :class="galleryChromeClass"
          @click="openLightbox(5 + j)"
        >
          <img :src="img.url" :alt="`${project.title} ${j + 6}`" class="w-full aspect-square object-cover" />
        </button>
      </div>

      <div v-if="creditsList.length" class="mt-4 text-left">
        <h2 class="text-xs uppercase tracking-[0.14em] mb-4" :class="creditsHeadingClass">Credits</h2>
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
      </div>
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
    Loading…
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
import { useDesignProjects } from '@/composables/useDesignProjects'
import { useTheme } from '@/composables/useTheme'
import CustomLightbox from '@/components/CustomLightbox.vue'

const route = useRoute()
const { isLight } = useTheme()
const { designProjects, init, loading } = useDesignProjects()
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

const creditsHeadingClass = computed(() =>
  isLight.value ? 'text-black/45' : 'text-white/45'
)

const loadingClass = computed(() =>
  isLight.value ? 'bg-neutral-100 text-neutral-600' : 'bg-black text-white/50'
)

const project = computed(() =>
  designProjects.value.find(p => p.slug === route.params.slug)
)

const heroSrc = computed(() => project.value?.heroImage || project.value?.thumbnail || '')

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

const galleryFirst = computed(() => normalizedGallery.value.slice(0, 4))
const galleryWide = computed(() => normalizedGallery.value[4] || null)
const galleryRest = computed(() => normalizedGallery.value.slice(5))

onMounted(async () => {
  await init()
  pageReady.value = true
})
</script>

<style scoped>
.design-detail-heading {
  font-family: 'U001 Condensed', sans-serif;
  font-weight: 700;
}

.design-about-label {
  font-family: 'U001 Condensed', sans-serif;
  font-weight: 700;
}

.design-body {
  font-family: 'U001', sans-serif;
  font-weight: 400;
}

.credit-row .credit-dots {
  border-bottom: 1px dotted currentColor;
  opacity: 0.45;
  margin-bottom: 0.25em;
}
</style>
