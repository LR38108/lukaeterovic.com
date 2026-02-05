<!-- src/views/admin/AdminMusicVideos.vue -->
<template>
  <section>
    <!-- LIST -->
    <div v-if="mode === 'list'">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-2xl font-semibold">Music Videos</h2>
        <button class="px-4 py-2 border rounded" :class="btnClass" @click="createVideo">
          + Add music video
        </button>
      </div>

      <div class="border rounded divide-y">
        <div
          v-for="v in musicVideos"
          :key="v.slug"
          class="flex items-center justify-between px-4 py-3"
        >
          <div>
            <div class="font-semibold">{{ v.artist }} — {{ v.title }}</div>
            <div class="text-sm opacity-60">/{{ v.slug }}</div>
          </div>

          <div class="flex gap-4">
            <button @click="editVideo(v.slug)">✏️</button>
            <button @click="deleteVideoConfirm(v.slug)">❌</button>
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
        {{ isNew ? 'Add music video' : 'Edit music video' }}
      </h2>

      <!-- BASIC -->
      <section class="section">
        <h3 class="section-title">Basic information</h3>

        <label class="field">
          <span class="label">Artist</span>
          <input v-model="draft.artist" class="input" :class="inputClass" />
        </label>

        <label class="field">
          <span class="label">Title</span>
          <input v-model="draft.title" class="input" :class="inputClass" />
        </label>

        <label class="field">
          <span class="label">Slug</span>
          <input v-model="draft.slug" class="input" :class="inputClass" :disabled="!isNew" />
        </label>

        <label class="field">
          <span class="label">Year</span>
          <input v-model="draft.year" class="input" :class="inputClass" />
        </label>
      </section>

      <!-- VIDEO -->
      <section class="section">
        <h3 class="section-title">Video</h3>

        <label class="field">
          <span class="label">YouTube URL</span>
          <input v-model="draft.videoUrl" class="input" :class="inputClass" />
        </label>
      </section>

      <!-- DESCRIPTION -->
      <section class="section">
        <h3 class="section-title">Description</h3>
        <textarea v-model="draft.description" class="input" :class="inputClass" />
      </section>

      <!-- CREDITS -->
      <section class="section">
        <h3 class="section-title">Credits</h3>

        <div v-for="(c, i) in draft.credits" :key="i" class="flex gap-3 mb-3">
          <input v-model="c.role" class="input" :class="inputClass" placeholder="Role" />
          <input v-model="c.name" class="input" :class="inputClass" placeholder="Name" />
          <button @click="draft.credits.splice(i, 1)">❌</button>
        </div>

        <button @click="draft.credits.push({ role: '', name: '' })">
          + Add credit
        </button>
      </section>

      <!-- THUMBNAIL -->
      <section class="section">
        <h3 class="section-title">Thumbnail</h3>

        <input type="file" accept="image/*" @change="onThumbnailSelected" />

        <div v-if="thumbnailPreview" class="mt-4 relative w-64">
          <img :src="thumbnailPreview" class="rounded" />
          <button
            class="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded"
            @click="removeThumbnail"
          >
            ✕
          </button>
        </div>
      </section>

      <!-- STILLS -->
      <section class="section">
        <h3 class="section-title">Stills</h3>

        <input type="file" accept="image/*" multiple @change="onStillsSelected" />

        <p class="text-xs opacity-60 mt-2 mb-4">
          Images upload when you save the music video.
        </p>

        <div
          ref="galleryEl"
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        >
          <div
            v-for="(img, i) in displayedGallery"
            :key="img.url + i"
            class="relative cursor-move"
            :class="img.pending ? 'opacity-60' : ''"
          >
            <img :src="img.url" class="rounded" />
            <button
              class="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded"
              @click="removeImage(i, img)"
            >
              ✕
            </button>
          </div>
        </div>
      </section>

      <div class="mt-10">
        <button class="px-6 py-3 border rounded" :class="btnClass" @click="save">
          Save music video
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Sortable from 'sortablejs'
import { useTheme } from '@/composables/useTheme'
import { useMusicVideos } from '@/composables/useMusicVideos'

const { isLight } = useTheme()
const { musicVideos, addMusicVideo, updateMusicVideo, removeMusicVideo, init } =
  useMusicVideos()

init()

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

/* ---------------- STAGED STATE ---------------- */

