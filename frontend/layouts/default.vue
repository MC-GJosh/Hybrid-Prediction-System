<template>
  <div class="min-h-screen bg-background text-primary flex flex-col">
    <!-- Global Navbar -->
    <nav class="bg-surface border-b border-border px-8 py-4 flex items-center justify-between sticky top-0 z-40">
      <h1 class="text-xl font-bold">Swimlytics AI</h1>
      <div class="flex items-center gap-6">
        <NuxtLink to="/dashboard" class="text-secondary hover:text-primary text-sm transition-colors" active-class="!text-primary font-semibold">Dashboard</NuxtLink>
        <NuxtLink to="/swimmers" class="text-secondary hover:text-primary text-sm transition-colors" active-class="!text-primary font-semibold">Swimmers</NuxtLink>
        <NuxtLink to="/logs/time" class="text-secondary hover:text-primary text-sm transition-colors" active-class="!text-primary font-semibold">Time Logs</NuxtLink>
        <NuxtLink to="/logs/training" class="text-secondary hover:text-primary text-sm transition-colors" active-class="!text-primary font-semibold">Training Logs</NuxtLink>
        <NuxtLink to="/predictions" class="text-secondary hover:text-primary text-sm transition-colors" active-class="!text-primary font-semibold">Predictions</NuxtLink>
        
        <div class="w-px h-5 bg-border mx-2"></div>
        
        <ThemeToggle />
        
        <button @click="handleLogout" class="text-red-500 hover:text-red-600 text-sm font-medium transition-colors">
          Logout
        </button>
      </div>
    </nav>

    <!-- Page Content -->
    <main class="flex-1 w-full">
      <slot />
    </main>
  </div>
</template>

<script setup>
import ThemeToggle from '~/components/shared/ThemeToggle.vue'

const { logout } = useAuth()
const router = useRouter()

const handleLogout = async () => {
  await logout()
  router.push('/login')
}
</script>
