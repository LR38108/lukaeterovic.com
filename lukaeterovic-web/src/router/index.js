// src/router/index.js
import { createRouter, createWebHistory, START_LOCATION } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import FilmPage from '@/views/FilmPage.vue'
import FilmDetailPage from '@/views/FilmDetailPage.vue'
import NotFoundPage from '@/views/NotFoundPage.vue'
import AdminPage from '@/views/AdminPage.vue'

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/film', name: 'Film', component: FilmPage },
  { path: '/film/:slug', name: 'FilmDetail', component: FilmDetailPage, props: true },

  // Hidden admin page (manual URL entry)
  { path: '/admin', name: 'Admin', component: AdminPage },

  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundPage }
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