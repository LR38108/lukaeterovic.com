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

    <div v-if="mode === 'list'">
      <div class="flex justify-between items-center mb-12">
        <h2 class="text-2xl font-semibold tracking-tight">Commercial &amp; Promo</h2>

        <button
          class="flex items-center gap-2 text-sm uppercase tracking-widest opacity-70 hover:opacity-100 transition"
          @click="createProject"
        >
          <span class="text-lg leading-none">+</span>
          <span>Add project</span>
        </button>
      </div>

      <div class="divide-y divide-current/10">
        <div
          v-for="p in commercialProjects"
          :key="p.slug || p.publicSlug"
          class="flex items-center justify-between py-6"
        >
          <div>
            <div class="font-medium">
              <span v-if="p.client">{{ p.client }} - </span>{{ p.title }}
            </div>
            <div class="text-xs opacity-50 mt-1">
              /{{ p.publicSlug || p.slug }}
            </div>
          </div>

          <div class="flex gap-8 items-center">
            <button
              class="opacity-40 hover:opacity-100 transition"
              @click="editProject(p.slug)"
              aria-label="Edit"
            >
              Edit
            </button>

            <button
              class="text-xl leading-none opacity-30 hover:opacity-100 transition"
              @click="deleteProjectConfirm(p.slug)"
              aria-label="Delete"
            >
              x
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="max-w-3xl">
      <button
        class="mb-12 text-sm opacity-50 hover:opacity-100 transition"
        @click="cancelEdit"
      >
        Back
      </button>

      <h2 class="text-2xl font-semibold mb-16 tracking-tight">
        {{ isNew ? 'Add commercial project' : 'Edit commercial project' }}
      </h2>

      <section class="section">
        <h3 class="section-title">Basic</h3>

        <label class="field">
          <span class="label">Client</span>
          <input v-model="draft.client" class="control" :class="inputClass" />
        </label>

        <label class="field">
          <span class="label">Title</span>
          <input v-model="draft.title" class="control" :class="inputClass" />
        </label>

        <label class="field">
          <span class="label">Slug</span>
          <input v-model="draft.slug" class="control" :class="inputClass" />
        </label>

        <label class="field">
          <span class="label">Subtitle</span>
          <input v-model="draft.subtitle" class="control" :class="inputClass" />
        </label>
      </section>

      <section class="section">
        <h3 class="section-title">About</h3>
        <label class="field">
          <span class="label">About text</span>
          <textarea v-model="draft.about" class="control textarea" :class="inputClass" />
        </label>
      </section>

      <section class="section">
        <h3 class="section-title">Credits</h3>

        <div
          v-for="(c, i) in draft.credits"
          :key="i"
          class="grid grid-cols-[1fr_1fr_auto] gap-4 mb-4"
        >
          <input v-model="c.role" class="control" :class="inputClass" placeholder="Role" />
          <input v-model="c.name" class="control" :class="inputClass" placeholder="Name" />
          <button class="opacity-40 hover:opacity-100" @click="draft.credits.splice(i, 1)">x</button>
        </div>

        <button
          class="mt-4 text-sm uppercase tracking-widest opacity-60 hover:opacity-100 transition"
          @click="draft.credits.push({ role: '', name: '' })"
        >
          Add credit
        </button>
      </section>

      <section class="section">
        <h3 class="section-title">Thumbnail</h3>

        <label class="field">
          <span class="label">Thumbnail file</span>
          <input type="file" accept="image/*" class="file" @change="onThumbnailSelected" />
        </label>

        <div v-if="thumbnailPreview" class="relative w-56 mt-2">
          <img :src="thumbnailPreview" class="w-full object-cover" />
          <button class="absolute top-2 right-2 text-xs opacity-60 hover:opacity-100" @click="removeThumbnail">x</button>
        </div>
      </section>

      <section class="section">
        <h3 class="section-title">Hero image (detail)</h3>
        <p class="text-xs opacity-50 mb-4">Optional. If empty, the thumbnail is used on the project page.</p>

        <label class="field">
          <span class="label">Hero file</span>
          <input type="file" accept="image/*" class="file" @change="onHeroSelected" />
        </label>

        <div v-if="heroPreview" class="relative w-full max-w-md mt-2">
          <img :src="heroPreview" class="w-full object-cover" />
          <button class="absolute top-2 right-2 text-xs opacity-60 hover:opacity-100" @click="removeHero">x</button>
        </div>
      </section>

      <section class="section">
        <h3 class="section-title">Gallery</h3>
        <p class="text-xs opacity-50 mb-4 leading-relaxed">
          First four images appear in a 2x2 grid; the fifth is full-width; any further images form another grid.
        </p>

        <label class="field">
          <span class="label">Add images</span>
          <input type="file" accept="image/*" multiple class="file" @change="onGallerySelected" />
        </label>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
          <div
            v-for="(img, i) in displayedGallery"
            :key="img.url + i"
            class="relative"
            :class="img.pending ? 'opacity-40' : ''"
          >
            <img :src="img.url" class="w-full aspect-square object-cover" />
            <button class="absolute top-2 right-2 text-xs opacity-50 hover:opacity-100" @click="removeImage(i, img)">x</button>
          </div>
        </div>
      </section>

      <button
        class="mt-16 text-sm uppercase tracking-widest opacity-60 hover:opacity-100 transition"
        @click="save"
      >
        Save project
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { useCommercialProjects } from '@/composables/useCommercialProjects'
import { useDialog } from '@/composables/useDialog'
import { useToast } from '@/composables/useToast'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import Toast from '@/components/ui/Toast.vue'

