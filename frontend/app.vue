<template>
  <NuxtLayout>
    <SharedGlobalSkeletonLoader />
    <NuxtPage />
    <SharedGlobalConfirmModal />
  </NuxtLayout>
</template>

<script setup>
import { onMounted } from 'vue'

const { initTheme } = useTheme()

onMounted(() => {
  initTheme()
})
</script>