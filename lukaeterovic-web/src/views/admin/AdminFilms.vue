<!-- src/views/admin/AdminFilms.vue -->
<template>
  <section>
    <!-- LIST -->
    <div v-if="mode === 'list'">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-2xl font-semibold">Films</h2>
        <button class="px-4 py-2 border rounded" :class="btnClass" @click="createFilm">
          + Add film
        </button>
      </div>

      <div class="border rounded divide-y">
        <div v-for="f in films" :key="f.slug" class="flex items-center justify-between px-4 py-3">
          <div>
            <div class="font-semibold">{{ f.title }}</div>
            <div class="text-sm opacity-60">/{{ f.slug }}</div>
          </div>
          <div class="flex gap-4">
            <button @click="editFilm(f.slug)">✏️</button>
            <button @click="deleteFilmConfirm(f.slug)">❌</button>
          </div>
        </div>
      </div>
    </div>

    <!-- EDITOR -->
    <div v-else class="max-w-3xl">
      <button class="mb-6 opacity-70" @click="cancelEdit">
        ← Back to list
      </button>

      <h2 class="text-2xl font-semibold mb-10">
        {{ isNew ? 'Add film' : 'Edit film' }}
      </h2>

      <!-- BASIC -->
      <section class="section">
        <h3 class="section-title">Basic information</h3>

        <label class="field">
          <span class="label">Title</span>
          <input v-model="draft.title" class="input" :class="inputClass" />
        </label>

        <label class="field">
          <span class="label">Slug</span>
          <input v-model="draft.slug" class="input" :class="inputClass" @input="slugTouched = true" />
        </label>

        <label class="field">
          <span class="label">Tagline</span>
          <input v-model="draft.tagline" class="input" :class="inputClass" />
        </label>

        <label class="field">
          <span class="label">Description</span>
          <textarea v-model="draft.description" class="input" :class="inputClass" />
        </label>
      </section>

      <!-- POSTER -->
      <section class="section">
        <h3 class="section-title">Poster</h3>

        <input type="file" accept="image/*" class="mb-4" @change="onPosterSelected" />

        <div v-if="posterPreview" class="relative w-48">
          <img :src="posterPreview" class="w-full aspect-[2/3] object-cover border rounded" />
          <button
            @click="removePoster"
            class="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded"
          >
            ✕
          </button>
        </div>
      </section>

      <!-- META -->
      <section class="section">
        <h3 class="section-title">Metadata</h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <label class="field">
            <span class="label">Year</span>
            <input v-model="draft.year" class="input" :class="inputClass" />
          </label>

          <label class="field">
            <span class="label">Duration</span>
            <input v-model="draft.duration" class="input" :class="inputClass" />
          </label>

          <label class="field">
            <span class="label">Type</span>
            <input v-model="draft.type" class="input" :class="inputClass" />
          </label>

          <label class="field">
            <span class="label">Genres</span>
            <input v-model="draft.genres" class="input" :class="inputClass" />
          </label>
        </div>
      </section>

      <!-- DETAILS -->
      <section class="section">
        <h3 class="section-title">Film details</h3>

        <label class="field">
          <span class="label">Original title</span>
          <input v-model="draft.originalTitle" class="input" :class="inputClass" />
        </label>

        <label class="field">
          <span class="label">Language</span>
          <input v-model="draft.language" class="input" :class="inputClass" />
        </label>

        <label class="field">
          <span class="label">Runtime</span>
          <input v-model="draft.runtime" class="input" :class="inputClass" />
        </label>

        <label class="field">
          <span class="label">Release year</span>
          <input v-model="draft.releaseYear" class="input" :class="inputClass" />
        </label>

        <label class="field">
          <span class="label">Full genre</span>
          <input v-model="draft.genreFull" class="input" :class="inputClass" />
        </label>

        <label class="field">
          <span class="label">Format</span>
          <input v-model="draft.format" class="input" :class="inputClass" />
        </label>
      </section>

      <!-- TEXT CONTENT -->
      <section class="section">
        <h3 class="section-title">Text content</h3>

        <label class="field">
          <span class="label">Plot summary</span>
          <textarea
            v-model="draft.plotSummary"
            class="input"
            :class="inputClass"
            placeholder="Short synopsis of the film"
          />
        </label>

        <label class="field">
          <span class="label">About the project</span>
          <textarea
            v-model="draft.aboutProject"
            class="input"
            :class="inputClass"
            placeholder="Background, concept, production notes"
          />
        </label>
      </section>

      <!-- CREDITS -->
      <section class="section">
        <h3 class="section-title">Credits</h3>

        <div v-for="(c, i) in draft.credits" :key="i" class="flex gap-3 mb-3">
          <input v-model="c.role" class="input" :class="inputClass" placeholder="Role" />
          <input v-model="c.name" class="input" :class="inputClass" placeholder="Name" />
          <button @click="draft.credits.splice(i, 1)">❌</button>
        </div>

        <button @click="draft.credits.push({ role: '', name: '' })">+ Add credit</button>
      </section>

      <!-- GALLERY -->
      <section class="section">
        <h3 class="section-title">Gallery</h3>

        <input type="file" accept="image/*" multiple class="mb-4" @change="onFilesSelected" />

        <p class="text-xs opacity-60 mb-4">Images upload when you save the film.</p>

        <div ref="galleryEl" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <div
            v-for="(img, i) in displayedGallery"
            :key="img.url + i"
            class="border rounded overflow-hidden relative"
            :class="img.pending ? 'opacity-60' : 'cursor-move'"
          >
            <img :src="img.url" class="w-full aspect-square object-cover bg-black/5" />

            <button
              @click="removeImage(i, img)"
              class="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded"
            >
              ✕
            </button>

            <div class="px-2 py-1 text-xs truncate">
              {{ img.pending ? 'Pending…' : img.url.split('/').pop() }}
            </div>
          </div>
        </div>
      </section>

      <!-- WATCH -->
      <section class="section">
        <h3 class="section-title">Watch</h3>

        <label class="field">
          <span class="label">Watch URL</span>
          <input v-model="draft.watchUrl" class="input" :class="inputClass" />
        </label>
      </section>

      <div class="mt-10">
        <button class="px-6 py-3 border rounded" :class="btnClass" @click="save">
          Save film
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Sortable from 'sortablejs'
import { useTheme } from '@/composables/useTheme'
import { useFilms } from '@/composables/useFilms'

