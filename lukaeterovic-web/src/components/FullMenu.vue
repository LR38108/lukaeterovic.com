<template>
  <transition name="slide-down">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex flex-col"
      :class="isLight ? 'bg-white text-black' : 'bg-black text-white'">
      <!-- TOP BAR -->
      <div class="flex justify-between items-center px-6 py-6">
        <button type="button" class="w-7 h-7 flex items-center justify-center cursor-pointer" aria-label="Close menu" @click="$emit('close')">
          <img :src="chevron" class="w-7 h-7 alt="" />
        </button>
        <img :src="logo" class="h-[1.4rem]" alt="Logo" />
      </div>

      <!-- MENU ITEMS -->
      <div class="flex-1 px-6 font-u001-bold">
        <div
          v-for="(item, index) in menuItems"
          :key="item.label"
          :class="index > 0 ? 'border-t border-black/20 dark:border-white/30' : ''"
        >
          <!-- DROPDOWN ITEM (e.g. WORK) -->
          <template v-if="item.children">
            <div
              class="flex justify-between items-center py-7 cursor-pointer"
              @click="openDropdown = openDropdown === item.label ? null : item.label"
            >
              <span class="tracking-[0.09em] text-2xl">{{ item.label }}</span>
              <span class="flex items-center justify-center w-6 h-6">
                <svg v-if="openDropdown === item.label" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <svg v-else class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </span>
            </div>
            <transition name="dropdown">
              <div v-show="openDropdown === item.label" class="overflow-hidden">
                <RouterLink
                  v-for="child in item.children"
                  :key="child.label"
                  :to="child.to"
                  class="flex justify-between items-center py-5 pl-6 cursor-pointer border-t border-black/10 dark:border-white/10"
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
            class="flex justify-between items-center py-7 cursor-pointer"
            @click="$emit('close')"
          >
            <span class="tracking-[0.09em] text-2xl">{{ item.label }}</span>
          </RouterLink>

          <!-- STATIC ITEM -->
          <div v-else class="flex justify-between items-center py-7 cursor-pointer">
            <span class="tracking-[0.09em] text-2xl">{{ item.label }}</span>
          </div>
        </div>

        <!-- LIGHTS -->
        <div class="flex justify-between items-center border-t border-black/20 dark:border-white/30 py-7">
          <span class="tracking-[0.09em] text-2xl">LIGHTS</span>
          <img :src="switchIcon" class="h-7 cursor-pointer" alt="Lights toggle" @click="toggleTheme" />
        </div>
      </div>

      <!-- FOOTER -->
      <div class="px-6 pb-10 text-center text-sm opacity-60 space-y-6 font-u001-condensed">
        <div class="flex justify-center gap-6">
          <img src="/assets/icons/IG.svg" class="h-6" />
          <img src="/assets/icons/Threads.svg" class="h-6" />
          <img src="/assets/icons/vimeo.svg" class="h-6" />
        </div>

        <p class="leading-snug">
          ALL WORK AND MATERIAL ON THIS<br />
          WEBSITE IS 100% AI FREE.<br />
          ALL RIGHTS RESERVED.
        </p>
      </div>
    </div>
  </transition>
</template>

<script setup>
  import { computed, ref } from 'vue'
  import { useTheme } from '@/composables/useTheme.js'
  import { RouterLink } from 'vue-router'

  const props = defineProps({ isOpen: Boolean })
  const { isLight, toggleTheme } = useTheme()
  const openDropdown = ref(null)

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
        { label: 'COMMERCIAL WORK', to: '#' },
        { label: 'DESIGN', to: '#' }
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

  .font-u001-condensed {
    font-family: 'U001 Condensed', sans-serif;
  }

  .slide-down-enter-active,
  .slide-down-leave-active {
    transition: transform 0.4s ease;
  }

  .slide-down-enter-from,
  .slide-down-leave-to {
    transform: translateY(-100%);
  }

  .dropdown-enter-active,
  .dropdown-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  .dropdown-enter-from,
  .dropdown-leave-to {
    opacity: 0;
    transform: translateY(-8px);
  }
</style>