<template>
  <main class="flex flex-col min-h-screen">
    <header class="border-b-[1px]">
      <section class="container py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-purple-800 italic">OnRoad</h1>
        <div>
          <UButton color="purple">Sign Up</UButton>
        </div>
      </section>
    </header>
    <section class="container py-5 h-full">
      <NuxtPage />
    </section>
    <footer class="p-4 text-center border-t-[1px] mt-auto">
      <div class="container mx-auto">
        <p class="text-sm">
          &copy; {{ new Date().getFullYear() }} OnRoad. All rights reserved.
          Designed and developed by
          <a href="https://maalik.dev" class="text-purple-500">maalik.dev</a>.
        </p>
      </div>
    </footer>
  </main>
</template>
