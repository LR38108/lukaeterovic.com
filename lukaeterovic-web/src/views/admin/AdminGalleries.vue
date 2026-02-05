<!-- src/views/admin/AdminGalleries.vue -->
<template>
  <section>
    <!-- LIST -->
    <div v-if="mode === 'list'">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-2xl font-semibold">Galleries</h2>
        <button class="px-4 py-2 border rounded" :class="btnClass" @click="createGallery">
          + Add gallery
        </button>
      </div>

      <div class="border rounded divide-y">
        <div
          v-for="g in galleries"
          :key="g.slug"
          class="flex items-center justify-between px-4 py-3"
        >
          <div>
            <div class="font-semibold">{{ g.title }}</div>
            <div class="text-sm opacity-60">/{{ g.slug }}</div>
          </div>

          <div class="flex gap-4">
            <button @click="editGallery(g.slug)">✏️</button>
            <button @click="deleteGalleryConfirm(g.slug)">❌</button>
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
        {{ isNew ? 'Add gallery' : 'Edit gallery' }}
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
          <input
            v-model="draft.slug"
            class="input"
            :class="[inputClass, !isNew ? 'cursor-not-allowed' : '']"
            :disabled="!isNew"
          />
          <p v-if="!isNew" class="text-xs opacity-50 mt-2">
            Slug is locked after creation to keep URLs stable.
          </p>
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

      <!-- META -->
      <section class="section">
        <h3 class="section-title">Metadata</h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <label class="field">
            <span class="label">Year</span>
            <input v-model="draft.year" class="input" :class="inputClass" />
          </label>

          <label class="field">
            <span class="label">Location</span>
            <input v-model="draft.location" class="input" :class="inputClass" />
          </label>
        </div>
      </section>

      <!-- COVER -->
      <section class="section">
        <h3 class="section-title">Cover image</h3>

        <input type="file" accept="image/*" class="mb-4" @change="onCoverSelected" />

        <div v-if="coverPreview" class="relative w-48">
          <img :src="coverPreview" class="w-full aspect-square object-cover border rounded" />
          <button
            @click="removeCover"
            class="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded"
          >
            ✕
          </button>
        </div>
      </section>

      <!-- IMAGES -->
      <section class="section">
        <h3 class="section-title">Images</h3>

        <input type="file" accept="image/*" multiple class="mb-4" @change="onFilesSelected" />

        <p class="text-xs opacity-60 mb-4">
          Images upload when you save the gallery.
        </p>

        <!-- keeps layout from feeling "jumpy" when empty -->
        <div class="min-h-[120px]">
          <div ref="galleryEl" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <div
              v-for="(img, i) in displayedImages"
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
        </div>
      </section>

      <div class="mt-10">
        <button class="px-6 py-3 border rounded" :class="btnClass" @click="save">
          Save gallery
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import Sortable from 'sortablejs'
import { useTheme } from '@/composables/useTheme'
import { useGalleries } from '@/composables/useGalleries'

const { isLight } = useTheme()
const { galleries, addGallery, updateGallery, removeGallery, init } = useGalleries()
onMounted(init)

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
const originalSlug = ref(null)

/* ---------------- SLUG ---------------- */

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
  title => {
    if (isNew.value) draft.value.slug = slugify(title)
  }
)

/* ---------------- STAGED UPLOAD ---------------- */

const pendingImages = ref([]) // { file, previewUrl }
const pendingCover = ref(null) // { file, previewUrl }

const coverPreview = computed(() =>
  pendingCover.value ? pendingCover.value.previewUrl : draft.value.coverImage
)

const displayedImages = computed(() => [
  ...(draft.value.images || []).map(img => ({ ...img, pending: false })),
  ...pendingImages.value.map(p => ({ url: p.previewUrl, pending: true }))
])

function cleanupPending() {
  pendingImages.value.forEach(p => URL.revokeObjectURL(p.previewUrl))
  if (pendingCover.value) URL.revokeObjectURL(pendingCover.value.previewUrl)
  pendingImages.value = []
  pendingCover.value = null
}

/* ---------------- CRUD ---------------- */

function createGallery() {
  cleanupPending()
  draft.value = {
    title: '',
    slug: '',
    year: '',
    location: '',
    tagline: '',
    description: '',
    coverImage: null,
    images: []
  }
  originalSlug.value = null
  isNew.value = true
  mode.value = 'edit'
}

