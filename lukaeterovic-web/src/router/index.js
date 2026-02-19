// src/router/index.js
import { createRouter, createWebHistory, START_LOCATION } from 'vue-router'

// Only Home is eagerly loaded (optional)
const HomePage = () => import('@/views/HomePage.vue')

const routes = [
  { path: '/', name: 'Home', component: HomePage },

  {
    path: '/film',
    component: () => import('@/views/FilmPage.vue')
  },
  {
    path: '/film/:slug',
    component: () => import('@/views/FilmDetailPage.vue'),
    props: true
  },
  {
    path: '/photography',
    component: () => import('@/views/GalleriesPage.vue')
  },
  {
    path: '/photography/:slug',
    component: () => import('@/views/GalleryDetailPage.vue')
  },
  {
    path: '/music-videos',
    component: () => import('@/views/MusicVideosPage.vue')
  },
  {
    path: '/music-videos/:slug',
    component: () => import('@/views/MusicVideoDetailPage.vue')
  },
  {
    path: '/blog',
    component: () => import('@/views/BlogPage.vue')
  },
  {
    path: '/blog/:slug',
    component: () => import('@/views/BlogDetailPage.vue')
  },

  {
    path: '/admin',
    component: () => import('@/views/AdminPage.vue'),
    children: [
      { path: '', redirect: '/admin/films' },
      {
        path: 'films',
        component: () => import('@/views/admin/AdminFilms.vue')
      },
      {
        path: 'galleries',
        component: () => import('@/views/admin/AdminGalleries.vue')
      },
      {
        path: 'music-videos',
        component: () => import('@/views/admin/AdminMusicVideos.vue')
      },
      {
        path: 'blog',
        component: () => import('@/views/admin/AdminBlog.vue')
      }
    ]
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (from === START_LOCATION) return { top: 0 }
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

export default router
