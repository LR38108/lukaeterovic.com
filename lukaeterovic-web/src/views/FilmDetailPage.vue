<!-- src/views/FilmDetailPage.vue -->
<template>
  <div :class="themeClass" class="film-detail-page pt-20 pb-12 px-4 transition-colors duration-300">
    <div v-if="!film" class="max-w-xl mx-auto py-24 text-center">
      <h1 class="film-detail-title text-3xl font-bold">Film not found</h1>
      <p class="mt-3 opacity-70">This film link may be outdated or the slug is incorrect.</p>
      <div class="mt-8 flex justify-center gap-6">
        <router-link to="/film" class="underline underline-offset-4">Back to films</router-link>
        <router-link to="/" class="underline underline-offset-4">Home</router-link>
      </div>
    </div>

    <div v-else class="max-w-6xl mx-auto">
      <div class="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div class="lg:sticky lg:top-24">
          <div class="flex justify-center lg:justify-start">
            <div class="film-poster-frame w-full max-w-md lg:max-w-full max-h-[70vh] lg:max-h-[78vh] overflow-hidden bg-black">
              <img :src="film.poster" alt="Poster"
                class="block w-full h-full object-contain scale-[1.002]"
                loading="lazy" />
            </div>
          </div>
        </div>

        <div>
          <h2 class="film-detail-title text-3xl md:text-5xl font-bold text-center lg:text-left">
            {{ film.title }}
          </h2>

          <div
            class="film-detail-meta mt-6 flex text-center text-sm font-semibold border divide-x overflow-hidden max-w-xl lg:max-w-none lg:mx-0 mx-auto"
            :class="metaClass"
          >
            <div class="flex-1 py-2">{{ film.year }}</div>
            <div class="flex-1 py-2">{{ film.duration }}</div>
            <div class="flex-1 py-2">{{ film.type }}</div>
            <div class="flex-1 py-2">
              {{ Array.isArray(film.genres) ? film.genres.join(', ') : film.genres }}
            </div>
          </div>

          <div v-if="film.plotSummary" class="mt-10 mb-8 border-b pb-6" :class="sectionDividerClass">
            <h3 class="film-detail-section-title font-bold mb-2 tracking-widest">PLOT SUMMARY</h3>
            <p class="leading-relaxed">{{ cleanText(film.plotSummary) }}</p>
          </div>

          <div v-if="film.aboutProject" class="mb-8 border-b pb-6" :class="sectionDividerClass">
            <h3 class="film-detail-section-title font-bold mb-2 tracking-widest">ABOUT THE PROJECT</h3>
            <p class="leading-relaxed">{{ cleanText(film.aboutProject) }}</p>
          </div>

          <div v-if="film.credits?.length" class="mb-8 border-b pb-6" :class="sectionDividerClass">
            <h3 class="film-detail-section-title font-bold mb-2 tracking-widest">CREDITS</h3>
            <ul class="space-y-1">
              <li v-for="(credit, i) in film.credits" :key="i" class="flex justify-between gap-6">
                <span class="opacity-80">{{ credit.role }}</span>
                <span class="text-right">{{ credit.name }}</span>
              </li>
            </ul>
          </div>

          <div v-if="hasTech" class="mb-8 border-b pb-6" :class="sectionDividerClass">
            <h3 class="film-detail-section-title font-bold mb-2 tracking-widest">TECH SPECS</h3>
            <ul class="space-y-1">
              <li v-if="tech.runtime"><strong>RUNTIME:</strong> {{ tech.runtime }}</li>
              <li v-if="tech.year"><strong>YEAR OF RELEASE:</strong> {{ tech.year }}</li>
              <li v-if="tech.originalTitle"><strong>ORIGINAL TITLE:</strong> {{ tech.originalTitle }}</li>
              <li v-if="tech.genre"><strong>GENRE:</strong> {{ tech.genre }}</li>
              <li v-if="tech.type"><strong>TYPE:</strong> {{ tech.type }}</li>
              <li v-if="tech.language"><strong>LANGUAGE:</strong> {{ tech.language }}</li>
              <li v-if="tech.format"><strong>FORMAT:</strong> {{ tech.format }}</li>
            </ul>
          </div>

          <!-- WATCH BUTTON -->
          <div class="mt-10 text-center lg:text-left" v-if="film.watchUrl">
            <a
              :href="film.watchUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="film-detail-button inline-block px-6 py-3 border uppercase tracking-wider transition rounded-none"
              :class="buttonClass"
            >
              ▶ Watch Film
            </a>
          </div>
        </div>
      </div>

      <!-- GALLERY -->
      <div v-if="film?.gallery?.length" class="mt-14">
        <h3 class="film-detail-section-title font-bold mb-4 tracking-widest">GALLERY</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <button v-for="(img, i) in galleryImages" :key="img.url + i" type="button"
            class="group relative overflow-hidden" @click="openLightbox(i)">
            <img :src="img.url"
              class="w-full aspect-square object-cover bg-gray-300 transition-transform duration-300 group-hover:scale-[1.02]"
              loading="lazy" />
          </button>
        </div>
      </div>

      <CustomLightbox
        v-model="lightboxOpen"
        :images="galleryImages"
        :initial-index="activeIndex"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useTheme } from '@/composables/useTheme'
