<template>
  <Teleport to="body">
    <Transition name="confirm-modal">
      <div
        v-if="state.isOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        @click.self="cancel"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm dark:bg-black/60" />

        <!-- Modal Card -->
        <div class="relative bg-surface border border-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden confirm-modal-card">

          <div class="p-6">
            <!-- Icon + Title -->
            <div class="flex items-start gap-4">
              <!-- Icon circle -->
              <div
                class="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center"
                :class="{
                  'bg-red-100 dark:bg-red-500/10': state.variant === 'danger',
                  'bg-yellow-100 dark:bg-yellow-500/10': state.variant === 'warning',
                  'bg-blue-100 dark:bg-blue-500/10': state.variant === 'info',
                }"
              >
                <!-- Trash icon for danger -->
                <svg
                  v-if="state.variant === 'danger'"
                  xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <!-- Warning icon -->
                <svg
                  v-else-if="state.variant === 'warning'"
                  xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <!-- Info icon -->
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <div class="flex-1">
                <h3 class="text-primary text-lg font-semibold">{{ state.title }}</h3>
                <p class="text-secondary text-sm mt-1.5 leading-relaxed">{{ state.message }}</p>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3 mt-8">
              <button
                @click="cancel"
                class="px-5 py-2.5 rounded-xl text-sm font-semibold text-secondary hover:text-primary hover:bg-surface-hover border border-transparent hover:border-border transition"
              >
                {{ state.cancelText }}
              </button>
              <button
                @click="confirm"
                class="px-5 py-2.5 rounded-xl text-sm font-semibold transition text-white"
                :class="{
                  'bg-red-600 hover:bg-red-700': state.variant === 'danger',
                  'bg-yellow-600 hover:bg-yellow-700': state.variant === 'warning',
                  'bg-blue-600 hover:bg-blue-700': state.variant === 'info',
                }"
              >
                {{ state.confirmText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const { state, confirm, cancel } = useConfirmModal()
</script>

<style scoped>
/* Entrance / exit transitions */
.confirm-modal-enter-active,
.confirm-modal-leave-active {
  transition: opacity 0.2s ease;
}
.confirm-modal-enter-active .confirm-modal-card,
.confirm-modal-leave-active .confirm-modal-card {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.confirm-modal-enter-from,
.confirm-modal-leave-to {
  opacity: 0;
}
.confirm-modal-enter-from .confirm-modal-card {
  transform: scale(0.95) translateY(8px);
  opacity: 0;
}
.confirm-modal-leave-to .confirm-modal-card {
  transform: scale(0.95) translateY(8px);
  opacity: 0;
}
</style>
