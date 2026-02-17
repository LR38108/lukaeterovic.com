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
        <h2 class="text-2xl font-semibold tracking-tight">Galleries</h2>

        <button
          class="flex items-center gap-2 text-sm uppercase tracking-widest opacity-70 hover:opacity-100 transition"
          @click="createGallery"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Add gallery</span>
        </button>
      </div>

      <div class="divide-y divide-current/10">
        <div v-for="g in galleries" :key="g.slug" class="flex items-center justify-between py-6">
          <div>
            <div class="font-medium">{{ g.title }}</div>
            <div class="text-xs opacity-50 mt-1">/{{ g.slug }}</div>
          </div>

          <div class="flex gap-8 items-center">
            <button class="opacity-40 hover:opacity-100 transition" @click="editGallery(g.slug)" aria-label="Edit">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487a2.1 2.1 0 113 3L8.25 19.1l-4 1 1-4L16.862 4.487z" />
              </svg>
            </button>

            <button class="text-xl leading-none opacity-30 hover:opacity-100 transition" @click="deleteGalleryConfirm(g.slug)" aria-label="Delete">
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
        {{ isNew ? 'Add gallery' : 'Edit gallery' }}
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
          <input
            v-model="draft.slug"
            class="control"
            :class="[inputClass, !isNew ? 'opacity-40 cursor-not-allowed' : '']"
            :disabled="!isNew"
          />
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

      <!-- META -->
      <section class="section">
        <h3 class="section-title">Metadata</h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-12">
          <label class="field">
            <span class="label">Year</span>
            <input v-model="draft.year" class="control" :class="inputClass" />
          </label>

          <label class="field">
            <span class="label">Location</span>
            <input v-model="draft.location" class="control" :class="inputClass" />
          </label>
        </div>
      </section>

      <!-- COVER -->
      <section class="section">
        <h3 class="section-title">Cover</h3>

        <label class="field">
          <span class="label">Cover image file</span>
          <input type="file" accept="image/*" class="file" @change="onCoverSelected" />
        </label>

        <div v-if="coverPreview" class="relative w-40 mt-2">
          <img :src="coverPreview" class="w-full aspect-square object-cover" />
          <button class="absolute top-2 right-2 text-xs opacity-60 hover:opacity-100" @click="removeCover" aria-label="Remove cover">
            ×
          </button>
        </div>
      </section>

      <!-- IMAGES -->
      <section class="section">
        <h3 class="section-title">Images</h3>

        <label class="field">
          <span class="label">Add images</span>
          <input type="file" accept="image/*" multiple class="file" @change="onFilesSelected" />
        </label>

        <div ref="galleryEl" class="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
          <div v-for="(img, i) in displayedImages" :key="img.url + i" class="relative" :class="img.pending ? 'opacity-40' : 'cursor-move'">
            <img :src="img.url" class="w-full aspect-square object-cover" />

            <button class="absolute top-2 right-2 text-xs opacity-50 hover:opacity-100" @click="removeImage(i, img)" aria-label="Remove image">
              ×
            </button>
          </div>
        </div>
      </section>

      <!-- SAVE -->
      <button class="mt-16 text-sm uppercase tracking-widest opacity-60 hover:opacity-100 transition" @click="save">
        Save gallery
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import Sortable from 'sortablejs'
import { useTheme } from '@/composables/useTheme'
import { useGalleries } from '@/composables/useGalleries'
import { useDialog } from '@/composables/useDialog'
import { useToast } from '@/composables/useToast'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import Toast from '@/components/ui/Toast.vue'

const { isLight } = useTheme()
const { galleries, addGallery, updateGallery, removeGallery, init } = useGalleries()
onMounted(init)

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
const originalSlug = ref(null)

/* SLUG */
function slugify(input) {
  return String(input || '')
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

watch(() => draft.value.title, (title) => {
  if (isNew.value) draft.value.slug = slugify(title)
})

/* STAGED */
const pendingImages = ref([])
const pendingCover = ref(null)

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

/* CRUD */
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

/* DELETE CONFIRM */
async function deleteGalleryConfirm(slug) {
  const ok = await dialog.openConfirm({
    title: 'Delete gallery?',
    message: 'This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    destructive: true
  })

  if (!ok) return

  try {
    await removeGallery(slug)
    toast('Deleted')
  } catch {
    toast('Delete failed', { duration: 2400 })
  }
}

/* UPLOAD */
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

/* FILE SELECT */
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

/* DELETE IMAGE */
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
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ADMIN_TOKEN}` },
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

/* SAVE */
async function save() {
  try {
    if (!draft.value.slug) {
      toast('Slug is required', { duration: 2400 })
      return
    }

    if (pendingCover.value) {
      const uploaded = await uploadFile(pendingCover.value.file)
      draft.value.coverImage = uploaded.url
    }

    if (pendingImages.value.length) {
      const uploaded = []
      for (const p of pendingImages.value) uploaded.push(await uploadFile(p.file))
      draft.value.images.push(...uploaded)
    }

    cleanupPending()

    if (isNew.value) await addGallery(draft.value)
    else await updateGallery(originalSlug.value, draft.value)

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
      const savedCount = (draft.value.images || []).length
      if (evt.oldIndex >= savedCount || evt.newIndex >= savedCount) return

      const moved = draft.value.images.splice(evt.oldIndex, 1)[0]
      draft.value.images.splice(evt.newIndex, 0, moved)
    }
  })
}

watch(() => mode.value, v => v === 'edit' && setTimeout(initSortable))

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
</style>
