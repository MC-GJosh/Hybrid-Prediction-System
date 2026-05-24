<template>
  <Transition name="skeleton-fade">
    <div v-if="isLoading" class="fixed inset-0 z-50 bg-background text-primary">

      <!-- Navbar skeleton -->
      <nav class="bg-surface border-b border-border px-8 py-4 flex items-center justify-between">
        <div class="h-6 w-32 bg-border rounded-lg skeleton-pulse" />
        <div class="flex items-center gap-4">
          <div class="h-4 w-16 bg-border rounded skeleton-pulse" v-for="i in 5" :key="i" />
          <div class="h-8 w-16 bg-border rounded-lg skeleton-pulse" />
        </div>
      </nav>

      <div class="px-8 py-8 max-w-7xl mx-auto">

        <!-- Header skeleton -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <div class="h-7 w-48 bg-border rounded-lg skeleton-pulse" />
            <div class="h-4 w-72 bg-border/60 rounded mt-2 skeleton-pulse" />
          </div>
          <div class="h-10 w-36 bg-border rounded-xl skeleton-pulse" />
        </div>

        <!-- Stats row skeleton -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div v-for="i in 4" :key="i" class="bg-surface border border-border rounded-2xl p-5">
            <div class="h-3 w-20 bg-border rounded skeleton-pulse mb-3" />
            <div class="h-7 w-16 bg-border rounded-lg skeleton-pulse" />
          </div>
        </div>

        <!-- Table skeleton -->
        <div class="bg-surface rounded-2xl border border-border overflow-hidden">
          <!-- Table header -->
          <div class="flex border-b border-border px-6 py-4 gap-6 bg-surface-hover/50">
            <div class="h-3 w-20 bg-border rounded skeleton-pulse" v-for="i in 6" :key="i" />
          </div>
          <!-- Table rows -->
          <div v-for="row in 6" :key="row" class="flex px-6 py-4 gap-6 border-b border-border/50">
            <div class="h-4 w-24 bg-border/70 rounded skeleton-pulse" />
            <div class="h-4 w-28 bg-border/50 rounded skeleton-pulse" />
            <div class="h-4 w-16 bg-border/60 rounded skeleton-pulse" />
            <div class="h-4 w-20 bg-border/50 rounded skeleton-pulse" />
            <div class="h-4 w-14 bg-border/60 rounded skeleton-pulse" />
            <div class="h-4 w-24 bg-border/40 rounded skeleton-pulse" />
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const { isLoading } = useLoadingIndicator()
</script>

<style scoped>
.skeleton-pulse {
  animation: pulse 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
}

/* Stagger the pulse animation on different elements */
.skeleton-pulse:nth-child(2) { animation-delay: 0.15s; }
.skeleton-pulse:nth-child(3) { animation-delay: 0.3s; }
.skeleton-pulse:nth-child(4) { animation-delay: 0.45s; }
.skeleton-pulse:nth-child(5) { animation-delay: 0.6s; }
.skeleton-pulse:nth-child(6) { animation-delay: 0.75s; }

/* Fade transition */
.skeleton-fade-enter-active {
  transition: opacity 0.2s ease;
}
.skeleton-fade-leave-active {
  transition: opacity 0.35s ease;
}
.skeleton-fade-enter-from,
.skeleton-fade-leave-to {
  opacity: 0;
}
</style>
