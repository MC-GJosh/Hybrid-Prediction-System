/**
 * Resets the global loading state to `true` on every route change,
 * so the skeleton appears before the next page's data loads.
 * Each page is responsible for calling `finishLoading()` once ready.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()

  router.beforeEach(() => {
    const { start } = useLoadingIndicator()
    start()
  })
})
