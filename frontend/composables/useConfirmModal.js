/**
 * Global confirmation modal composable.
 * Uses Nuxt's useState for cross-component reactivity so any page
 * can trigger the modal and await the user's decision.
 */
export const useConfirmModal = () => {
  const state = useState('confirm-modal', () => ({
    isOpen: false,
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'danger', // 'danger' | 'warning' | 'info'
    _resolve: null,
  }))

  /**
   * Show the confirmation modal and return a Promise that resolves
   * to `true` (confirmed) or `false` (cancelled).
   *
   * @param {Object} options
   * @param {string} options.title
   * @param {string} options.message
   * @param {string} [options.confirmText='Delete']
   * @param {string} [options.cancelText='Cancel']
   * @param {'danger'|'warning'|'info'} [options.variant='danger']
   */
  const show = (options = {}) => {
    return new Promise((resolve) => {
      state.value = {
        isOpen: true,
        title: options.title ?? 'Confirm Action',
        message: options.message ?? 'Are you sure you want to proceed?',
        confirmText: options.confirmText ?? 'Delete',
        cancelText: options.cancelText ?? 'Cancel',
        variant: options.variant ?? 'danger',
        _resolve: resolve,
      }
    })
  }

  const confirm = () => {
    if (state.value._resolve) state.value._resolve(true)
    state.value.isOpen = false
    state.value._resolve = null
  }

  const cancel = () => {
    if (state.value._resolve) state.value._resolve(false)
    state.value.isOpen = false
    state.value._resolve = null
  }

  return { state, show, confirm, cancel }
}