const { isLight } = useTheme()
const { films, addFilm, updateFilm, removeFilm, fetchFilms } = useFilms()

const btnClass = computed(() => (isLight.value ? 'border-black' : 'border-white'))
const inputClass = computed(() =>
  isLight.value
    ? 'bg-white text-black border border-black/30'
    : 'bg-black text-white border border-white/30'
)

const API_BASE = import.meta.env.VITE_API_BASE_URL
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN

const mode = ref('list')
const isNew = ref(false)
const draft = ref({})
const slugTouched = ref(false)

/* ---------------- SLUG AUTO ---------------- */

function slugify(input) {
  return String(input || '')
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

watch(
  () => draft.value.title,
  (title) => {
    if (!slugTouched.value) {
      draft.value.slug = slugify(title)
    }
  }
)

/* ---------------- NORMALIZERS ---------------- */

// Admin UI rule: gallery is ALWAYS [{ url }]
function normalizeGalleryForEditor(gallery) {
  return (gallery || []).map((img) =>
    typeof img === 'string' ? { url: img } : { url: img.url }
  )
}

/* ---------------- STAGED STATE ---------------- */

const pendingPoster = ref(null) // { file, previewUrl }
const pendingGallery = ref([]) // [{ file, previewUrl }]

const posterPreview = computed(() =>
  pendingPoster.value ? pendingPoster.value.previewUrl : draft.value.poster || null
)

const displayedGallery = computed(() => {
  const saved = normalizeGalleryForEditor(draft.value.gallery).map((img) => ({
    url: img.url,
    pending: false
  }))
  const pending = pendingGallery.value.map((p) => ({
    url: p.previewUrl,
    pending: true
  }))
  return [...saved, ...pending]
})

function cleanupPending() {
  if (pendingPoster.value) URL.revokeObjectURL(pendingPoster.value.previewUrl)
  pendingGallery.value.forEach((p) => URL.revokeObjectURL(p.previewUrl))
  pendingPoster.value = null
  pendingGallery.value = []
}

/* ---------------- CRUD ---------------- */

function createFilm() {
  slugTouched.value = false
  cleanupPending()

  draft.value = {
    title: '',
    slug: '',
    year: '',
    duration: '',
    type: '',
    genres: '',
    tagline: '',
    description: '',
    poster: null,

    originalTitle: '',
    language: '',
    runtime: '',
    releaseYear: '',
    genreFull: '',
    format: '',

    plotSummary: '',
    aboutProject: '',

    credits: [],
    gallery: [], // editor shape: [{url}]
    watchUrl: ''
  }
  isNew.value = true
  mode.value = 'edit'
}

function editFilm(slug) {
  slugTouched.value = true
  cleanupPending()

  const film = films.value.find((f) => f.slug === slug)
  if (!film) return

  draft.value = {
    ...JSON.parse(JSON.stringify(film)),
    poster: film.poster || null,
    credits: Array.isArray(film.credits) ? film.credits : [],
    gallery: normalizeGalleryForEditor(film.gallery),
    plotSummary: film.plotSummary ?? film.plot_summary ?? '',
    aboutProject: film.aboutProject ?? film.about_project ?? ''
  }

  isNew.value = false
  mode.value = 'edit'
}

function cancelEdit() {
  cleanupPending()
  mode.value = 'list'
}

function deleteFilmConfirm(slug) {
  if (confirm('Delete film?')) removeFilm(slug)
}

/* ---------------- UPLOAD ---------------- */

async function uploadFile(file) {
  const form = new FormData()
  form.append('file', file)
  form.append('section', 'films')
  form.append('slug', draft.value.slug)

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
    body: form
  })

  if (!res.ok) throw new Error('Upload failed')

  const data = await res.json()
  if (!data.url) throw new Error('Invalid upload response')

  return data.url
}

