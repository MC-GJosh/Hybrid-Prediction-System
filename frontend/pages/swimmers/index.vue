<template>
  <div>
    <div class="px-8 py-8 max-w-7xl mx-auto">

      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl font-bold text-primary">Swimmers</h2>
          <p class="text-secondary mt-1">Manage your athlete profiles</p>
        </div>
        <button
          @click="showForm = !showForm"
          class="bg-btn-primary hover:bg-btn-primary-hover text-btn-primary-text px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
        >
          {{ showForm ? 'Cancel' : '+ Add Swimmer' }}
        </button>
      </div>

      <!-- Add Swimmer Form -->
      <div v-if="showForm" class="bg-surface rounded-2xl border border-border p-6 mb-8">
        <h3 class="text-lg font-semibold mb-6 text-primary">New Swimmer Profile</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label class="block text-secondary text-sm mb-2">Full Name</label>
            <input v-model="form.full_name" type="text" placeholder="Juan Dela Cruz"
              class="w-full bg-background text-primary rounded-lg px-4 py-3 border border-border focus:border-primary outline-none transition-colors" />
          </div>

          <div>
            <label class="block text-secondary text-sm mb-2">Age</label>
            <input v-model="form.age" type="number" placeholder="17"
              class="w-full bg-background text-primary rounded-lg px-4 py-3 border border-border focus:border-primary outline-none transition-colors" />
          </div>

          <div>
            <label class="block text-secondary text-sm mb-2">Gender</label>
            <select v-model="form.gender"
              class="w-full bg-background text-primary rounded-lg px-4 py-3 border border-border focus:border-primary outline-none transition-colors">
              <option value="">Select gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          <div>
            <label class="block text-secondary text-sm mb-2">Main Stroke</label>
            <select v-model="form.main_stroke"
              class="w-full bg-background text-primary rounded-lg px-4 py-3 border border-border focus:border-primary outline-none transition-colors">
              <option value="">Select stroke</option>
              <option>Freestyle</option>
              <option>Breaststroke</option>
              <option>Backstroke</option>
              <option>Butterfly</option>
              <option>IM</option>
            </select>
          </div>

          <div>
            <label class="block text-secondary text-sm mb-2">Event Stroke</label>
            <select v-model="form.event_stroke"
              class="w-full bg-background text-primary rounded-lg px-4 py-3 border border-border focus:border-primary outline-none transition-colors">
              <option value="">Select stroke</option>
              <option>Freestyle</option>
              <option>Breaststroke</option>
              <option>Backstroke</option>
              <option>Butterfly</option>
              <option>Individual Medley (IM)</option>
            </select>
          </div>

          <div>
            <label class="block text-secondary text-sm mb-2">Distance</label>
            <select v-model="form.distance"
              :disabled="!form.event_stroke"
              class="w-full bg-background text-primary rounded-lg px-4 py-3 border border-border focus:border-primary outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              <option value="">{{ form.event_stroke ? 'Select distance' : 'Select stroke first' }}</option>
              <option v-for="d in availableDistances" :key="d">{{ d }}</option>
            </select>
          </div>

          <div>
            <label class="block text-secondary text-sm mb-2">Personal Best (seconds)</label>
            <input v-model="form.personal_best" type="number" step="0.01" placeholder="34.20"
              class="w-full bg-background text-primary rounded-lg px-4 py-3 border border-border focus:border-primary outline-none transition-colors" />
          </div>

          <div>
            <label class="block text-secondary text-sm mb-2">Height (cm)</label>
            <input v-model="form.height_cm" type="number" placeholder="170"
              class="w-full bg-background text-primary rounded-lg px-4 py-3 border border-border focus:border-primary outline-none transition-colors" />
          </div>

          <div>
            <label class="block text-secondary text-sm mb-2">Weight (kg)</label>
            <input v-model="form.weight_kg" type="number" placeholder="65"
              class="w-full bg-background text-primary rounded-lg px-4 py-3 border border-border focus:border-primary outline-none transition-colors" />
          </div>

        </div>

        <div v-if="formError" class="mt-4 text-red-600 dark:text-red-400 text-sm font-medium">{{ formError }}</div>
        <div v-if="formSuccess" class="mt-4 text-green-600 dark:text-green-400 text-sm font-medium">Swimmer added successfully!</div>

        <button
          @click="addSwimmer"
          :disabled="saving"
          class="mt-6 bg-btn-primary hover:bg-btn-primary-hover disabled:opacity-50 text-btn-primary-text px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
        >
          {{ saving ? 'Saving...' : 'Save Swimmer' }}
        </button>
      </div>

      <!-- Swimmers list -->
      <div class="bg-surface rounded-2xl border border-border overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border text-secondary bg-surface-hover/50">
              <th class="text-left px-6 py-4 font-medium">Name</th>
              <th class="text-left px-6 py-4 font-medium">Age</th>
              <th class="text-left px-6 py-4 font-medium">Gender</th>
              <th class="text-left px-6 py-4 font-medium">Main Stroke</th>
              <th class="text-left px-6 py-4 font-medium">Main Event</th>
              <th class="text-left px-6 py-4 font-medium">Personal Best</th>
              <th class="text-left px-6 py-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="7" class="text-center text-secondary px-6 py-8">
                Loading...
              </td>
            </tr>
            <tr v-else-if="swimmers.length === 0">
              <td colspan="7" class="text-center text-secondary px-6 py-8">
                No swimmers yet. Add your first athlete.
              </td>
            </tr>
            <tr
              v-else
              v-for="swimmer in swimmers"
              :key="swimmer.id"
              class="border-b border-border hover:bg-surface-hover transition-colors last:border-0"
            >
              <td class="px-6 py-4 font-semibold text-primary">{{ swimmer.full_name }}</td>
              <td class="px-6 py-4 text-secondary">{{ swimmer.age }}</td>
              <td class="px-6 py-4 text-secondary">{{ swimmer.gender }}</td>
              <td class="px-6 py-4 text-secondary">{{ swimmer.main_stroke }}</td>
              <td class="px-6 py-4 text-secondary">{{ swimmer.main_event }}</td>
              <td class="px-6 py-4 text-primary font-mono font-semibold">{{ swimmer.personal_best }}s</td>
              <td class="px-6 py-4">
                <NuxtLink
                  :to="`/swimmers/${swimmer.id}`"
                  class="text-primary hover:underline font-medium text-sm"
                >
                  View Profile →
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const supabase = useSupabase()

