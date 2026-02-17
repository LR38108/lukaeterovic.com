<template>
  <section>
    <Toast :toasts="toasts" :is-light="isLight" @dismiss="dismissToast" />

    <ConfirmDialog
      v-model="dialog.isOpen.value"
      :title="dialog.title.value"
      :message="dialog.message.value"
      :confirm-text="dialog.confirmText.value"
      :cancel-text="dialog.cancelText.value"
      :destructive="dialog.destructive.value"
      @confirm="dialog.confirm"
      @cancel="dialog.cancel"
    />

    <!-- ================= LIST ================= -->
    <div v-if="mode === 'list'">
      <div class="flex justify-between items-center mb-12">
        <h2 class="text-2xl font-semibold tracking-tight">Films</h2>

        <button
          class="flex items-center gap-2 text-sm uppercase tracking-widest opacity-70 hover:opacity-100 transition"
          @click="createFilm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Add film</span>
        </button>
      </div>

      <div class="divide-y divide-current/10">
        <div v-for="f in films" :key="f.slug" class="flex items-center justify-between py-6">
          <div>
            <div class="font-medium">{{ f.title }}</div>
            <div class="text-xs opacity-50 mt-1">/{{ f.slug }}</div>
          </div>

          <div class="flex gap-8 items-center">
            <button class="opacity-40 hover:opacity-100 transition" @click="editFilm(f.slug)" aria-label="Edit">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487a2.1 2.1 0 113 3L8.25 19.1l-4 1 1-4L16.862 4.487z" />
              </svg>
            </button>

            <button class="text-xl leading-none opacity-30 hover:opacity-100 transition" @click="deleteFilmConfirm(f.slug)" aria-label="Delete">
              ×
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= EDITOR ================= -->
    <div v-else class="max-w-3xl">
      <button class="mb-12 text-sm opacity-50 hover:opacity-100 transition" @click="cancelEdit">
        ← Back
      </button>

      <h2 class="text-2xl font-semibold mb-16 tracking-tight">
        {{ isNew ? 'Add film' : 'Edit film' }}
      </h2>

      <!-- BASIC -->
      <section class="section">
        <h3 class="section-title">Basic</h3>

        <label class="field">
          <span class="label">Title</span>
          <input v-model="draft.title" class="control" :class="inputClass" />
        </label>

        <label class="field">
          <span class="label">Slug</span>
          <input v-model="draft.slug" class="control" :class="inputClass" @input="slugTouched = true" />
        </label>

        <label class="field">
          <span class="label">Tagline</span>
          <input v-model="draft.tagline" class="control" :class="inputClass" />
        </label>

        <label class="field">
          <span class="label">Description</span>
          <textarea v-model="draft.description" class="control textarea" :class="inputClass" />
        </label>
      </section>

      <!-- POSTER -->
      <section class="section">
        <h3 class="section-title">Poster</h3>

        <label class="field">
          <span class="label">Poster file</span>
          <input type="file" accept="image/*" class="file" @change="onPosterSelected" />
        </label>

        <div v-if="posterPreview" class="relative w-40 mt-2">
          <img :src="posterPreview" class="w-full aspect-[2/3] object-cover" />
          <button class="absolute top-2 right-2 text-xs opacity-60 hover:opacity-100" @click="removePoster" aria-label="Remove poster">
            ×
          </button>
        </div>
      </section>

      <!-- META -->
      <section class="section">
        <h3 class="section-title">Metadata</h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-12">
          <label class="field">
            <span class="label">Year</span>
            <input v-model="draft.year" class="control" :class="inputClass" />
          </label>

          <label class="field">
            <span class="label">Duration</span>
            <input v-model="draft.duration" class="control" :class="inputClass" />
          </label>

          <label class="field">
            <span class="label">Type</span>
            <input v-model="draft.type" class="control" :class="inputClass" />
          </label>

          <label class="field">
            <span class="label">Genres</span>
            <input v-model="draft.genres" class="control" :class="inputClass" />
          </label>
        </div>
      </section>

      <!-- DETAILS -->
      <section class="section">
        <h3 class="section-title">Details</h3>

        <label class="field">
          <span class="label">Original title</span>
          <input v-model="draft.originalTitle" class="control" :class="inputClass" />
        </label>

        <label class="field">
          <span class="label">Language</span>
          <input v-model="draft.language" class="control" :class="inputClass" />
        </label>

        <label class="field">
          <span class="label">Runtime</span>
          <input v-model="draft.runtime" class="control" :class="inputClass" />
        </label>

        <label class="field">
          <span class="label">Release year</span>
          <input v-model="draft.releaseYear" class="control" :class="inputClass" />
        </label>

        <label class="field">
          <span class="label">Full genre</span>
          <input v-model="draft.genreFull" class="control" :class="inputClass" />
        </label>

        <label class="field">
          <span class="label">Format</span>
          <input v-model="draft.format" class="control" :class="inputClass" />
        </label>
      </section>

      <!-- TEXT -->
      <section class="section">
        <h3 class="section-title">Text</h3>

        <label class="field">
          <span class="label">Plot summary</span>
          <textarea v-model="draft.plotSummary" class="control textarea" :class="inputClass" />
        </label>

        <label class="field">
          <span class="label">About the project</span>
          <textarea v-model="draft.aboutProject" class="control textarea" :class="inputClass" />
        </label>
      </section>

      <!-- CREDITS -->
      <section class="section">
        <h3 class="section-title">Credits</h3>

        <div v-for="(c, i) in draft.credits" :key="i" class="credit-row">
          <label class="field compact">
            <span class="label">Role</span>
            <input v-model="c.role" class="control" :class="inputClass" />
          </label>

          <label class="field compact">
            <span class="label">Name</span>
            <input v-model="c.name" class="control" :class="inputClass" />
          </label>

          <button class="text-xl leading-none opacity-30 hover:opacity-100 transition" @click="draft.credits.splice(i, 1)" aria-label="Remove credit">
            ×
          </button>
        </div>

        <button class="mt-4 text-sm uppercase tracking-widest opacity-60 hover:opacity-100 transition" @click="draft.credits.push({ role: '', name: '' })">
          Add credit
        </button>
      </section>

      <!-- GALLERY -->
      <section class="section">
        <h3 class="section-title">Gallery</h3>

        <label class="field">
          <span class="label">Add images</span>
          <input type="file" accept="image/*" multiple class="file" @change="onFilesSelected" />
        </label>

        <div ref="galleryEl" class="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
          <div v-for="(img, i) in displayedGallery" :key="img.url + i" class="relative" :class="img.pending ? 'opacity-40' : 'cursor-move'">
            <img :src="img.url" class="w-full aspect-square object-cover" />

            <button class="absolute top-2 right-2 text-xs opacity-50 hover:opacity-100" @click="removeImage(i, img)" aria-label="Remove image">
              ×
            </button>
          </div>
        </div>
      </section>

      <!-- WATCH -->
      <section class="section">
        <h3 class="section-title">Watch</h3>

        <label class="field">
          <span class="label">Watch URL</span>
          <input v-model="draft.watchUrl" class="control" :class="inputClass" />
        </label>
      </section>

      <!-- SAVE -->
      <button class="mt-16 text-sm uppercase tracking-widest opacity-60 hover:opacity-100 transition" @click="save">
        Save film
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import Sortable from 'sortablejs'
import { useTheme } from '@/composables/useTheme'
import { useFilms } from '@/composables/useFilms'
import { useDialog } from '@/composables/useDialog'
import { useToast } from '@/composables/useToast'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import Toast from '@/components/ui/Toast.vue'

