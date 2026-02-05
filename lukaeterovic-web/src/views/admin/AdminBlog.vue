<!-- src/views/admin/AdminBlog.vue -->
<template>
  <section>
    <!-- LIST -->
    <div v-if="mode === 'list'">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-2xl font-semibold">Blog</h2>
        <button
          class="px-4 py-2 border rounded"
          :class="btnClass"
          @click="createPost"
        >
          + Add post
        </button>
      </div>

      <div class="border rounded divide-y">
        <div
          v-for="p in posts"
          :key="p.slug"
          class="flex items-center justify-between px-4 py-3"
        >
          <div>
            <div class="font-semibold">{{ p.title }}</div>
            <div class="text-sm opacity-60">
              /blog/{{ p.slug }}
              <span v-if="!p.published" class="ml-2 text-xs opacity-50">
                (draft)
              </span>
            </div>
          </div>

          <div class="flex gap-4">
            <button @click="editPost(p.slug)">✏️</button>
            <button @click="deletePostConfirm(p.slug)">❌</button>
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
        {{ isNew ? 'Add post' : 'Edit post' }}
      </h2>

      <!-- BASIC -->
      <section class="section">
        <h3 class="section-title">Basic</h3>

        <label class="field">
          <span class="label">Title</span>
          <input v-model="draft.title" class="input" :class="inputClass" />
        </label>

        <label class="field">
          <span class="label">Slug</span>
          <input
            v-model="draft.slug"
            class="input"
            :class="inputClass"
            :disabled="!isNew"
          />
        </label>

        <label class="field">
          <span class="label">Excerpt</span>
          <textarea v-model="draft.excerpt" class="input" :class="inputClass" />
        </label>
      </section>

      <!-- CONTENT -->
      <section class="section">
        <h3 class="section-title">Content</h3>
        <textarea
          v-model="draft.content"
          class="input"
          :class="inputClass"
          rows="14"
          placeholder="Markdown or HTML"
        />
      </section>

      <!-- COVER -->
      <section class="section">
        <h3 class="section-title">Cover image</h3>

        <input type="file" accept="image/*" @change="onCoverSelected" />

        <div v-if="coverPreview" class="mt-4 relative w-64">
          <img :src="coverPreview" class="rounded" />
          <button
            class="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded"
            @click="removeCover"
          >
            ✕
          </button>
        </div>
      </section>

      <!-- PUBLISH -->
      <section class="section">
        <label class="flex items-center gap-3">
          <input type="checkbox" v-model="draft.published" />
          <span>Published</span>
        </label>
      </section>

      <div class="mt-10">
        <button class="px-6 py-3 border rounded" :class="btnClass" @click="save">
          Save post
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useTheme } from '@/composables/useTheme'

/* ---------------- THEME ---------------- */

const { isLight } = useTheme()

const btnClass = computed(() =>
  isLight.value ? 'border-black text-black' : 'border-white text-white'
)

const inputClass = computed(() =>
  isLight.value
    ? 'bg-white text-black border border-black/30'
    : 'bg-black text-white border border-white/30'
)

/* ---------------- STATE ---------------- */

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

/* ---------------- SLUG ---------------- */

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

const pendingCover = ref(null) // { file, previewUrl }

const coverPreview = computed(() =>
  pendingCover.value ? pendingCover.value.previewUrl : draft.value.cover_image
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
  const post = posts.value.find(p => p.slug === slug)

  draft.value = JSON.parse(JSON.stringify(post))
  originalSlug.value = post.slug

  slugTouched.value = true
  isNew.value = false
  mode.value = 'edit'
}

function cancelEdit() {
  cleanupPending()
  mode.value = 'list'
}

function deletePostConfirm(slug) {
  if (!confirm('Delete post?')) return

  fetch(`${API_BASE}/blog/${slug}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
  }).then(fetchPosts)
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
  const file = e.target.files[0]
  if (!file) return

  if (pendingCover.value) {
    URL.revokeObjectURL(pendingCover.value.previewUrl)
  }

  pendingCover.value = {
    file,
    previewUrl: URL.createObjectURL(file)
  }

  e.target.value = ''
}

function removeCover() {
  if (pendingCover.value) {
    cleanupPending()
  } else {
    draft.value.cover_image = null
  }
}

/* ---------------- SAVE ---------------- */

async function save() {
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
    body: JSON.stringify(draft.value)
  })

  await fetchPosts()
  mode.value = 'list'
}
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
  resize: vertical;
}
</style>
