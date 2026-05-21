import { createApp, nextTick } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'

function setLoaderProgress(fraction) {
  const fill = document.querySelector('#initial-loader .loader-line-fill')
  if (!fill) return
  const p = Math.min(1, Math.max(0, fraction))
  fill.style.transform = `scaleX(${p})`
}

function hideInitialLoader() {
  const el = document.getElementById('initial-loader')
  if (!el) return
  el.classList.add('initial-loader--done')
  const remove = () => el.remove()
  el.addEventListener('transitionend', remove, { once: true })
  setTimeout(remove, 500)
}

const HOME_HERO_READY_KEY = 'homeHeroVideoReady'

function shouldWaitForHomeHero() {
  if (router.currentRoute.value.name !== 'Home') return false
  try {
    return sessionStorage.getItem(HOME_HERO_READY_KEY) !== '1'
  } catch (_) {
    return true
  }
}

function waitForHomeHeroVideo() {
  if (!shouldWaitForHomeHero()) return Promise.resolve()

  setLoaderProgress(0.9)

  return new Promise((resolve) => {
    let done = false

    const finish = () => {
      if (done) return
      done = true
      window.removeEventListener('home-hero-video-ready', finish)
      try {
        sessionStorage.setItem(HOME_HERO_READY_KEY, '1')
      } catch (_) {
        /* sessionStorage may be unavailable in private browsing */
      }
      resolve()
    }

    window.addEventListener('home-hero-video-ready', finish, { once: true })
    setTimeout(finish, 8000)
  })
}

const app = createApp(App)
app.use(router)

async function boot() {
  setLoaderProgress(0.08)

  await router.isReady()
  setLoaderProgress(0.55)

  app.mount('#app')
  await nextTick()
  setLoaderProgress(0.82)

  await new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve)
    })
  })

  await waitForHomeHeroVideo()

  setLoaderProgress(1)
  await new Promise((r) => setTimeout(r, 140))
  hideInitialLoader()
}

boot().catch((err) => {
  console.error(err)
  setLoaderProgress(1)
  try {
    app.mount('#app')
  } catch (_) {
    /* already mounted */
  }
  hideInitialLoader()
})
