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
        <h1 class="blog-detail-title text-4xl font-bold mb-4">
          {{ post.title }}
        </h1>

        <div class="blog-detail-date text-sm opacity-50">
          {{ new Date(post.created_at).toDateString() }}
        </div>
      </header>

      <p v-if="post.excerpt" class="blog-detail-excerpt text-lg opacity-80 mb-12">
        {{ post.excerpt }}
      </p>

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
    `${import.meta.env.VITE_API_BASE_URL || 'https://lukaeterovic-api.radan-luka.workers.dev'}/blog/${route.params.slug}`
  )
  if (res.ok) post.value = await res.json()
})
</script>

<style scoped>
.blog-detail-date {
  font-family: 'U001', sans-serif;
  font-weight: 700;
}

.blog-detail-title {
  font-family: 'U001 Condensed', sans-serif;
  font-weight: 700;
}

.blog-detail-excerpt {
  font-family: 'EB Garamond', serif;
  font-style: italic;
}
</style>
