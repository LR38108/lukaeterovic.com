<!-- src/views/AdminPage.vue -->
<template>
  <div :class="themeClass" class="min-h-screen pt-20 pb-12">
    <div class="max-w-7xl mx-auto px-4">

      <Transition name="fade" appear mode="out-in">
        <!-- LOGIN -->
        <section
          v-if="!authed"
          key="login"
          class="min-h-[70vh] flex flex-col items-center justify-center text-center"
        >
          <h1 class="text-3xl md:text-4xl font-semibold tracking-tight mb-10">
            Admin
          </h1>

          <div class="w-full max-w-xs space-y-6">
            <input
              v-model="passcode"
              type="password"
              placeholder="Passcode"
              class="w-full bg-transparent border-b pb-3 text-lg tracking-wide focus:outline-none transition-all caret-current"
              :class="inputClass"
              @keydown.enter="login"
            />

            <button
              class="w-full py-3 text-sm uppercase tracking-widest transition-all duration-200 active:scale-[0.98]"
              :class="buttonClass"
              @click="login"
            >
              Enter
            </button>

            <p v-if="error" class="text-xs opacity-60 mt-4">
              {{ error }}
            </p>
          </div>
        </section>

        <!-- ADMIN -->
        <div v-else key="admin">
          <!-- MOBILE HEADER -->
          <div class="lg:hidden mb-6 flex items-center justify-between">
            <h1 class="text-xl font-bold">Admin</h1>

            <button
              class="px-3 py-2 border rounded text-sm"
              :class="btnClass"
              @click="mobileOpen = !mobileOpen"
            >
              Menu
            </button>
          </div>

          <!-- MOBILE MENU -->
          <div
            v-if="mobileOpen"
            class="lg:hidden mb-8 space-y-2 border rounded p-4"
          >
            <RouterLink
              v-for="link in links"
              :key="link.to"
              :to="link.to"
              class="block px-3 py-2 rounded font-semibold"
              :class="linkClass(link.to)"
              @click="mobileOpen = false"
            >
              {{ link.label }}
            </RouterLink>
          </div>

          <!-- DESKTOP LAYOUT -->
          <div class="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
            <!-- SIDEBAR -->
            <aside class="hidden lg:block border-r pr-6">
              <h1 class="text-xl font-bold mb-6">Admin</h1>

              <nav class="space-y-2">
                <RouterLink
                  v-for="link in links"
                  :key="link.to"
                  :to="link.to"
                  class="block px-3 py-2 rounded font-semibold"
                  :class="linkClass(link.to)"
                >
                  {{ link.label }}
                </RouterLink>
              </nav>

              <button
                class="mt-8 px-3 py-2 border rounded text-sm"
                :class="btnClass"
                @click="logout"
              >
                Logout
              </button>
            </aside>

            <!-- MAIN -->
            <main>
              <RouterView />
            </main>
          </div>
        </div>
      </Transition>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from '@/composables/useTheme'

const { isLight } = useTheme()
const route = useRoute()

const ADMIN_KEY = 'admin_auth'
const PASS = 'admin' // replace with real auth later

const authed = ref(localStorage.getItem(ADMIN_KEY) === '1')
const passcode = ref('')
const error = ref('')
const mobileOpen = ref(false)

const links = [
  { to: '/admin/films', label: 'Films' },
  { to: '/admin/galleries', label: 'Galleries' },
  { to: '/admin/music-videos', label: 'Music Videos' },
  { to: '/admin/blog', label: 'Blog' }
]

const themeClass = computed(() =>
  isLight.value ? 'bg-white text-black' : 'bg-black text-white'
)

const btnClass = computed(() =>
  isLight.value ? 'border-black' : 'border-white'
)

const inputClass = computed(() =>
  isLight.value
    ? 'border-black/30 text-black placeholder-black/40 focus:border-black'
    : 'border-white/30 text-white placeholder-white/40 focus:border-white'
)

const buttonClass = computed(() =>
  isLight.value
    ? 'text-black border border-black/20 hover:bg-black hover:text-white'
    : 'text-white border border-white/20 hover:bg-white hover:text-black'
)

function login() {
  if (passcode.value === PASS) {
    authed.value = true
    localStorage.setItem(ADMIN_KEY, '1')
    error.value = ''
  } else {
    error.value = 'Wrong passcode'
  }
}

function logout() {
  localStorage.removeItem(ADMIN_KEY)
  authed.value = false
  passcode.value = ''
}

function linkClass(path) {
  return route.path.startsWith(path)
    ? isLight.value
      ? 'bg-black/10'
      : 'bg-white/10'
    : ''
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
