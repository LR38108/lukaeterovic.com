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
        <h2 class="text-2xl font-semibold tracking-tight">Blog</h2>

        <button
          class="flex items-center gap-2 text-sm uppercase tracking-widest opacity-70 hover:opacity-100 transition"
          @click="createPost"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Add post</span>
        </button>
      </div>

      <div class="divide-y divide-current/10">
        <div
          v-for="p in posts"
          :key="p.slug"
          class="flex items-center justify-between py-6"
        >
          <div>
            <div class="font-medium">
              {{ p.title }}
            </div>
            <div class="text-xs opacity-50 mt-1">
              /blog/{{ p.slug }}
              <span v-if="!p.published" class="ml-2 opacity-40">(draft)</span>
            </div>
          </div>

          <div class="flex gap-8 items-center">
            <button
              class="opacity-40 hover:opacity-100 transition"
              @click="editPost(p.slug)"
              aria-label="Edit"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487a2.1 2.1 0 113 3L8.25 19.1l-4 1 1-4L16.862 4.487z" />
              </svg>
            </button>

            <button
              class="text-xl leading-none opacity-30 hover:opacity-100 transition"
              @click="deletePostConfirm(p.slug)"
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
        {{ isNew ? 'Add post' : 'Edit post' }}
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
          <span class="label">Excerpt</span>
          <textarea v-model="draft.excerpt" class="control textarea" :class="inputClass" />
        </label>
      </section>

      <!-- CONTENT -->
      <section class="section">
        <h3 class="section-title">Content</h3>

        <label class="field">
          <span class="label">Markdown / HTML</span>
          <textarea
            v-model="draft.content"
            class="control textarea"
            :class="inputClass"
            rows="14"
          />
        </label>
      </section>

      <!-- COVER -->
      <section class="section">
        <h3 class="section-title">Cover</h3>

        <label class="field">
          <span class="label">Cover image file</span>
          <input type="file" accept="image/*" class="file" @change="onCoverSelected" />
        </label>

        <div v-if="coverPreview" class="relative w-56 mt-2">
          <img :src="coverPreview" class="w-full object-cover" />

          <button
            class="absolute top-2 right-2 text-xs opacity-60 hover:opacity-100"
            @click="removeCover"
            aria-label="Remove cover"
          >
            ×
          </button>
        </div>
      </section>

      <!-- PUBLISH -->
      <section class="section">
        <h3 class="section-title">Publish</h3>

        <label class="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" v-model="draft.published" />
          <span class="text-sm uppercase tracking-widest opacity-60">
            Published
          </span>
        </label>
      </section>

      <!-- SAVE -->
      <button
        class="mt-16 text-sm uppercase tracking-widest opacity-60 hover:opacity-100 transition"
        @click="save"
      >
        Save post
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { useDialog } from '@/composables/useDialog'
import { useToast } from '@/composables/useToast'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import Toast from '@/components/ui/Toast.vue'

const { isLight } = useTheme()
const dialog = useDialog()
const { toasts, toast, dismiss: dismissToast } = useToast()

const inputClass = computed(() =>
  isLight.value
    ? 'border-black/20 focus:border-black text-black'
    : 'border-white/20 focus:border-white text-white'
)

const API_BASE = import.meta.env.VITE_API_BASE_URL
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN

const posts = ref([])
const mode = ref('list')
const isNew = ref(false)
const draft = ref({})
const slugTouched = ref(false)
const originalSlug = ref(null)

/* ---------------- FETCH ---------------- */

async function fetchPosts() {
  const res = await fetch(`${API_BASE}/blog`)
  posts.value = res.ok ? await res.json() : []
}

onMounted(fetchPosts)

/* ---------------- SLUG AUTO ---------------- */

function slugify(input) {
  return String(input || '')
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

watch(() => draft.value.title, title => {
  if (!slugTouched.value && isNew.value) {
    draft.value.slug = slugify(title)
  }
})

/* ---------------- STAGED COVER ---------------- */

const pendingCover = ref(null)

const coverPreview = computed(() =>
  pendingCover.value
    ? pendingCover.value.previewUrl
    : draft.value.cover_image
)

function cleanupPending() {
  if (pendingCover.value) {
    URL.revokeObjectURL(pendingCover.value.previewUrl)
  }
  pendingCover.value = null
}

/* ---------------- CRUD ---------------- */

function createPost() {
  slugTouched.value = false
  originalSlug.value = null

  draft.value = {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: null,
    published: false
  }

  isNew.value = true
  mode.value = 'edit'
}

function editPost(slug) {
  const p = posts.value.find(p => p.slug === slug)
  if (!p) return

  draft.value = {
    ...JSON.parse(JSON.stringify(p)),
    published: Boolean(p.published)
  }

  originalSlug.value = p.slug
  slugTouched.value = true
  isNew.value = false
  mode.value = 'edit'
}

function cancelEdit() {
  cleanupPending()
  mode.value = 'list'
}

/* ---------------- DELETE CONFIRM ---------------- */

async function deletePostConfirm(slug) {
  const ok = await dialog.openConfirm({
    title: 'Delete post?',
    message: 'This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    destructive: true
  })

  if (!ok) return

  try {
    await fetch(`${API_BASE}/blog/${slug}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
    })

    toast('Deleted')
    fetchPosts()
  } catch {
    toast('Delete failed', { duration: 2400 })
  }
}

/* ---------------- UPLOAD ---------------- */

async function uploadFile(file) {
  const form = new FormData()
  form.append('file', file)
  form.append('section', 'blog')
  form.append('slug', originalSlug.value || draft.value.slug)

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
    body: form
  })

  const data = await res.json()
  return data.url
}

/* ---------------- FILE SELECT ---------------- */

function onCoverSelected(e) {
  const file = e.target.files?.[0]
  if (!file) return

  if (pendingCover.value)
    URL.revokeObjectURL(pendingCover.value.previewUrl)

  pendingCover.value = {
    file,
    previewUrl: URL.createObjectURL(file)
  }

  e.target.value = ''
}

function removeCover() {
  if (pendingCover.value) cleanupPending()
  else draft.value.cover_image = null
}

/* ---------------- SAVE ---------------- */

async function save() {
  try {
    if (pendingCover.value) {
      draft.value.cover_image = await uploadFile(pendingCover.value.file)
    }

    cleanupPending()

    const method = isNew.value ? 'POST' : 'PUT'
    const url = isNew.value
      ? `${API_BASE}/blog`
      : `${API_BASE}/blog/${originalSlug.value}`

    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ADMIN_TOKEN}`
      },
      body: JSON.stringify({
        ...draft.value,
        published: draft.value.published ? 1 : 0
      })
    })

    toast('Saved')
    fetchPosts()
    mode.value = 'list'
  } catch {
    toast('Save failed', { duration: 2400 })
  }
}

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
