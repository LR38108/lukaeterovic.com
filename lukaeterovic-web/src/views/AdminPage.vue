<!-- src/views/AdminPage.vue -->
<template>
  <div :class="themeClass" class="min-h-screen pt-20 pb-12 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">

      <!-- SIDEBAR -->
      <aside class="border-b lg:border-b-0 lg:border-r pb-4 lg:pb-0 lg:pr-6">
        <h1 class="text-xl font-bold mb-6">Admin</h1>

        <button
          class="block w-full text-left px-3 py-2 rounded font-semibold"
          :class="isLight ? 'bg-black/10' : 'bg-white/10'"
        >
          Films
        </button>
      </aside>

      <!-- MAIN -->
      <main>
        <!-- LOGIN -->
        <section v-if="!authed" class="max-w-md border rounded p-6">
          <h2 class="text-xl font-semibold mb-4">Login</h2>

          <label class="field">
            <span class="label">Passcode</span>
            <input
              v-model="passcode"
              type="password"
              class="input"
              :class="inputClass"
              @keydown.enter="login"
            />
          </label>

          <button class="px-5 py-2 border rounded" :class="btnClass" @click="login">
            Unlock
          </button>

          <p v-if="error" class="text-red-500 mt-3">{{ error }}</p>
        </section>

        <!-- FILMS -->
        <section v-else>
          <!-- LIST -->
          <div v-if="mode === 'list'">
            <div class="flex justify-between items-center mb-8">
              <h2 class="text-2xl font-semibold">Films</h2>
              <button class="px-4 py-2 border rounded" :class="btnClass" @click="createFilm">
                + Add film
              </button>
            </div>

            <div class="border rounded divide-y">
              <div
                v-for="f in films"
                :key="f.slug"
                class="flex items-center justify-between px-4 py-3"
              >
                <div>
                  <div class="font-semibold">{{ f.title }}</div>
                  <div class="text-sm opacity-60">/{{ f.slug }}</div>
                </div>
                <div class="flex gap-4">
                  <button @click="editFilm(f.slug)">✏️</button>
                  <button @click="deleteFilm(f.slug)">❌</button>
                </div>
              </div>
            </div>
          </div>

          <!-- EDITOR -->
          <div v-else class="max-w-3xl">
            <button class="mb-6 opacity-70" @click="mode = 'list'">
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
                <input v-model="draft.slug" class="input" :class="inputClass" />
              </label>

              <label class="field">
                <span class="label">Tagline</span>
                <input v-model="draft.tagline" class="input" :class="inputClass" />
              </label>

              <label class="field">
                <span class="label">Description</span>
                <textarea v-model="draft.description" class="input" :class="inputClass" />
              </label>

              <label class="field">
                <span class="label">Poster path</span>
                <input v-model="draft.poster" class="input" :class="inputClass" />
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

            <!-- CREDITS -->
            <section class="section">
              <h3 class="section-title">Credits</h3>

              <div
                v-for="(c, i) in draft.credits"
                :key="i"
                class="flex gap-3 mb-3"
              >
                <input v-model="c.role" class="input" :class="inputClass" placeholder="Role" />
                <input v-model="c.name" class="input" :class="inputClass" placeholder="Name" />
                <button @click="draft.credits.splice(i,1)">❌</button>
              </div>

              <button @click="draft.credits.push({ role:'', name:'' })">
                + Add credit
              </button>
            </section>

            <!-- GALLERY -->
            <section class="section">
              <h3 class="section-title">Gallery</h3>

              <input
                type="file"
                accept="image/*"
                multiple
                class="mb-4"
                @change="onFilesSelected"
              />

              <p class="text-xs opacity-60 mb-4">
                Drag images to reorder. Uploads go to Cloudflare R2.
              </p>

              <div
                ref="galleryEl"
                class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
              >
                <div
                  v-for="(img, i) in draft.gallery"
                  :key="img + i"
                  class="border rounded overflow-hidden relative cursor-move"
                >
                  <img
                    :src="img"
                    class="w-full aspect-square object-cover bg-black/5"
                  />

                  <button
                    @click="async () => {
                      await deleteImage(img)
                      draft.gallery.splice(i, 1)
                    }"
                    class="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded"
                  >
                    ✕
                  </button>

                  <div class="px-2 py-1 text-xs truncate">
                    {{ img.split('/').pop() }}
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
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { useFilms } from '@/composables/useFilms'
import Sortable from 'sortablejs'

