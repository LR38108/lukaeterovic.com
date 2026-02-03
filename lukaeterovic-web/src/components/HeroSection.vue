<template>
  <section class="hero relative w-full h-screen overflow-hidden">
    <video
      autoplay
      muted
      loop
      playsinline
      class="absolute inset-0 w-full h-full object-cover z-0"
    >
      <source src="/assets/videos/sample-30s.mp4" type="video/mp4" />
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