const swimmers = ref([])
const isLoading = ref(true)
const showForm = ref(false)
const saving = ref(false)
const formError = ref('')
const formSuccess = ref(false)

const form = ref({
  full_name: '',
  age: '',
  gender: '',
  main_stroke: '',
  event_stroke: '',
  distance: '',
  personal_best: '',
  height_cm: '',
  weight_kg: ''
})

const strokeDistances = {
  'Freestyle': ['50m', '100m', '200m', '400m', '800m', '1500m'],
  'Breaststroke': ['50m', '100m', '200m'],
  'Backstroke': ['50m', '100m', '200m'],
  'Butterfly': ['50m', '100m', '200m'],
  'Individual Medley (IM)': ['200m', '400m'],
}

const availableDistances = computed(() => strokeDistances[form.value.event_stroke] || [])

watch(() => form.value.event_stroke, () => {
  form.value.distance = ''
})

const fetchSwimmers = async () => {
  const { data } = await supabase
    .from('swimmers')
    .select('*')
    .order('created_at', { ascending: false })
  swimmers.value = data || []
}

const addSwimmer = async () => {
  formError.value = ''
  formSuccess.value = false

  if (!form.value.full_name) {
    formError.value = 'Full name is required.'
    return
  }

  saving.value = true

  const { data: userData } = await supabase.auth.getUser()

  const { error } = await supabase.from('swimmers').insert({
    coach_id: userData.user.id,
    full_name: form.value.full_name,
    age: form.value.age || null,
    gender: form.value.gender || null,
    main_stroke: form.value.main_stroke || null,
    main_event: (form.value.distance && form.value.event_stroke)
      ? `${form.value.distance} ${form.value.event_stroke}`
      : null,

    personal_best: form.value.personal_best || null,
    height_cm: form.value.height_cm || null,
    weight_kg: form.value.weight_kg || null,
  })

  saving.value = false

  if (error) {
    formError.value = 'Error saving swimmer. Try again.'
    return
  }

  formSuccess.value = true
  form.value = {
    full_name: '', age: '', gender: '',
    main_stroke: '', event_stroke: '', distance: '',
    personal_best: '', height_cm: '', weight_kg: ''
  }

  await fetchSwimmers()

  setTimeout(() => {
    showForm.value = false
    formSuccess.value = false
  }, 1500)
}

const { finish: finishLoading } = useLoadingIndicator()

onMounted(async () => {
  await fetchSwimmers()
  isLoading.value = false
  finishLoading()
})
</script>