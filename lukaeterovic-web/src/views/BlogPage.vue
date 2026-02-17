<template>
  <section class="min-h-screen pt-24 pb-32">
    <div class="max-w-3xl mx-auto px-4">

      <!-- HEADER -->
      <header class="mb-20">
        <h1 class="text-4xl font-bold mb-4">Coffe & Machines</h1>
        <p class="opacity-70 text-lg">
          Notes on film, photography, process, and work.
        </p>
      </header>

      <!-- POSTS -->
      <article v-for="post in publishedPosts" :key="post.slug" class="mb-20">
        <RouterLink :to="`/blog/${post.slug}`" class="block group">

          <!-- COVER -->
          <div v-if="post.cover_image" class="mb-6 aspect-[16/9] overflow-hidden rounded bg-black/5">
            <img :src="post.cover_image" class="w-full h-full object-cover
                     transition-transform duration-500
                     group-hover:scale-105" />
          </div>

          <!-- TITLE -->
          <h2 class="text-2xl font-semibold mb-2 group-hover:underline">
            {{ post.title }}
          </h2>

          <!-- EXCERPT -->
          <p v-if="post.excerpt" class="opacity-70 mb-3">
            {{ post.excerpt }}
          </p>

          <!-- DATE -->
          <div class="text-sm opacity-40">
            {{ new Date(post.created_at).toDateString() }}
          </div>

        </RouterLink>
      </article>

    </div>
  </section>
</template>

<script setup>
  import {computed, onMounted } from 'vue'
  import { useBlog } from '@/composables/useBlog'

  const { posts, init } = useBlog()
  onMounted(init)

  const publishedPosts = computed(() =>
  posts.value.filter(p => p?.published == 1)
)
</script>