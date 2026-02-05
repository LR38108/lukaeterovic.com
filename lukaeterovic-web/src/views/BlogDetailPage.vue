<template>
  <article v-if="post" class="min-h-screen pt-24 pb-32">
    <div class="max-w-3xl mx-auto px-4">

      <header class="mb-12">
        <h1 class="text-4xl font-bold mb-4">{{ post.title }}</h1>
        <div class="text-sm opacity-50">
          {{ new Date(post.created_at).toDateString() }}
        </div>
      </header>

      <div
        class="prose prose-neutral max-w-none"
        v-html="post.content"
      />
    </div>
  </article>
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
