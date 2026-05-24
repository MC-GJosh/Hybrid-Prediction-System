/**
 * Global loading indicator composable.
 * Provides a shared loading state for page transitions and
 * heavy data fetches. Used by GlobalSkeletonLoader to decide
 * whether to render the skeleton overlay.
 */
export const useLoadingIndicator = () => {
  const isLoading = useState('global-loading', () => true)

  const start = () => { isLoading.value = true }
  const finish = () => { isLoading.value = false }

  return { isLoading, start, finish }
}