const pendingThumbnail = ref(null) // { file, previewUrl }
const pendingStills = ref([]) // [{ file, previewUrl }]

const thumbnailPreview = computed(() =>
  pendingThumbnail.value
    ? pendingThumbnail.value.previewUrl
    : draft.value.thumbnail || null
)

const displayedGallery = computed(() => [
  ...(draft.value.gallery || []).map(url => ({ url, pending: false })),
  ...pendingStills.value.map(p => ({ url: p.previewUrl, pending: true }))
])

function cleanupPending() {
  if (pendingThumbnail.value) URL.revokeObjectURL(pendingThumbnail.value.previewUrl)
  pendingStills.value.forEach(p => URL.revokeObjectURL(p.previewUrl))
  pendingThumbnail.value = null
  pendingStills.value = []
}

/* ---------------- CRUD ---------------- */

function createVideo() {
  draft.value = {
    artist: '',
    title: '',
    slug: '',
    year: '',
    videoUrl: '',
    description: '',
    thumbnail: null,
    gallery: [],
    credits: []
  }
  isNew.value = true
  mode.value = 'edit'
}

function editVideo(slug) {
  const v = musicVideos.value.find(v => v.slug === slug)

  draft.value = {
    ...JSON.parse(JSON.stringify(v)),
    gallery: (v.gallery || []).map(img =>
      typeof img === 'string' ? img : img.url
    )
  }

  isNew.value = false
  mode.value = 'edit'
}

function cancelEdit() {
  cleanupPending()
  mode.value = 'list'
}

function deleteVideoConfirm(slug) {
  if (confirm('Delete music video?')) removeMusicVideo(slug)
}

/* ---------------- UPLOAD ---------------- */

async function uploadFile(file) {
  const form = new FormData()
  form.append('file', file)
  form.append('section', 'music-videos')
  form.append('slug', draft.value.slug)

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
    body: form
  })

  if (!res.ok) throw new Error('Upload failed')
  const data = await res.json()
  return data.url
}

/* ---------------- FILE SELECT ---------------- */

function onThumbnailSelected(e) {
  const file = e.target.files[0]
  if (!file) return

  if (pendingThumbnail.value)
    URL.revokeObjectURL(pendingThumbnail.value.previewUrl)

  pendingThumbnail.value = {
    file,
    previewUrl: URL.createObjectURL(file)
  }
  e.target.value = ''
}

function onStillsSelected(e) {
  for (const file of Array.from(e.target.files)) {
    pendingStills.value.push({
      file,
      previewUrl: URL.createObjectURL(file)
    })
  }
  e.target.value = ''
}

/* ---------------- DELETE ---------------- */

async function removeImage(index, img) {
  if (img.pending) {
    pendingStills.value.splice(
      index - (draft.value.gallery?.length || 0),
      1
    )
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

  draft.value.gallery.splice(index, 1)
}

function removeThumbnail() {
  if (pendingThumbnail.value) pendingThumbnail.value = null
  else draft.value.thumbnail = null
}

/* ---------------- SAVE ---------------- */

async function save() {
  if (pendingThumbnail.value) {
    draft.value.thumbnail = await uploadFile(pendingThumbnail.value.file)
  }

  if (pendingStills.value.length) {
    for (const p of pendingStills.value) {
      draft.value.gallery.push(await uploadFile(p.file))
    }
  }

  cleanupPending()

  const payload = {
    artist: draft.value.artist,
    title: draft.value.title,
    slug: draft.value.slug,
    year: draft.value.year,
    video_url: draft.value.videoUrl,
    description: draft.value.description,
    thumbnail: draft.value.thumbnail,
    credits: draft.value.credits,
    gallery: draft.value.gallery
  }

  if (isNew.value) await addMusicVideo(payload)
  else await updateMusicVideo(draft.value.slug, payload)

  mode.value = 'list'
}

/* ---------------- SORTABLE ---------------- */

const galleryEl = ref(null)
let sortable = null

watch(() => mode.value, v => {
  if (v === 'edit') {
    setTimeout(() => {
      if (sortable) sortable.destroy()
      sortable = Sortable.create(galleryEl.value, {
        animation: 150,
        onEnd(evt) {
          const moved = draft.value.gallery.splice(evt.oldIndex, 1)[0]
          draft.value.gallery.splice(evt.newIndex, 0, moved)
        }
      })
    })
  }
})
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
}
</style>