const { isLight } = useTheme()
const {
  commercialProjects,
  addCommercialProject,
  updateCommercialProject,
  removeCommercialProject,
  init
} = useCommercialProjects()

init()

const dialog = useDialog()
const { toasts, toast, dismiss: dismissToast } = useToast()

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  'https://lukaeterovic-api.radan-luka.workers.dev'
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN

const mode = ref('list')
const isNew = ref(false)
const draft = ref({})
const pendingThumbnail = ref(null)
const pendingHero = ref(null)
const pendingGallery = ref([])

const inputClass = computed(() =>
  isLight.value
    ? 'border-black/20 focus:border-black text-black'
    : 'border-white/20 focus:border-white text-white'
)

const thumbnailPreview = computed(() =>
  pendingThumbnail.value ? pendingThumbnail.value.previewUrl : draft.value.thumbnail || null
)

const heroPreview = computed(() =>
  pendingHero.value ? pendingHero.value.previewUrl : draft.value.heroImage || null
)

const displayedGallery = computed(() => [
  ...(draft.value.gallery || []).map(url => ({ url, pending: false })),
  ...pendingGallery.value.map(p => ({ url: p.previewUrl, pending: true }))
])

function createProject() {
  cleanupPending()
  draft.value = {
    client: '',
    title: '',
    slug: '',
    subtitle: '',
    about: '',
    thumbnail: null,
    heroImage: null,
    gallery: [],
    credits: []
  }
  isNew.value = true
  mode.value = 'edit'
}

function editProject(slug) {
  cleanupPending()
  const p = commercialProjects.value.find(x => x.slug === slug)
  if (!p) return

  draft.value = {
    ...JSON.parse(JSON.stringify(p)),
    originalSlug: p.slug,
    subtitle: p.subtitle ?? '',
    about: p.about ?? '',
    gallery: (p.gallery || []).map(img =>
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

async function deleteProjectConfirm(slug) {
  const ok = await dialog.openConfirm({
    title: 'Delete commercial project?',
    message: 'This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    destructive: true
  })

  if (!ok) return

  try {
    await removeCommercialProject(slug)
    toast('Deleted')
  } catch {
    toast('Delete failed', { duration: 2400 })
  }
}

async function uploadFile(file) {
  const form = new FormData()
  form.append('file', file)
  form.append('section', 'commercial-projects')
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

function onThumbnailSelected(e) {
  const file = e.target.files?.[0]
  if (!file) return
  if (pendingThumbnail.value) URL.revokeObjectURL(pendingThumbnail.value.previewUrl)
  pendingThumbnail.value = { file, previewUrl: URL.createObjectURL(file) }
  e.target.value = ''
}

function onHeroSelected(e) {
  const file = e.target.files?.[0]
  if (!file) return
  if (pendingHero.value) URL.revokeObjectURL(pendingHero.value.previewUrl)
  pendingHero.value = { file, previewUrl: URL.createObjectURL(file) }
  e.target.value = ''
}

function onGallerySelected(e) {
  for (const file of Array.from(e.target.files || [])) {
    pendingGallery.value.push({ file, previewUrl: URL.createObjectURL(file) })
  }
  e.target.value = ''
}

async function removeImage(index, img) {
  if (img.pending) {
    pendingGallery.value.splice(index - (draft.value.gallery?.length || 0), 1)
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

function removeHero() {
  if (pendingHero.value) pendingHero.value = null
  else draft.value.heroImage = null
}

async function save() {
  try {
    draft.value.slug = slugify(draft.value.slug || draft.value.title)
    if (!draft.value.slug) throw new Error('Missing slug')

    if (pendingThumbnail.value) {
      draft.value.thumbnail = await uploadFile(pendingThumbnail.value.file)
    }

    if (pendingHero.value) {
      draft.value.heroImage = await uploadFile(pendingHero.value.file)
    }

    if (pendingGallery.value.length) {
      for (const p of pendingGallery.value) {
        draft.value.gallery.push(await uploadFile(p.file))
      }
    }

    cleanupPending()

    const payload = {
      client: draft.value.client,
      title: draft.value.title,
      slug: draft.value.slug,
      subtitle: draft.value.subtitle,
      thumbnail: draft.value.thumbnail,
      hero_image: draft.value.heroImage,
      about: draft.value.about,
      credits: draft.value.credits,
      gallery: draft.value.gallery
    }

    if (isNew.value) await addCommercialProject(payload)
    else await updateCommercialProject(draft.value.originalSlug ?? draft.value.slug, payload)

    toast('Saved')
    mode.value = 'list'
  } catch {
    toast('Save failed', { duration: 2400 })
  }
}

function cleanupPending() {
  if (pendingThumbnail.value) URL.revokeObjectURL(pendingThumbnail.value.previewUrl)
  if (pendingHero.value) URL.revokeObjectURL(pendingHero.value.previewUrl)
  pendingGallery.value.forEach(p => URL.revokeObjectURL(p.previewUrl))
  pendingThumbnail.value = null
  pendingHero.value = null
  pendingGallery.value = []
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

onBeforeUnmount(cleanupPending)
</script>

<style scoped>
.section {
  margin-bottom: 3rem;
}

.section-title {
  margin-bottom: 1.25rem;
  font-size: 0.75rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.55;
}

.field {
  display: block;
  margin-bottom: 1.5rem;
}

.label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.55;
}

.control {
  width: 100%;
  border-bottom-width: 1px;
  background: transparent;
  padding: 0.75rem 0;
  outline: none;
}

.textarea {
  min-height: 8rem;
  resize: vertical;
}

.file {
  display: block;
  width: 100%;
  font-size: 0.875rem;
}
</style>
