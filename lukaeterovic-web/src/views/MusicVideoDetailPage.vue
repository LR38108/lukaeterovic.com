<template>
  <section v-if="video" class="min-h-screen pt-24 pb-32">

    <!-- VIDEO -->
    <div class="max-w-6xl mx-auto px-4 mb-16">
      <div class="relative aspect-video bg-black rounded overflow-hidden">
        <iframe :src="embedUrl" class="absolute inset-0 w-full h-full" frameborder="0"
          allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
      </div>
    </div>

    <!-- INFO -->
    <div class="max-w-3xl mx-auto px-4 text-center">
      <div class="text-sm uppercase tracking-wide opacity-50 mb-2">
        {{ video.artist }} <span v-if="video.year">· {{ video.year }}</span>
      </div>

      <h1 class="text-3xl md:text-4xl font-bold mb-6">
        {{ video.title }}
      </h1>

      <p v-if="video.description" class="opacity-80 leading-relaxed">
        {{ video.description }}
      </p>

      <!-- CREDITS -->
      <div v-if="creditsList.length" class="mt-12 text-left">
        <h2 class="text-sm uppercase tracking-wide opacity-50 mb-4">Credits</h2>
        <div class="space-y-2">
          <div
            v-for="(c, i) in creditsList"
            :key="i"
            class="credit-row flex items-baseline gap-2"
          >
            <span class="flex-none">{{ c.role }}</span>
            <span class="credit-dots flex-1 min-w-4" aria-hidden="true" />
            <span class="flex-none font-medium">{{ c.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- OPTIONAL STILLS -->
    <div v-if="normalizedGallery.length" class="max-w-6xl mx-auto px-4 mt-24">
      <div class="columns-1 sm:columns-2 lg:columns-3 gap-6">
        <img v-for="(img, i) in normalizedGallery" :key="img.url" :src="img.url" class="mb-6 rounded cursor-zoom-in"
          @click="openLightbox(i)" />
      </div>
    </div>

    <!-- LIGHTBOX -->
    <CustomLightbox
      v-model="lightboxOpen"
      :images="normalizedGallery"
      :initial-index="lightboxIndex"
    />

  </section>

  <div v-else class="min-h-screen flex items-center justify-center opacity-60">
    Loading…
  </div>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { useMusicVideos } from '@/composables/useMusicVideos'
  import CustomLightbox from '@/components/CustomLightbox.vue'

  const route = useRoute()
  const { musicVideos, init } = useMusicVideos()

  const lightboxOpen = ref(false)
  const lightboxIndex = ref(0)

  function openLightbox(index) {
    lightboxIndex.value = index
    lightboxOpen.value = true
  }

  const video = computed(() =>
    musicVideos.value.find(v => v.slug === route.params.slug)
  )

  const creditsList = computed(() => {
    const list = video.value?.credits
    if (!Array.isArray(list)) return []
    return list.filter(c => c && (c.role || c.name)).map(c => ({
      role: c.role || '',
      name: c.name || ''
    }))
  })

  const normalizedGallery = computed(() => {
    if (!video.value?.gallery) return []

    return video.value.gallery.map(img =>
      typeof img === 'string'
        ? { url: img }
        : img
    )
  })

  const embedUrl = computed(() => {
    const url = video.value?.videoUrl || video.value?.video_url
    if (!url) return ''

    try {
      // youtu.be/VIDEO_ID
      if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1].split(/[?&]/)[0]
        return `https://www.youtube.com/embed/${id}`
      }

      // youtube.com/watch?v=VIDEO_ID
      const u = new URL(url)
      const id = u.searchParams.get('v')
      if (!id) return ''

      return `https://www.youtube.com/embed/${id}`
    } catch {
      return ''
    }
  })

  onMounted(init)
</script>

<style scoped>
.credit-row .credit-dots {
  border-bottom: 1px dotted currentColor;
  opacity: 0.5;
  margin-bottom: 0.25em;
}
</style>