/* ---------------- FILE SELECT ---------------- */

function onPosterSelected(e) {
  const file = e.target.files?.[0]
  if (!file) return

  if (pendingPoster.value) URL.revokeObjectURL(pendingPoster.value.previewUrl)
  pendingPoster.value = {
    file,
    previewUrl: URL.createObjectURL(file)
  }

  e.target.value = ''
}

function onFilesSelected(e) {
  for (const file of Array.from(e.target.files || [])) {
    pendingGallery.value.push({
      file,
      previewUrl: URL.createObjectURL(file)
    })
  }
  e.target.value = ''
}

/* ---------------- DELETE ---------------- */

async function removeImage(index, img) {
  if (img.pending) {
    // pending items are at the end of displayedGallery
    const pendingIndex = index - normalizeGalleryForEditor(draft.value.gallery).length
    if (pendingIndex >= 0) {
      URL.revokeObjectURL(pendingGallery.value[pendingIndex].previewUrl)
      pendingGallery.value.splice(pendingIndex, 1)
    }
    return
  }

  // delete remote file
  await fetch(`${API_BASE}/media`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ADMIN_TOKEN}`
    },
    body: JSON.stringify({ url: img.url })
  })

  // remove from saved gallery
  draft.value.gallery.splice(index, 1)
}

function removePoster() {
  if (pendingPoster.value) {
    URL.revokeObjectURL(pendingPoster.value.previewUrl)
    pendingPoster.value = null
    return
  }
  draft.value.poster = null
}

/* ---------------- SAVE ---------------- */

async function save() {
  if (!draft.value.slug) {
    alert('Slug is required')
    return
  }

  // upload poster if staged
  if (pendingPoster.value) {
    draft.value.poster = await uploadFile(pendingPoster.value.file)
  }

  // upload staged gallery, append as objects
  if (pendingGallery.value.length) {
    for (const p of pendingGallery.value) {
      const url = await uploadFile(p.file)
      draft.value.gallery.push({ url })
    }
  }

  cleanupPending()

  // normalize gallery for DB/API: string[]
  const galleryUrls = normalizeGalleryForEditor(draft.value.gallery).map((img) => img.url)

  const payload = {
    slug: draft.value.slug,
    title: draft.value.title ?? '',
    year: draft.value.year ?? '',
    duration: draft.value.duration ?? '',
    type: draft.value.type ?? '',
    genres: draft.value.genres ?? '',
    tagline: draft.value.tagline ?? '',
    description: draft.value.description ?? '',
    poster: draft.value.poster ?? null,

    originalTitle: draft.value.originalTitle ?? '',
    language: draft.value.language ?? '',
    runtime: draft.value.runtime ?? '',
    releaseYear: draft.value.releaseYear ?? '',
    genreFull: draft.value.genreFull ?? '',
    format: draft.value.format ?? '',

    plotSummary: draft.value.plotSummary ?? '',
    aboutProject: draft.value.aboutProject ?? '',

    credits: Array.isArray(draft.value.credits) ? draft.value.credits : [],
    gallery: galleryUrls,
    watchUrl: draft.value.watchUrl ?? '',

    tech: {
      runtime: draft.value.runtime ?? '',
      year: draft.value.releaseYear ?? '',
      originalTitle: draft.value.originalTitle ?? '',
      genre: draft.value.genreFull ?? '',
      type: draft.value.type ?? '',
      language: draft.value.language ?? ''
    }
  }

  if (isNew.value) {
    await addFilm(payload)
  } else {
    await updateFilm(draft.value.slug, payload)
  }

  await fetchFilms()
  mode.value = 'list'
}

/* ---------------- SORTABLE ---------------- */

const galleryEl = ref(null)
let sortable = null

function initSortable() {
  if (!galleryEl.value) return
  if (sortable) sortable.destroy()

  // Only reorder SAVED items (pending previews stay at the end)
  sortable = Sortable.create(galleryEl.value, {
    animation: 150,
    filter: '.opacity-60', // pending items
    onMove(evt) {
      // prevent dragging pending items
      if (evt.related && evt.related.classList.contains('opacity-60')) return false
      if (evt.dragged && evt.dragged.classList.contains('opacity-60')) return false
      return true
    },
    onEnd(evt) {
      const savedCount = normalizeGalleryForEditor(draft.value.gallery).length
      if (evt.oldIndex >= savedCount || evt.newIndex >= savedCount) return

      const moved = draft.value.gallery.splice(evt.oldIndex, 1)[0]
      draft.value.gallery.splice(evt.newIndex, 0, moved)
    }
  })
}

watch(() => mode.value, (v) => v === 'edit' && setTimeout(initSortable))
</script>

<style scoped>
.section {
  margin-bottom: 3rem;
}
.section-title {
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
}
.field {
  margin-bottom: 1.5rem;
}
.label {
  display: block;
  margin-bottom: 0.4rem;
  font-size: 0.8rem;
  font-weight: 600;
  opacity: 0.7;
}
.input {
  width: 100%;
  padding: 0.6rem;
  border-radius: 4px;
}
textarea.input {
  min-height: 120px;
  resize: vertical;
}
</style>
