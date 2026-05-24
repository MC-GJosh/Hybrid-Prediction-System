<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="w-full max-w-md">

      <!-- Logo -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-primary">Swimlytics AI</h1>
        <p class="text-secondary mt-2">Swim Performance Prediction System</p>
      </div>

      <!-- Card -->
      <div class="bg-surface border border-border rounded-2xl p-8 shadow-xl">
        <h2 class="text-xl font-semibold text-primary mb-6">Coach Login</h2>

        <!-- Error message -->
        <div v-if="errorMsg" class="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 rounded-lg px-4 py-3 mb-4 text-sm">
          {{ errorMsg }}
        </div>

        <!-- Email -->
        <div class="mb-4">
          <label class="block text-secondary text-sm mb-2">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="coach@email.com"
            class="w-full bg-background text-primary rounded-lg px-4 py-3 outline-none border border-border focus:border-primary transition-colors"
          />
        </div>

        <!-- Password -->
        <div class="mb-6">
          <label class="block text-secondary text-sm mb-2">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="w-full bg-background text-primary rounded-lg px-4 py-3 outline-none border border-border focus:border-primary transition-colors"
          />
        </div>

        <!-- Button -->
        <button
          @click="handleLogin"
          :disabled="loading"
          class="w-full bg-btn-primary hover:bg-btn-primary-hover disabled:opacity-50 text-btn-primary-text font-semibold rounded-lg py-3 transition-colors"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false // Custom layout or none for login if desired, but default layout has navbar. We don't want navbar here.
})

const { login } = useAuth()
const router = useRouter()
const { finish: finishLoading } = useLoadingIndicator()

onMounted(() => finishLoading())

const email = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)

const handleLogin = async () => {
  errorMsg.value = ''
  loading.value = true

  const { data, error } = await login(email.value, password.value)

  if (error) {
    errorMsg.value = 'Invalid email or password.'
    loading.value = false
    return
  }

  router.push('/dashboard')
}
</script>