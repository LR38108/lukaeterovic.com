<template>
  <transition name="slide-down">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex flex-col overflow-y-auto overscroll-none min-h-0"
      :class="isLight ? 'bg-white text-black' : 'bg-black text-white'"
    >
      <!-- TOP BAR -->
      <div class="flex justify-between items-center px-6 py-6">
        <button type="button" class="w-7 h-7 flex items-center justify-center cursor-pointer" aria-label="Close menu" @click="$emit('close')">
          <img :src="chevron" class="w-7 h-7" alt="" />
        </button>
        <img :src="logo" class="h-[1.4rem]" alt="Logo" />
      </div>

      <!-- MENU ITEMS -->
      <div class="flex-1 px-6 font-u001-bold select-none">
        <div
          v-for="(item, index) in menuItems"
          :key="item.label"
          :class="index > 0 ? topDividerClass : ''"
        >
          <!-- DROPDOWN ITEM (e.g. WORK) -->
          <template v-if="item.children">
            <div
              role="button"
              tabindex="0"
              :aria-expanded="openDropdown === item.label"
              @keydown.enter.prevent="toggleWork(item.label)"
              @keydown.space.prevent="toggleWork(item.label)"
              class="work-menu-trigger flex justify-between items-center py-7 cursor-pointer touch-manipulation"
              @click="toggleWork(item.label)"
            >
              <span class="tracking-[0.09em] text-2xl">{{ item.label }}</span>
              <span class="work-toggle-icon flex items-center justify-center w-6 h-6 shrink-0" aria-hidden="true">
                <svg class="w-6 h-6 overflow-visible" viewBox="0 0 24 24" fill="none">
                  <g stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <line
                      x1="12"
                      y1="5"
                      x2="12"
                      y2="19"
                      class="work-toggle-bar-v"
                      :class="{ 'work-toggle-bar-v--open': openDropdown === item.label }"
                    />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </g>
                </svg>
              </span>
            </div>
            <transition name="dropdown">
              <div
                v-show="openDropdown === item.label"
                class="work-menu-dropdown"
              >
                <RouterLink
                  v-for="child in item.children"
                  :key="child.label"
                  :to="child.to"
                  class="flex justify-between items-center py-5 pl-6 cursor-pointer touch-manipulation"
                  @click="$emit('close')"
                >
                  <span class="tracking-[0.09em] text-xl">{{ child.label }}</span>
                </RouterLink>
              </div>
            </transition>
          </template>

          <!-- LINK ITEM -->
          <RouterLink
            v-else-if="item.to"
            :to="item.to"
            class="flex justify-between items-center py-7 cursor-pointer touch-manipulation"
            @click="$emit('close')"
          >
            <span class="tracking-[0.09em] text-2xl">{{ item.label }}</span>
          </RouterLink>

          <!-- STATIC ITEM -->
          <div v-else class="flex justify-between items-center py-7 cursor-pointer touch-manipulation">
            <span class="tracking-[0.09em] text-2xl">{{ item.label }}</span>
          </div>
        </div>

        <!-- LIGHTS -->
        <div class="flex justify-between items-center py-7 touch-manipulation" :class="topDividerClass">
          <span class="tracking-[0.09em] text-2xl">LIGHTS</span>
          <img
            :src="switchIcon"
            class="h-7 cursor-pointer touch-manipulation select-none"
            alt="Lights toggle"
            draggable="false"
            @click="toggleTheme"
          />
        </div>
      </div>

      <SiteFooter variant="menu" />
    </div>
  </transition>
</template>

<script setup>
  import { computed, ref, watch, onUnmounted } from 'vue'
  import { useTheme } from '@/composables/useTheme.js'
  import { RouterLink } from 'vue-router'
  import SiteFooter from '@/components/SiteFooter.vue'

  const props = defineProps({ isOpen: Boolean })
  const { isLight, toggleTheme } = useTheme()
  const openDropdown = ref(null)

  let bodyScrollY = 0

  function lockBodyScroll() {
    bodyScrollY = window.scrollY
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${bodyScrollY}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.width = '100%'
  }

  function unlockBodyScroll() {
    if (document.body.style.position !== 'fixed') return
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.left = ''
    document.body.style.right = ''
    document.body.style.width = ''
    window.scrollTo(0, bodyScrollY)
  }

  watch(
    () => props.isOpen,
    (open) => {
      if (open) {
        lockBodyScroll()
      } else {
        unlockBodyScroll()
        openDropdown.value = null
      }
    }
  )

  onUnmounted(() => {
    unlockBodyScroll()
  })

  function toggleWork(label) {
    openDropdown.value = openDropdown.value === label ? null : label
  }

  /** Matches app theme (Tailwind `dark:` follows OS, not LIGHTS toggle). */
  const topDividerClass = computed(() =>
    isLight.value ? 'border-t border-black/25' : 'border-t border-white/30'
  )

  const chevron = computed(() =>
    isLight.value ? '/assets/icons/chevron_black.svg' : '/assets/icons/chevron_white.svg'
  )

  const switchIcon = computed(() =>
    isLight.value ? '/assets/icons/on-switch.svg' : '/assets/icons/off-switch.svg'
  )

  const logo = computed(() =>
    isLight.value ? '/assets/logos/logo_black.svg' : '/assets/logos/logo_white.svg'
  )

  const menuItems = [
    {
      label: 'WORK',
      children: [
        { label: 'FILM', to: '/film' },
        { label: 'MUSIC VIDEO', to: '/music-videos' },
        { label: 'PHOTOGRAPHY', to: '/photography' },
        { label: 'DESIGN', to: '/design' }
      ]
    },
    { label: 'ABOUT', to: '/about' },
    { label: 'CONTACT', to: '/contact' },
    { label: 'COFFEE&MACHINES', to: '/blog' }
  ]
</script>

<style scoped>
  .font-u001-bold {
    font-family: 'U001', sans-serif;
    font-weight: 700;
  }

  .slide-down-enter-active,
  .slide-down-leave-active {
    transition: transform 0.4s ease;
  }

  .slide-down-enter-from,
  .slide-down-leave-to {
    transform: translateY(-100%);
  }

  /* Opacity-only: Safari mis-handles transform + overflow on v-show dropdown rows */
  .dropdown-enter-active,
  .dropdown-leave-active {
    transition: opacity 0.2s ease;
  }

  .dropdown-enter-from,
  .dropdown-leave-to {
    opacity: 0;
  }

  .work-menu-trigger {
    -webkit-user-select: none;
    user-select: none;
  }

  .work-menu-dropdown {
    overflow: visible;
  }

  /* WORK +/- : vertical stroke collapses into minus */
  .work-toggle-bar-v {
    transform-origin: 12px 12px;
    transform: scaleY(1);
    transition: transform 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .work-toggle-bar-v--open {
    transform: scaleY(0);
  }

  @media (prefers-reduced-motion: reduce) {
    .work-toggle-bar-v {
      transition: none;
    }
  }
</style>