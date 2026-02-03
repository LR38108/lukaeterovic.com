<template>
  <div class="min-h-screen flex items-center justify-center px-6">
    <div class="text-center">
      <h1 class="text-4xl font-semibold">404</h1>
      <p class="mt-3 opacity-70">
        The page you’re looking for doesn’t exist.
      </p>

      <div class="mt-8 flex justify-center gap-6">
        <router-link
          to="/"
          class="underline underline-offset-4"
        >
          Home
        </router-link>

        <router-link
          to="/film"
          class="underline underline-offset-4"
        >
          Films
        </router-link>
      </div>
    </div>
  </div>
</template>