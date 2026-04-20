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
              :placeholder="uiPass ? 'Password' : 'Admin token'"
              class="w-full bg-transparent border-b pb-3 text-lg tracking-wide focus:outline-none transition-all caret-current"
              :class="inputClass"
              @keydown.enter="login"
            />

            <p v-if="!apiToken" class="text-xs opacity-50 text-left leading-relaxed">
              Set <code class="text-[0.7em]">VITE_ADMIN_TOKEN</code> in
              <code class="text-[0.7em]">.env.local</code> (same value as Worker secret
              <code class="text-[0.7em]">ADMIN_TOKEN</code> from
              <code class="text-[0.7em]">wrangler secret put</code>), then restart
              <code class="text-[0.7em]">npm run dev</code>.
            </p>

            <p v-else-if="uiPass" class="text-xs opacity-50 text-left leading-relaxed">
              Log in with your short password. Uploads still use
              <code class="text-[0.7em]">VITE_ADMIN_TOKEN</code> from
              <code class="text-[0.7em]">.env.local</code> (not shown here).
            </p>

            <p v-else class="text-xs opacity-50 text-left leading-relaxed">
              Optional: set <code class="text-[0.7em]">VITE_ADMIN_PASS</code> in
              <code class="text-[0.7em]">.env.local</code> for a short login password; keep
              <code class="text-[0.7em]">VITE_ADMIN_TOKEN</code> for the API only.
            </p>

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
              class="px-3 py-2 border rounded-none text-sm"
              :class="btnClass"
              @click="mobileOpen = !mobileOpen"
            >
              Menu
            </button>
          </div>

          <!-- MOBILE MENU -->
          <div
            v-if="mobileOpen"
            class="lg:hidden mb-8 space-y-2 border rounded-none p-4"
          >
            <RouterLink
              v-for="link in links"
              :key="link.to"
              :to="link.to"
              class="block px-3 py-2 rounded-none font-semibold"
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
                  class="block px-3 py-2 rounded-none font-semibold"
                  :class="linkClass(link.to)"
                >
                  {{ link.label }}
                </RouterLink>
              </nav>

              <button
                class="mt-8 px-3 py-2 border rounded-none text-sm"
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

/** Bearer token for Worker; must match `wrangler secret put ADMIN_TOKEN`. */
const apiToken = (import.meta.env.VITE_ADMIN_TOKEN || '').trim()
/** Optional short string only for unlocking this screen (see `.env.example`). */
const uiPass = (import.meta.env.VITE_ADMIN_PASS || '').trim()

const ADMIN_KEY = 'admin_auth'

const authed = ref(localStorage.getItem(ADMIN_KEY) === '1')
const passcode = ref('')
const error = ref('')
const mobileOpen = ref(false)

const links = [
  { to: '/admin/films', label: 'Films' },
  { to: '/admin/galleries', label: 'Galleries' },
  { to: '/admin/music-videos', label: 'Music Videos' },
  { to: '/admin/design', label: 'Design' },
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
    ? 'rounded-none text-black border border-black/20 hover:bg-black hover:text-white'
    : 'rounded-none text-white border border-white/20 hover:bg-white hover:text-black'
)

function login() {
  if (!apiToken) {
    error.value =
      'VITE_ADMIN_TOKEN is not set. Add it to .env.local and restart the dev server.'
    return
  }
  const entered = passcode.value.trim()
  const ok = uiPass
    ? entered === uiPass || entered === apiToken
    : entered === apiToken
  if (ok) {
    authed.value = true
    localStorage.setItem(ADMIN_KEY, '1')
    error.value = ''
  } else {
    error.value = uiPass ? 'Wrong password' : 'Wrong token'
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
