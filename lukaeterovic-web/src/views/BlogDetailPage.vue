<template>
  <article v-if="post" class="min-h-screen pt-24 pb-32">

    <!-- HERO IMAGE -->
    <div
      v-if="post.cover_image"
      class="w-full mb-16"
    >
      <div class="max-w-5xl mx-auto px-4">
        <img
          :src="post.cover_image"
          :alt="post.title"
          class="w-full max-h-[70vh] object-cover rounded"
          loading="lazy"
        />
      </div>
    </div>

    <!-- CONTENT -->
    <div class="max-w-3xl mx-auto px-4">
      <header class="mb-12 text-center">
        <h1 class="text-4xl font-bold mb-4">
          {{ post.title }}
        </h1>

        <div class="text-sm opacity-50">
          {{ new Date(post.created_at).toDateString() }}
        </div>
      </header>

      <div
        class="w-full max-h-[60vh] md:max-h-[70vh] object-cover rounded"

        v-html="post.content"
      />
    </div>

  </article>

  <div
    v-else
    class="min-h-screen flex items-center justify-center opacity-60"
  >
    Loading…
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const post = ref(null)

onMounted(async () => {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/blog/${route.params.slug}`
  )
  if (res.ok) post.value = await res.json()
})
</script>
