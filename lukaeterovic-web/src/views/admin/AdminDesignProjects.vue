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
        <h2 class="text-2xl font-semibold tracking-tight">Design</h2>

        <button
          class="flex items-center gap-2 text-sm uppercase tracking-widest opacity-70 hover:opacity-100 transition"
          @click="createProject"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Add project</span>
        </button>
      </div>

      <div class="divide-y divide-current/10">
        <div
          v-for="p in designProjects"
          :key="p.slug"
          class="flex items-center justify-between py-6"
        >
          <div>
            <div class="font-medium">
              <span v-if="p.client">{{ p.client }} — </span>{{ p.title }}
            </div>
            <div class="text-xs opacity-50 mt-1">
              /{{ p.slug }}
            </div>
          </div>

          <div class="flex gap-8 items-center">
            <button
              class="opacity-40 hover:opacity-100 transition"
              @click="editProject(p.slug)"
              aria-label="Edit"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487a2.1 2.1 0 113 3L8.25 19.1l-4 1 1-4L16.862 4.487z" />
              </svg>
            </button>

            <button
              class="text-xl leading-none opacity-30 hover:opacity-100 transition"
              @click="deleteProjectConfirm(p.slug)"
              aria-label="Delete"
            >
              ×
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
        ← Back
      </button>

      <h2 class="text-2xl font-semibold mb-16 tracking-tight">
        {{ isNew ? 'Add design project' : 'Edit design project' }}
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

      <section class="section">
        <h3 class="section-title">About the project</h3>

        <label class="field">
          <span class="label">Opening text</span>
          <textarea v-model="draft.description" class="control textarea" :class="inputClass" />
        </label>

        <label class="field">
          <span class="label">Middle text (after 2×2 images)</span>
          <textarea v-model="draft.textMiddle" class="control textarea" :class="inputClass" />
        </label>

        <label class="field">
          <span class="label">Closing text (after full-width image)</span>
          <textarea v-model="draft.textFooter" class="control textarea" :class="inputClass" />
        </label>
      </section>

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

      <section class="section">
        <h3 class="section-title">Hero image (detail)</h3>
        <p class="text-xs opacity-50 mb-4">Optional. If empty, the thumbnail is used on the project page.</p>

        <label class="field">
          <span class="label">Hero file</span>
          <input type="file" accept="image/*" class="file" @change="onHeroSelected" />
        </label>

        <div v-if="heroPreview" class="relative w-full max-w-md mt-2">
          <img :src="heroPreview" class="w-full object-cover" />

          <button
            class="absolute top-2 right-2 text-xs opacity-60 hover:opacity-100"
            @click="removeHero"
            aria-label="Remove hero image"
          >
            ×
          </button>
        </div>
      </section>

      <section class="section">
        <h3 class="section-title">Gallery</h3>

        <p class="text-xs opacity-50 mb-4 leading-relaxed">
          Order matters: the first four images appear in a 2×2 grid; the fifth is full-width under “middle text”; any further images form another two-column grid.
        </p>

        <label class="field">
          <span class="label">Add images</span>
          <input type="file" accept="image/*" multiple class="file" @change="onGallerySelected" />
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
              aria-label="Remove image"
            >
              ×
            </button>
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
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import Sortable from 'sortablejs'
import { useTheme } from '@/composables/useTheme'
import { useDesignProjects } from '@/composables/useDesignProjects'
import { useDialog } from '@/composables/useDialog'
import { useToast } from '@/composables/useToast'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import Toast from '@/components/ui/Toast.vue'

const { isLight } = useTheme()
const { designProjects, addDesignProject, updateDesignProject, removeDesignProject, init } =
  useDesignProjects()

init()

const dialog = useDialog()
const { toasts, toast, dismiss: dismissToast } = useToast()

const inputClass = computed(() =>
  isLight.value
    ? 'border-black/20 focus:border-black text-black'
    : 'border-white/20 focus:border-white text-white'
)

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

const thumbnailPreview = computed(() =>
  pendingThumbnail.value
    ? pendingThumbnail.value.previewUrl
    : draft.value.thumbnail || null
)

const heroPreview = computed(() =>
  pendingHero.value
    ? pendingHero.value.previewUrl
    : draft.value.heroImage || null
)

const displayedGallery = computed(() => [
  ...(draft.value.gallery || []).map(url => ({ url, pending: false })),
  ...pendingGallery.value.map(p => ({ url: p.previewUrl, pending: true }))
])

function cleanupPending() {
  if (pendingThumbnail.value)
    URL.revokeObjectURL(pendingThumbnail.value.previewUrl)
  if (pendingHero.value)
    URL.revokeObjectURL(pendingHero.value.previewUrl)

  pendingGallery.value.forEach(p =>
    URL.revokeObjectURL(p.previewUrl)
  )

  pendingThumbnail.value = null
  pendingHero.value = null
  pendingGallery.value = []
}

function createProject() {
  cleanupPending()

  draft.value = {
    client: '',
    title: '',
    slug: '',
    year: '',
    description: '',
    textMiddle: '',
    textFooter: '',
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

  const p = designProjects.value.find(x => x.slug === slug)
  if (!p) return

  draft.value = {
    ...JSON.parse(JSON.stringify(p)),
    textMiddle: p.textMiddle ?? '',
    textFooter: p.textFooter ?? '',
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
    title: 'Delete design project?',
    message: 'This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    destructive: true
  })

  if (!ok) return

  try {
    await removeDesignProject(slug)
    toast('Deleted')
  } catch {
    toast('Delete failed', { duration: 2400 })
  }
}

async function uploadFile(file) {
  const form = new FormData()
  form.append('file', file)
  form.append('section', 'design-projects')
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

  if (pendingThumbnail.value)
    URL.revokeObjectURL(pendingThumbnail.value.previewUrl)

  pendingThumbnail.value = {
    file,
    previewUrl: URL.createObjectURL(file)
  }

  e.target.value = ''
}

function onHeroSelected(e) {
  const file = e.target.files?.[0]
  if (!file) return

  if (pendingHero.value)
    URL.revokeObjectURL(pendingHero.value.previewUrl)

  pendingHero.value = {
    file,
    previewUrl: URL.createObjectURL(file)
  }

  e.target.value = ''
}

function onGallerySelected(e) {
  for (const file of Array.from(e.target.files || [])) {
    pendingGallery.value.push({
      file,
      previewUrl: URL.createObjectURL(file)
    })
  }
  e.target.value = ''
}

async function removeImage(index, img) {
  if (img.pending) {
    pendingGallery.value.splice(
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

function removeHero() {
  if (pendingHero.value) pendingHero.value = null
  else draft.value.heroImage = null
}

async function save() {
  try {
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
      year: draft.value.year,
      thumbnail: draft.value.thumbnail,
      hero_image: draft.value.heroImage,
      description: draft.value.description,
      text_middle: draft.value.textMiddle,
      text_footer: draft.value.textFooter,
      credits: draft.value.credits,
      gallery: draft.value.gallery
    }

    if (isNew.value) await addDesignProject(payload)
    else await updateDesignProject(draft.value.slug, payload)

    toast('Saved')
    mode.value = 'list'
  } catch {
    toast('Save failed', { duration: 2400 })
  }
}

const galleryEl = ref(null)
let sortable = null

watch(() => mode.value, v => {
  if (v === 'edit') {
    setTimeout(() => {
      if (sortable) {
        sortable.destroy()
        sortable = null
      }

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
  } else if (sortable) {
    sortable.destroy()
    sortable = null
  }
})

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
