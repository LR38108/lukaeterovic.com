<template>
  <transition name="slide-down">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex flex-col"
      :class="isLight ? 'bg-white text-black' : 'bg-black text-white'">
      <!-- TOP BAR -->
      <div class="flex justify-between items-center px-6 py-6">
        <img :src="chevron" class="w-7 h-7 rotate-180 cursor-pointer" @click="$emit('close')" />
        <img :src="logo" class="h-8" alt="Logo" />
      </div>

      <!-- MENU ITEMS -->
      <div class="flex-1 px-6">
        <div v-for="item in menuItems" :key="item.label" class="border-t border-black/20 dark:border-white/30">
          <!-- LINK ITEM -->
          <RouterLink v-if="item.to" :to="item.to" class="flex justify-between items-center py-7 cursor-pointer"
            @click="$emit('close')">
            <span class="tracking-widest text-2xl">
              {{ item.label }}
            </span>
            <img :src="chevron" class="h-4 rotate-90" />
          </RouterLink>

          <!-- STATIC ITEM -->
          <div v-else class="flex justify-between items-center py-7 cursor-pointer">
            <span class="tracking-widest text-2xl">
              {{ item.label }}
            </span>
            <img :src="chevron" class="h-4 rotate-90" />
          </div>
        </div>

        <!-- LIGHTS -->
        <div class="flex justify-between items-center border-t border-black/20 dark:border-white/30 py-7">
          <span class="tracking-widest text-2xl">LIGHTS</span>
          <img :src="switchIcon" class="h-7 cursor-pointer" alt="Lights toggle" @click="toggleTheme" />
        </div>
      </div>

      <!-- FOOTER -->
      <div class="px-6 pb-10 text-center text-sm opacity-60 space-y-6">
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
  import { computed } from 'vue'
  import { useTheme } from '@/composables/useTheme.js'
  import { RouterLink } from 'vue-router'

  const props = defineProps({ isOpen: Boolean })
  const { isLight, toggleTheme } = useTheme()

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
    { label: 'WORK', to: '/film' },
    { label: 'ABOUT', to: '/about' },
    { label: 'CONTACT', to: '/contact' },
    { label: 'COFFEE&MACHINES', to: '/blog' }
  ]
</script>

<style scoped>
  .slide-down-enter-active,
  .slide-down-leave-active {
    transition: transform 0.4s ease;
  }

  .slide-down-enter-from,
  .slide-down-leave-to {
    transform: translateY(-100%);
  }
</style>