const { isLight } = useTheme()
const { films, addFilm, updateFilm, removeFilm, fetchFilms } = useFilms()

const dialog = useDialog()
const { toasts, toast, dismiss: dismissToast } = useToast()

const inputClass = computed(() =>
  isLight.value ? 'border-black/20 focus:border-black text-black' : 'border-white/20 focus:border-white text-white'
)

const API_BASE = import.meta.env.VITE_API_BASE_URL
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN

const mode = ref('list')
const isNew = ref(false)
const draft = ref({})
const slugTouched = ref(false)

/* SLUG AUTO */
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
    if (!slugTouched.value) draft.value.slug = slugify(title)
  }
)

/* NORMALIZERS */
function normalizeGalleryForEditor(gallery) {
  return (gallery || []).map((img) => (typeof img === 'string' ? { url: img } : { url: img.url }))
}

/* STAGED */
const pendingPoster = ref(null) // { file, previewUrl }
const pendingGallery = ref([]) // [{ file, previewUrl }]

const posterPreview = computed(() =>
  pendingPoster.value ? pendingPoster.value.previewUrl : draft.value.poster || null
)

const displayedGallery = computed(() => {
  const saved = normalizeGalleryForEditor(draft.value.gallery).map((img) => ({ url: img.url, pending: false }))
  const pending = pendingGallery.value.map((p) => ({ url: p.previewUrl, pending: true }))
  return [...saved, ...pending]
})