import CustomLightbox from '@/components/CustomLightbox.vue'
import { useFilms } from '@/composables/useFilms.js'

const props = defineProps({
  slug: { type: String, required: true }
})

const { isLight } = useTheme()
const themeClass = computed(() =>
  isLight.value ? 'bg-white text-black' : 'bg-black text-white'
)

const metaClass = computed(() =>
  isLight.value
    ? 'border-black divide-black bg-white text-black'
    : 'border-white divide-white bg-black text-white'
)

const sectionDividerClass = computed(() =>
  isLight.value ? 'border-black/20' : 'border-white/20'
)

const buttonClass = computed(() =>
  isLight.value
    ? 'border-black bg-white text-black hover:border-black hover:bg-black hover:text-white'
    : 'border-white bg-black text-white hover:border-white hover:bg-white hover:text-black'
)

const { getBySlug } = useFilms()
const film = computed(() => getBySlug(props.slug))

/* LIGHTBOX */
const lightboxOpen = ref(false)
const activeIndex = ref(0)

function openLightbox(i) {
  activeIndex.value = i
  lightboxOpen.value = true
}

/* HELPERS */

function cleanText(value) {
  if (!value) return ''
  return String(value).replace(/\s+\n/g, '\n').trim()
}

const galleryImages = computed(() => {
  if (!film.value?.gallery) return []
  return film.value.gallery.map(img =>
    typeof img === 'string' ? { url: img } : img
  )
})

const tech = computed(() => {
  const f = film.value
  if (!f) return {}
  return {
    runtime: f.runtime || f.tech?.runtime,
    year: f.releaseYear || f.year || f.tech?.year,
    originalTitle: f.originalTitle || f.tech?.originalTitle,
    genre: f.genreFull || f.genres || f.tech?.genre,
    type: f.type || f.tech?.type,
    language: f.language || f.tech?.language,
    format: f.format
  }
})

const hasTech = computed(() => {
  const t = tech.value
  return !!(
    t.runtime ||
    t.year ||
    t.originalTitle ||
    t.genre ||
    t.type ||
    t.language ||
    t.format
  )
})
</script>

<style>
.film-detail-page {
  font-family: 'U001', sans-serif;
  font-weight: 400;
}

.film-detail-title,
.film-detail-section-title,
.film-detail-page h3,
.film-detail-button,
.film-detail-meta {
  font-family: 'U001 Condensed', sans-serif;
  font-weight: 700;
}

.film-detail-page strong {
  font-family: 'U001 Condensed', sans-serif;
  font-weight: 700;
}
</style>