const mode = ref('list')
const { isLight } = useTheme()
const themeClass = computed(() => (isLight.value ? 'bg-white text-black' : 'bg-black text-white'))
const btnClass = computed(() => (isLight.value ? 'border-black text-black' : 'border-white text-white'))
const inputClass = computed(() =>
  isLight.value
    ? 'bg-white text-black border border-black/30'
    : 'bg-black text-white border border-white/30'
)

const API_BASE = 'https://lukaeterovic-api.radan-luka.workers.dev'
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN

async function deleteImage(url) {
  await fetch(`${API_BASE}/media`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ADMIN_TOKEN}`
    },
    body: JSON.stringify({ url })
  })
}

const galleryEl = ref(null)
let sortableInstance = null

function initSortable() {
  if (!galleryEl.value) return

  if (sortableInstance) {
    sortableInstance.destroy()
  }

  sortableInstance = Sortable.create(galleryEl.value, {
    animation: 150,
    ghostClass: 'opacity-40',
    dragClass: 'opacity-80',
    onEnd(evt) {
      const moved = draft.value.gallery.splice(evt.oldIndex, 1)[0]
      draft.value.gallery.splice(evt.newIndex, 0, moved)
    }
  })
}

watch(
  () => mode.value,
  (val) => {
    if (val === 'edit') {
      // wait for DOM to render gallery
      setTimeout(initSortable)
    }
  }
)

const ADMIN_KEY = 'admin_auth'
const PASS = 'admin'

const authed = ref(localStorage.getItem(ADMIN_KEY) === '1')
const passcode = ref('')
const error = ref('')

function login() {
  if (passcode.value === PASS) {
    authed.value = true
    localStorage.setItem(ADMIN_KEY, '1')
  } else {
    error.value = 'Wrong passcode'
  }
}

const dragIndex = ref(null)

function onDragStart(index) {
  dragIndex.value = index
}

function onDrop(dropIndex) {
  if (dragIndex.value === null || dragIndex.value === dropIndex) return

  const item = draft.value.gallery.splice(dragIndex.value, 1)[0]
  draft.value.gallery.splice(dropIndex, 0, item)

  dragIndex.value = null
}

const { films, updateFilm, removeFilm } = useFilms()

async function onFilesSelected(e) {
  const files = Array.from(e.target.files)

  for (const file of files) {
    const form = new FormData()
    form.append('file', file)
    form.append('slug', draft.value.slug)

    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/upload`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_ADMIN_TOKEN}`
        },
        body: form
      }
    )

    if (!res.ok) {
      alert('Upload failed')
      continue
    }

    const data = await res.json()
    draft.value.gallery.push(data.url)
  }

  e.target.value = ''
}

const isNew = ref(false)
const draft = ref({})

function createFilm() {
  draft.value = {
    title:'', slug:'', year:'', duration:'', type:'', genres:'',
    tagline:'', description:'', poster:'',
    originalTitle:'', language:'', runtime:'', releaseYear:'',
    genreFull:'', format:'',
    plotSummary:'', aboutProject:'',
    credits:[], gallery:[], watchUrl:''
  }
  isNew.value = true
  mode.value = 'edit'
}

function editFilm(slug) {
  draft.value = JSON.parse(JSON.stringify(films.value.find(f => f.slug === slug)))
  isNew.value = false
  mode.value = 'edit'
}

function deleteFilm(slug) {
  if (confirm('Delete film?')) removeFilm(slug)
}

function save() {
  updateFilm(draft.value.slug, {
    ...draft.value,
    tech: {
      runtime: draft.value.runtime,
      year: draft.value.releaseYear,
      originalTitle: draft.value.originalTitle,
      genre: draft.value.genreFull,
      type: draft.value.type,
      language: draft.value.language
    }
  })
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
  min-height: 120px;
  resize: vertical;
}
</style>