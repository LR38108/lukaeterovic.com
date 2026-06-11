<template>
  <article v-if="post" class="min-h-screen pt-24 pb-32">

    <!-- HERO IMAGE -->
    <div
      v-if="post.cover_image"
      class="w-full mb-10"
    >
      <div class="max-w-5xl mx-auto px-4">
        <img
          :src="post.cover_image"
          :alt="post.title"
          class="w-full max-h-[70vh] object-cover"
          loading="lazy"
        />
      </div>
    </div>

    <!-- CONTENT -->
    <div class="max-w-3xl mx-auto px-4 text-left">
      <header class="mb-5 text-left">
        <h1 class="blog-detail-title text-4xl font-bold mb-2">
          {{ post.title }}
        </h1>

        <div class="blog-detail-date text-sm opacity-50 mb-3">
          {{ formatDate(post.created_at) }}
        </div>
      </header>

      <p v-if="post.excerpt" class="blog-detail-excerpt text-lg opacity-80 mb-5 text-left">
        {{ post.excerpt }}
      </p>

      <div
        class="blog-detail-body w-full text-left"
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

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear()).slice(-2)
  return `${day}.${month}.${year}`
}
</script>

<style scoped>
.blog-detail-date {
  font-family: 'U001', sans-serif;
  font-weight: 700;
}

.blog-detail-title {
  font-family: 'U001 Condensed', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
}

.blog-detail-excerpt {
  font-family: 'EB Garamond', serif;
  font-style: italic;
}

/* Left-align CMS HTML (override centered markup from API) */
.blog-detail-body :deep(p),
.blog-detail-body :deep(li),
.blog-detail-body :deep(blockquote),
.blog-detail-body :deep(h1),
.blog-detail-body :deep(h2),
.blog-detail-body :deep(h3),
.blog-detail-body :deep(h4),
.blog-detail-body :deep(figcaption) {
  text-align: left;
}

.blog-detail-body :deep(.blog-image) {
  margin: 2.5rem 0;
}

.blog-detail-body :deep(.blog-image img),
.blog-detail-body :deep(.blog-image-grid img) {
  display: block;
  width: 100%;
  height: auto;
}

.blog-detail-body :deep(.blog-image-grid) {
  display: grid;
  gap: 1rem;
  margin: 2.5rem 0;
}

.blog-detail-body :deep(.blog-image-grid--2) {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.blog-detail-body :deep(.blog-image-grid--3) {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

@media (max-width: 640px) {
  .blog-detail-body :deep(.blog-image-grid--2),
  .blog-detail-body :deep(.blog-image-grid--3) {
    grid-template-columns: 1fr;
  }
}
</style>
