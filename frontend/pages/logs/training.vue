<template>
  <div>
    <div class="px-8 py-8 max-w-7xl mx-auto">

      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl font-bold text-primary">Training Logs</h2>
          <p class="text-secondary mt-1">Record swimmer daily training and metrics</p>
        </div>
        <button
          @click="toggleForm"
          class="bg-btn-primary hover:bg-btn-primary-hover text-btn-primary-text px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
        >
          + Add Training Log
        </button>
      </div>

      <!-- Add/Edit Training Log Modal -->
      <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm dark:bg-black/60">
        <div class="bg-surface rounded-2xl border border-border p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-primary">{{ form.id ? 'Edit Training Log' : 'New Training Log' }}</h3>
            <button @click="toggleForm" class="text-secondary hover:text-primary text-2xl leading-none transition-colors">&times;</button>
          </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label class="block text-secondary text-sm mb-2">Swimmer</label>
            <select v-model="form.swimmer_id"
              class="w-full bg-background text-primary rounded-lg px-4 py-3 border border-border focus:border-primary outline-none transition-colors">
              <option value="">Select swimmer</option>
              <option v-for="swimmer in swimmers" :key="swimmer.id" :value="swimmer.id">
                {{ swimmer.full_name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-secondary text-sm mb-2">Date</label>
            <input v-model="form.log_date" type="date"
              class="w-full bg-background text-primary rounded-lg px-4 py-3 border border-border focus:border-primary outline-none transition-colors" />
          </div>

          <div>
            <label class="block text-secondary text-sm mb-2">Attendance</label>
            <select v-model="form.attendance"
              class="w-full bg-background text-primary rounded-lg px-4 py-3 border border-border focus:border-primary outline-none transition-colors">
              <option value="">Select attendance</option>
              <option>Present</option>
              <option>Absent</option>
              <option>Sick</option>
              <option>Injured</option>
            </select>
          </div>

          <div>
            <label class="block text-secondary text-sm mb-2">Volume (meters)</label>
            <input v-model="form.volume_meters" type="number" placeholder="e.g. 5000"
              class="w-full bg-background text-primary rounded-lg px-4 py-3 border border-border focus:border-primary outline-none transition-colors" />
          </div>

          <div>
            <label class="block text-secondary text-sm mb-2">Intensity</label>
            <select v-model="form.intensity"
              class="w-full bg-background text-primary rounded-lg px-4 py-3 border border-border focus:border-primary outline-none transition-colors">
              <option value="">Select intensity</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Max</option>
            </select>
          </div>

          <div>
            <label class="block text-secondary text-sm mb-2">Fatigue Score (1-10)</label>
            <input v-model="form.fatigue_score" type="number" min="1" max="10" placeholder="1 = fresh, 10 = exhausted"
              class="w-full bg-background text-primary rounded-lg px-4 py-3 border border-border focus:border-primary outline-none transition-colors" />
          </div>

          <div>
            <label class="block text-secondary text-sm mb-2">Sleep (hours)</label>
            <input v-model="form.sleep_hours" type="number" step="0.5" placeholder="e.g. 8"
              class="w-full bg-background text-primary rounded-lg px-4 py-3 border border-border focus:border-primary outline-none transition-colors" />
          </div>

          <div class="flex items-center mt-8">
            <input v-model="form.gym_session" type="checkbox" id="gym_session"
              class="w-5 h-5 bg-background border-border rounded text-btn-primary focus:ring-btn-primary transition-colors" />
            <label for="gym_session" class="ml-3 text-primary font-medium">Gym Session Included</label>
          </div>

          <div class="md:col-span-2">
            <label class="block text-secondary text-sm mb-2">Notes</label>
            <input v-model="form.notes" type="text" placeholder="Optional notes"
              class="w-full bg-background text-primary rounded-lg px-4 py-3 border border-border focus:border-primary outline-none transition-colors" />
          </div>

        </div>

        <div v-if="formError" class="mt-4 text-red-600 dark:text-red-400 text-sm font-medium">{{ formError }}</div>
        <div v-if="formSuccess" class="mt-4 text-green-600 dark:text-green-400 text-sm font-medium">Training log saved successfully!</div>

        <div class="flex justify-end gap-3 mt-8">
          <button
            @click="toggleForm"
            class="px-5 py-2.5 rounded-xl text-sm font-semibold text-secondary hover:text-primary hover:bg-surface-hover border border-transparent hover:border-border transition-colors"
          >
            Cancel
          </button>
          <button
            @click="saveTrainingLog"
            :disabled="saving"
            class="bg-btn-primary hover:bg-btn-primary-hover disabled:opacity-50 text-btn-primary-text px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            {{ saving ? 'Saving...' : (form.id ? 'Update' : 'Save') }}
          </button>
        </div>
        </div>
      </div>

      <!-- Training Logs Table -->
      <div class="bg-surface rounded-2xl border border-border overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border text-secondary bg-surface-hover/50">
              <th class="text-left px-6 py-4 whitespace-nowrap font-medium">Date</th>
              <th class="text-left px-6 py-4 whitespace-nowrap font-medium">Swimmer</th>
              <th class="text-left px-6 py-4 whitespace-nowrap font-medium">Attendance</th>
              <th class="text-left px-6 py-4 whitespace-nowrap font-medium">Volume (m)</th>
              <th class="text-left px-6 py-4 whitespace-nowrap font-medium">Intensity</th>
              <th class="text-left px-6 py-4 whitespace-nowrap font-medium">Fatigue</th>
              <th class="text-left px-6 py-4 whitespace-nowrap font-medium">Sleep (h)</th>
              <th class="text-center px-6 py-4 whitespace-nowrap font-medium">Gym</th>
              <th class="text-left px-6 py-4 whitespace-nowrap font-medium">Notes</th>
              <th class="text-left px-6 py-4 whitespace-nowrap font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="10" class="text-center text-secondary px-6 py-8">
                Loading...
              </td>
            </tr>
            <tr v-else-if="trainingLogs.length === 0">
              <td colspan="10" class="text-center text-secondary px-6 py-8">
                No training logs yet. Add your first entry.
              </td>
            </tr>
            <tr
              v-else
              v-for="log in trainingLogs"
              :key="log.id"
              class="border-b border-border hover:bg-surface-hover transition-colors last:border-0"
            >
              <td class="px-6 py-4 text-secondary whitespace-nowrap">{{ log.log_date }}</td>
              <td class="px-6 py-4 font-semibold text-primary whitespace-nowrap">{{ log.swimmers?.full_name }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="{
                  'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400': log.attendance === 'Present',
                  'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400': log.attendance === 'Absent',
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400': log.attendance === 'Sick',
                  'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-400': log.attendance === 'Injured'
                }" class="px-2 py-1 rounded-md text-xs font-semibold">
                  {{ log.attendance }}
                </span>
              </td>
              <td class="px-6 py-4 text-primary font-mono font-bold">{{ log.volume_meters || '-' }}</td>
              <td class="px-6 py-4 text-secondary">{{ log.intensity || '-' }}</td>
              <td class="px-6 py-4 text-secondary">{{ log.fatigue_score || '-' }}</td>
              <td class="px-6 py-4 text-secondary">{{ log.sleep_hours || '-' }}</td>
              <td class="px-6 py-4 text-center">
                <span v-if="log.gym_session" class="text-primary font-bold">✓</span>
                <span v-else class="text-secondary">-</span>
              </td>
              <td class="px-6 py-4 text-secondary">{{ log.notes || '-' }}</td>
              <td class="px-6 py-4 flex gap-3">
                <button @click="editTrainingLog(log)" class="text-primary hover:underline text-sm font-medium">Edit</button>
                <button @click="deleteTrainingLog(log.id)" class="text-red-600 dark:text-red-400 hover:underline text-sm font-medium">Delete</button>
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
const trainingLogs = ref([])
const isLoading = ref(true)
const showForm = ref(false)
const saving = ref(false)
const formError = ref('')
const formSuccess = ref(false)

const form = ref({
  id: null,
  swimmer_id: '',
  log_date: '',
  attendance: '',
  volume_meters: '',
  intensity: '',
  fatigue_score: '',
  sleep_hours: '',
  gym_session: false,
  notes: ''
})

const resetForm = () => {
  form.value = {
    id: null, swimmer_id: '', log_date: '', attendance: '',
    volume_meters: '', intensity: '', fatigue_score: '',
    sleep_hours: '', gym_session: false, notes: ''
  }
}

const toggleForm = () => {
  if (showForm.value) {
    showForm.value = false
    resetForm()
  } else {
    showForm.value = true
  }
}

const editTrainingLog = (log) => {
  form.value = { ...log }
  showForm.value = true
}

const { show: showConfirm } = useConfirmModal()
const { finish: finishLoading } = useLoadingIndicator()

const deleteTrainingLog = async (id) => {
  const confirmed = await showConfirm({
    title: 'Delete Training Log',
    message: 'Are you sure you want to delete this training log? This action cannot be undone.',
    confirmText: 'Delete',
    variant: 'danger',
  })
  if (!confirmed) return
  const { error } = await supabase.from('training_logs').delete().eq('id', id)
  if (error) {
    alert('Error deleting training log.')
  } else {
    await fetchTrainingLogs()
  }
}

const fetchSwimmers = async () => {
  const { data } = await supabase
    .from('swimmers')
    .select('*')
    .order('full_name', { ascending: true })
  swimmers.value = data || []
}

const fetchTrainingLogs = async () => {
  const { data } = await supabase
    .from('training_logs')
    .select('*, swimmers(full_name)')
    .order('log_date', { ascending: false })
  trainingLogs.value = data || []
}

const saveTrainingLog = async () => {
  formError.value = ''
  formSuccess.value = false

  if (!form.value.swimmer_id) {
    formError.value = 'Please select a swimmer.'
    return
  }
  if (!form.value.log_date) {
    formError.value = 'Date is required.'
    return
  }

  saving.value = true

  const payload = {
    swimmer_id: form.value.swimmer_id,
    log_date: form.value.log_date,
    attendance: form.value.attendance || null,
    volume_meters: form.value.volume_meters ? parseInt(form.value.volume_meters) : null,
    intensity: form.value.intensity || null,
    fatigue_score: form.value.fatigue_score ? parseInt(form.value.fatigue_score) : null,
    sleep_hours: form.value.sleep_hours ? parseFloat(form.value.sleep_hours) : null,
    gym_session: form.value.gym_session,
    notes: form.value.notes || null,
  }

  let error;
  if (form.value.id) {
    const res = await supabase.from('training_logs').update(payload).eq('id', form.value.id)
    error = res.error
  } else {
    const res = await supabase.from('training_logs').insert(payload)
    error = res.error
  }

  saving.value = false

  if (error) {
    console.error(error)
    formError.value = 'Error saving training log. Try again.'
    return
  }

  formSuccess.value = true
  resetForm()

  await fetchTrainingLogs()

  setTimeout(() => {
    showForm.value = false
    formSuccess.value = false
  }, 1500)
}

onMounted(async () => {
  await fetchSwimmers()
  await fetchTrainingLogs()
  isLoading.value = false
  finishLoading()
})
</script>