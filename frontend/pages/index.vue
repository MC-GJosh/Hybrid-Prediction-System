<template>
  <div></div>
</template>

<script setup>
const router = useRouter()
const { finish: finishLoading } = useLoadingIndicator()
onMounted(() => {
  finishLoading()
  router.push('/login')
})
</script>