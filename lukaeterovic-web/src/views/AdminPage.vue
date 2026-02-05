<!-- src/views/AdminPage.vue -->
<template>
  <div :class="themeClass" class="min-h-screen pt-20 pb-12">
    <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">

      <!-- SIDEBAR -->
      <aside class="border-b lg:border-b-0 lg:border-r pb-4 lg:pb-0 lg:pr-6">
        <h1 class="text-xl font-bold mb-6">Admin</h1>

        <nav class="space-y-2">
          <RouterLink
            to="/admin/films"
            class="block px-3 py-2 rounded font-semibold"
            :class="linkClass('/admin/films')"
          >
            Films
          </RouterLink>

          <RouterLink
            to="/admin/galleries"
            class="block px-3 py-2 rounded font-semibold"
            :class="linkClass('/admin/galleries')"
          >
            Galleries
          </RouterLink>

          <RouterLink to="/admin/music-videos" class="block px-3 py-2 rounded font-semibold"
            :class="linkClass('/admin/music-videos')">
            Music Videos
          </RouterLink>

          <RouterLink to="/admin/blog" class="block px-3 py-2 rounded font-semibold"
            :class="linkClass('/admin/blog')">
            Blog
          </RouterLink>
        </nav>
      </aside>

      <!-- MAIN -->
      <main>
        <!-- LOGIN -->
        <section v-if="!authed" class="max-w-md border rounded p-6">
          <h2 class="text-xl font-semibold mb-4">Login</h2>

          <input
            v-model="passcode"
            type="password"
            class="input mb-4"
            :class="inputClass"
            @keydown.enter="login"
          />

          <button class="px-5 py-2 border rounded" :class="btnClass" @click="login">
            Unlock
          </button>

          <p v-if="error" class="text-red-500 mt-3">{{ error }}</p>
        </section>

        <!-- CHILD VIEW -->
        <RouterView v-else />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from '@/composables/useTheme'

const { isLight } = useTheme()
const route = useRoute()

const themeClass = computed(() => (isLight.value ? 'bg-white text-black' : 'bg-black text-white'))
const btnClass = computed(() => (isLight.value ? 'border-black' : 'border-white'))
const inputClass = computed(() =>
  isLight.value
    ? 'bg-white text-black border border-black/30'
    : 'bg-black text-white border border-white/30'
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

function linkClass(path) {
  return route.path.startsWith(path)
    ? isLight.value ? 'bg-black/10' : 'bg-white/10'
    : ''
}
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.6rem;
  border-radius: 4px;
}
</style>