function editGallery(slug) {
  cleanupPending()
  const g = galleries.value.find(g => g.slug === slug)
  if (!g) return

  draft.value = JSON.parse(JSON.stringify(g))
  originalSlug.value = g.slug
  isNew.value = false
  mode.value = 'edit'
}

function cancelEdit() {
  cleanupPending()
  mode.value = 'list'
}

function deleteGalleryConfirm(slug) {
  if (confirm('Delete gallery?')) removeGallery(slug)
}

/* ---------------- UPLOAD ---------------- */

async function uploadFile(file) {
  const form = new FormData()
  form.append('file', file)
  form.append('section', 'photography')
  form.append('slug', originalSlug.value || draft.value.slug)

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
    body: form
  })

  if (!res.ok) throw new Error('Upload failed')
  const data = await res.json()
  return { url: data.url, exif: data.exif || null }
}

/* ---------------- FILE SELECT ---------------- */

function onFilesSelected(e) {
  for (const file of Array.from(e.target.files || [])) {
    pendingImages.value.push({ file, previewUrl: URL.createObjectURL(file) })
  }
  e.target.value = ''
}

function onCoverSelected(e) {
  const file = e.target.files?.[0]
  if (!file) return

  if (pendingCover.value) URL.revokeObjectURL(pendingCover.value.previewUrl)
  pendingCover.value = { file, previewUrl: URL.createObjectURL(file) }
  e.target.value = ''
}

/* ---------------- DELETE ---------------- */

async function removeImage(index, img) {
  if (img.pending) {
    const pendingIndex = index - (draft.value.images?.length || 0)
    if (pendingIndex >= 0) {
      URL.revokeObjectURL(pendingImages.value[pendingIndex].previewUrl)
      pendingImages.value.splice(pendingIndex, 1)
    }
    return
  }

  await fetch(`${API_BASE}/media`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ADMIN_TOKEN}`
    },
    body: JSON.stringify({ url: img.url })
  })

  draft.value.images.splice(index, 1)
}

function removeCover() {
  if (pendingCover.value) {
    URL.revokeObjectURL(pendingCover.value.previewUrl)
    pendingCover.value = null
    return
  }
  draft.value.coverImage = null
}

/* ---------------- SAVE ---------------- */

async function save() {
  if (!draft.value.slug) {
    alert('Slug is required')
    return
  }

  // cover first
  if (pendingCover.value) {
    const uploaded = await uploadFile(pendingCover.value.file)
    draft.value.coverImage = uploaded.url
  }

  // then images
  if (pendingImages.value.length) {
    const uploaded = []
    for (const p of pendingImages.value) uploaded.push(await uploadFile(p.file))
    draft.value.images.push(...uploaded)
  }

  cleanupPending()

  if (isNew.value) {
    await addGallery(draft.value)
  } else {
    // IMPORTANT: update by original slug
    await updateGallery(originalSlug.value, draft.value)
  }

  mode.value = 'list'
}

/* ---------------- SORTABLE ---------------- */

const galleryEl = ref(null)
let sortable = null

function initSortable() {
  if (!galleryEl.value) return
  if (sortable) sortable.destroy()

  // Prevent dragging pending items (they are appended after saved ones)
  sortable = Sortable.create(galleryEl.value, {
    animation: 150,
    filter: '.opacity-60',
    onMove(evt) {
      if (evt.dragged?.classList?.contains('opacity-60')) return false
      if (evt.related?.classList?.contains('opacity-60')) return false
      return true
    },
    onEnd(evt) {
      const savedCount = (draft.value.images || []).length
      if (evt.oldIndex >= savedCount || evt.newIndex >= savedCount) return

      const moved = draft.value.images.splice(evt.oldIndex, 1)[0]
      draft.value.images.splice(evt.newIndex, 0, moved)
    }
  })
}

watch(() => mode.value, v => v === 'edit' && setTimeout(initSortable))
</script>

<style scoped>
.section {
  margin-bottom: 3rem;
  min-height: 1px;
}
.section-title {
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
}
.field {
  display: block;
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

/* Make disabled inputs look consistent (no ugly grey) */
input:disabled,
textarea:disabled {
  opacity: 1;
}
</style>
