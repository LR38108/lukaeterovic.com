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
        <h2 class="text-2xl font-semibold tracking-tight">Music Videos</h2>

        <button
          class="flex items-center gap-2 text-sm uppercase tracking-widest opacity-70 hover:opacity-100 transition"
          @click="createVideo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Add music video</span>
        </button>
      </div>

      <div class="divide-y divide-current/10">
        <div
          v-for="v in musicVideos"
          :key="v.slug"
          class="flex items-center justify-between py-6"
        >
          <div>
            <div class="font-medium">
              {{ v.artist }} — {{ v.title }}
            </div>
            <div class="text-xs opacity-50 mt-1">
              /{{ v.slug }}
            </div>
          </div>

          <div class="flex gap-8 items-center">
            <button
              class="opacity-40 hover:opacity-100 transition"
              @click="editVideo(v.slug)"
              aria-label="Edit"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487a2.1 2.1 0 113 3L8.25 19.1l-4 1 1-4L16.862 4.487z" />
              </svg>
            </button>

            <button
              class="text-xl leading-none opacity-30 hover:opacity-100 transition"
              @click="deleteVideoConfirm(v.slug)"
              aria-label="Delete"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= EDITOR ================= -->
    <div v-else class="max-w-3xl">
      <button
        class="mb-12 text-sm opacity-50 hover:opacity-100 transition"
        @click="cancelEdit"
      >
        ← Back
      </button>

      <h2 class="text-2xl font-semibold mb-16 tracking-tight">
        {{ isNew ? 'Add music video' : 'Edit music video' }}
      </h2>

      <!-- BASIC -->
      <section class="section">
        <h3 class="section-title">Basic</h3>

        <label class="field">
          <span class="label">Artist</span>
          <input v-model="draft.artist" class="control" :class="inputClass" />
        </label>

        <label class="field">
          <span class="label">Title</span>
          <input v-model="draft.title" class="control" :class="inputClass" />
        </label>

        <label class="field">
          <span class="label">Slug</span>
          <input
            v-model="draft.slug"
            class="control"
            :class="[inputClass, !isNew ? 'opacity-40 cursor-not-allowed' : '']"
            :disabled="!isNew"
          />
        </label>

        <label class="field">
          <span class="label">Year</span>
          <input v-model="draft.year" class="control" :class="inputClass" />
        </label>
      </section>

      <!-- VIDEO -->
      <section class="section">
        <h3 class="section-title">Video</h3>

        <label class="field">
          <span class="label">YouTube URL</span>
          <input v-model="draft.videoUrl" class="control" :class="inputClass" />
        </label>
      </section>

      <!-- DESCRIPTION -->
      <section class="section">
        <h3 class="section-title">Description</h3>

        <label class="field">
          <span class="label">Text</span>
          <textarea v-model="draft.description" class="control textarea" :class="inputClass" />
        </label>
      </section>

      <!-- CREDITS -->
      <section class="section">
        <h3 class="section-title">Credits</h3>

        <div
          v-for="(c, i) in draft.credits"
          :key="i"
          class="credit-row"
        >
          <label class="field compact">
            <span class="label">Role</span>
            <input v-model="c.role" class="control" :class="inputClass" />
          </label>

          <label class="field compact">
            <span class="label">Name</span>
            <input v-model="c.name" class="control" :class="inputClass" />
          </label>

          <button
            class="text-xl leading-none opacity-30 hover:opacity-100 transition"
            @click="draft.credits.splice(i, 1)"
            aria-label="Remove credit"
          >
            ×
          </button>
        </div>

        <button
          class="mt-4 text-sm uppercase tracking-widest opacity-60 hover:opacity-100 transition"
          @click="draft.credits.push({ role: '', name: '' })"
        >
          Add credit
        </button>
      </section>

      <!-- THUMBNAIL -->
      <section class="section">
        <h3 class="section-title">Thumbnail</h3>

        <label class="field">
          <span class="label">Thumbnail file</span>
          <input type="file" accept="image/*" class="file" @change="onThumbnailSelected" />
        </label>

        <div v-if="thumbnailPreview" class="relative w-56 mt-2">
          <img :src="thumbnailPreview" class="w-full object-cover" />

          <button
            class="absolute top-2 right-2 text-xs opacity-60 hover:opacity-100"
            @click="removeThumbnail"
            aria-label="Remove thumbnail"
          >
            ×
          </button>
        </div>
      </section>

      <!-- STILLS -->
      <section class="section">
        <h3 class="section-title">Stills</h3>

        <label class="field">
          <span class="label">Add stills</span>
          <input type="file" accept="image/*" multiple class="file" @change="onStillsSelected" />
        </label>

        <div
          ref="galleryEl"
          class="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2"
        >
          <div
            v-for="(img, i) in displayedGallery"
            :key="img.url + i"
            class="relative"
            :class="img.pending ? 'opacity-40' : 'cursor-move'"
          >
            <img :src="img.url" class="w-full aspect-square object-cover" />

            <button
              class="absolute top-2 right-2 text-xs opacity-50 hover:opacity-100"
              @click="removeImage(i, img)"
              aria-label="Remove still"
            >
              ×
            </button>
          </div>
        </div>
      </section>

      <!-- SAVE -->
      <button
        class="mt-16 text-sm uppercase tracking-widest opacity-60 hover:opacity-100 transition"
        @click="save"
      >
        Save music video
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import Sortable from 'sortablejs'
import { useTheme } from '@/composables/useTheme'
import { useMusicVideos } from '@/composables/useMusicVideos'
import { useDialog } from '@/composables/useDialog'
import { useToast } from '@/composables/useToast'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import Toast from '@/components/ui/Toast.vue'