function cleanupPending() {
  if (pendingPoster.value) URL.revokeObjectURL(pendingPoster.value.previewUrl)
  pendingGallery.value.forEach((p) => URL.revokeObjectURL(p.previewUrl))
  pendingPoster.value = null
  pendingGallery.value = []
}

/* CRUD */
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
    gallery: [],
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

/* DELETE CONFIRM */
async function deleteFilmConfirm(slug) {
  const ok = await dialog.openConfirm({
    title: 'Delete film?',
    message: 'This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    destructive: true
  })

  if (!ok) return

  try {
    await removeFilm(slug)
    toast('Deleted')
  } catch {
    toast('Delete failed', { duration: 2400 })
  }
}

/* UPLOAD */
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

/* FILE SELECT */
function onPosterSelected(e) {
  const file = e.target.files?.[0]
  if (!file) return

  if (pendingPoster.value) URL.revokeObjectURL(pendingPoster.value.previewUrl)
  pendingPoster.value = { file, previewUrl: URL.createObjectURL(file) }
  e.target.value = ''
}

function onFilesSelected(e) {
  for (const file of Array.from(e.target.files || [])) {
    pendingGallery.value.push({ file, previewUrl: URL.createObjectURL(file) })
  }
  e.target.value = ''
}

/* DELETE MEDIA */
async function removeImage(index, img) {
  if (img.pending) {
    const pendingIndex = index - normalizeGalleryForEditor(draft.value.gallery).length
    if (pendingIndex >= 0) {
      URL.revokeObjectURL(pendingGallery.value[pendingIndex].previewUrl)
      pendingGallery.value.splice(pendingIndex, 1)
    }
    return
  }

  await fetch(`${API_BASE}/media`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ADMIN_TOKEN}` },
    body: JSON.stringify({ url: img.url })
  })

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

/* SAVE */
async function save() {
  try {
    if (!draft.value.slug) {
      toast('Slug is required', { duration: 2400 })
      return
    }

    if (pendingPoster.value) draft.value.poster = await uploadFile(pendingPoster.value.file)

    if (pendingGallery.value.length) {
      for (const p of pendingGallery.value) {
        const url = await uploadFile(p.file)
        draft.value.gallery.push({ url })
      }
    }

    cleanupPending()

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

    if (isNew.value) await addFilm(payload)
    else await updateFilm(draft.value.slug, payload)

    await fetchFilms()
    toast('Saved')
    mode.value = 'list'
  } catch {
    toast('Save failed', { duration: 2400 })
  }
}

/* SORTABLE */
const galleryEl = ref(null)
let sortable = null

function initSortable() {
  if (!galleryEl.value) return
  if (sortable) sortable.destroy()

  sortable = Sortable.create(galleryEl.value, {
    animation: 150,
    filter: '.opacity-40',
    onMove(evt) {
      if (evt.dragged?.classList?.contains('opacity-40')) return false
      if (evt.related?.classList?.contains('opacity-40')) return false
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

/* KEYBOARD */
function onKeydown(e) {
  const inEdit = mode.value === 'edit'
  const metaSave = (e.metaKey || e.ctrlKey) && (e.key === 's' || e.key === 'S')
  if (inEdit && metaSave) {
    e.preventDefault()
    save()
    return
  }

  if (inEdit && e.key === 'Escape' && !dialog.isOpen.value) {
    e.preventDefault()
    cancelEdit()
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
.section {
  margin-bottom: 4rem;
}

.section-title {
  font-size: 0.85rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.5;
  margin-bottom: 2rem;
}

.field {
  display: block;
  margin-bottom: 2rem;
}

.field.compact {
  margin-bottom: 0;
}

.label {
  display: block;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.5;
  margin-bottom: 0.75rem;
}

.control {
  width: 100%;
  padding: 0.25rem 0 0.6rem;
  background: transparent;
  border-bottom-width: 1px;
  outline: none;
}

.textarea {
  min-height: 120px;
  resize: vertical;
}

.file {
  opacity: 0.7;
}

.credit-row {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1.25rem;
  align-items: end;
  margin-bottom: 1.25rem;
}
</style>
