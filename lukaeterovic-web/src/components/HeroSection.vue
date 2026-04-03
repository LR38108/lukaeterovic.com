<template>
  <section class="hero relative w-full h-screen overflow-hidden bg-black">
    <video
      ref="videoRef"
      class="absolute inset-0 w-full h-full object-cover z-0"
      :poster="posterUrl"
      autoplay
      muted
      loop
      playsinline
      webkit-playsinline
      preload="auto"
      @loadedmetadata="onLoadedMetadata"
    >
      <source src="/assets/videos/Showreel.mp4" type="video/mp4" />
    </video>

    <div
      class="absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-16 lg:p-24 text-white bg-black/50"
    >
      <h1 class="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">
        Insert some introduction words etc.
      </h1>
      <p class="text-sm md:text-lg mt-2">
        (ovo je header koji je zapravo video u kojem se vrti mali showreel rada)
      </p>
    </div>
  </section>
</template>
<script setup>
import { ref, onMounted, nextTick } from 'vue'

const videoRef = ref(null)
/** JPEG data URL from first decoded frame — shown until video plays (esp. Safari) */
const posterUrl = ref('')

let posterCaptured = false
let metadataHandled = false

function tryPlay() {
  const el = videoRef.value
  if (!el) return
  const p = el.play()
  if (p !== undefined && typeof p.then === 'function') {
    p.catch(() => {
      /* Autoplay blocked — muted video usually still plays */
    })
  }
}

function capturePosterFromVideo() {
  const video = videoRef.value
  if (!video || posterCaptured || !video.videoWidth || !video.videoHeight) return

  try {
    const canvas = document.createElement('canvas')
    const vw = video.videoWidth
    const vh = video.videoHeight
    const maxW = 1920
    let tw = vw
    let th = vh
    if (tw > maxW) {
      th = (th * maxW) / tw
      tw = maxW
    }
    canvas.width = tw
    canvas.height = th
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0, tw, th)
    posterUrl.value = canvas.toDataURL('image/jpeg', 0.88)
    posterCaptured = true
  } catch (e) {
    console.warn('Hero poster frame capture failed', e)
  }
}

function onLoadedMetadata() {
  const video = videoRef.value
  if (!video || metadataHandled) return
  metadataHandled = true

  const afterSeek = () => {
    video.removeEventListener('seeked', afterSeek)
    capturePosterFromVideo()
    tryPlay()
  }

  video.addEventListener('seeked', afterSeek)

  // Tiny seek so engines decode a real frame (Safari is picky about t=0)
  const t = Math.min(0.05, Math.max(0.001, (video.duration || 1) * 0.001))
  video.currentTime = t

  // If seeked never fires (rare), still try capture + play
  setTimeout(() => {
    if (!posterCaptured) {
      capturePosterFromVideo()
      tryPlay()
    }
  }, 300)
}

onMounted(() => {
  nextTick(() => tryPlay())
})
</script>