const { isLight } = useTheme()
const { musicVideos, addMusicVideo, updateMusicVideo, removeMusicVideo, init } =
  useMusicVideos()

init()

const dialog = useDialog()
const { toasts, toast, dismiss: dismissToast } = useToast()

const inputClass = computed(() =>
  isLight.value
    ? 'border-black/20 focus:border-black text-black'
    : 'border-white/20 focus:border-white text-white'
)

const API_BASE = import.meta.env.VITE_API_BASE_URL
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN

const mode = ref('list')
const isNew = ref(false)
const draft = ref({})

/* ---------------- STAGED ---------------- */

const pendingThumbnail = ref(null)
const pendingStills = ref([])

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
  if (pendingThumbnail.value)
    URL.revokeObjectURL(pendingThumbnail.value.previewUrl)

  pendingStills.value.forEach(p =>
    URL.revokeObjectURL(p.previewUrl)
  )

  pendingThumbnail.value = null
  pendingStills.value = []
}

/* ---------------- CRUD ---------------- */

function createVideo() {
  cleanupPending()

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
  cleanupPending()

  const v = musicVideos.value.find(v => v.slug === slug)
  if (!v) return

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

/* ---------------- DELETE CONFIRM ---------------- */

async function deleteVideoConfirm(slug) {
  const ok = await dialog.openConfirm({
    title: 'Delete music video?',
    message: 'This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    destructive: true
  })

  if (!ok) return

  try {
    await removeMusicVideo(slug)
    toast('Deleted')
  } catch {
    toast('Delete failed', { duration: 2400 })
  }
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
  const file = e.target.files?.[0]
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
  for (const file of Array.from(e.target.files || [])) {
    pendingStills.value.push({
      file,
      previewUrl: URL.createObjectURL(file)
    })
  }
  e.target.value = ''
}

/* ---------------- DELETE IMAGE ---------------- */

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
  try {
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

    toast('Saved')
    mode.value = 'list'
  } catch {
    toast('Save failed', { duration: 2400 })
  }
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
        filter: '.opacity-40',
        onMove(evt) {
          if (evt.dragged?.classList?.contains('opacity-40')) return false
          return true
        },
        onEnd(evt) {
          const moved = draft.value.gallery.splice(evt.oldIndex, 1)[0]
          draft.value.gallery.splice(evt.newIndex, 0, moved)
        }
      })
    })
  }
})

/* ---------------- KEYBOARD ---------------- */

function onKeydown(e) {
  const inEdit = mode.value === 'edit'
  const metaSave =
    (e.metaKey || e.ctrlKey) && (e.key === 's' || e.key === 'S')

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
