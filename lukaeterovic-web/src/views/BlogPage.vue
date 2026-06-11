<template>
  <section class="min-h-screen pt-24 pb-32">
    <div class="max-w-3xl mx-auto px-4">

      <!-- HEADER -->
      <header class="mb-20">
        <h1 class="blog-page-title text-4xl font-bold mb-4 tracking-[0.06em]">
          Coffee & Machines
        </h1>
        <p class="opacity-70 text-lg">
          Journal of a journey. Grab a cup of coffee and enjoy.
        </p>
      </header>

      <!-- POSTS -->
      <article v-for="post in publishedPosts" :key="post.slug" class="mb-20 text-left">
        <RouterLink
          :to="`/blog/${post.slug}`"
          class="block group no-underline hover:no-underline"
        >
          <div v-if="post.cover_image" class="mb-6 aspect-[16/9] overflow-hidden rounded bg-black/5">
            <img
              :src="post.cover_image"
              :alt="post.title"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>

          <div class="blog-post-date text-sm md:text-base opacity-50 mb-2">
            {{ formatDate(post.created_at) }}
          </div>

          <h2 class="blog-post-title text-3xl md:text-5xl font-bold mb-3 leading-none">
            {{ post.title }}
          </h2>

          <p v-if="post.excerpt" class="blog-post-subtitle text-xl md:text-2xl opacity-75 mb-7 leading-snug">
            {{ post.excerpt }}
          </p>

          <span class="blog-read-button inline-flex items-center justify-center px-6 py-3 border text-sm uppercase tracking-[0.14em] transition-colors duration-300">
            <span>Read now</span>
          </span>

        </RouterLink>
      </article>

    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useBlog } from '@/composables/useBlog'

const { posts, init } = useBlog()
onMounted(init)

const publishedPosts = computed(() =>
  posts.value.filter(p => p?.published == 1)
)

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
.blog-page-title {
  font-family: 'U001 Condensed', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
}

.blog-post-title {
  font-family: 'U001 Condensed', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
}

.blog-post-date {
  font-family: 'U001', sans-serif;
  font-weight: 400;
}

.blog-post-subtitle {
  font-family: 'EB Garamond', serif;
  font-style: italic;
  font-weight: 400;
}

.blog-read-button {
  font-family: 'U001', sans-serif;
  font-weight: 700;
}

.group:hover .blog-read-button {
  background: currentColor;
}

.group:hover .blog-read-button span {
  filter: invert(1);
}
</style>