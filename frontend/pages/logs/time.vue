<template>
  <div>
    <div class="px-8 py-8 max-w-7xl mx-auto">

      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl font-bold text-primary">Time Logs</h2>
          <p class="text-secondary mt-1">Record swimmer race and trial times</p>
        </div>
        <button
          @click="toggleForm"
          class="bg-btn-primary hover:bg-btn-primary-hover text-btn-primary-text px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
        >
          + Add Time Log
        </button>
      </div>

      <!-- Add/Edit Time Log Modal -->
      <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm dark:bg-black/60">
        <div class="bg-surface rounded-2xl border border-border p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-primary">{{ form.id ? 'Edit Time Log' : 'New Time Log' }}</h3>
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
            <label class="block text-secondary text-sm mb-2">Event</label>
            <input v-model="form.event" type="text" placeholder="50m Breaststroke"
              class="w-full bg-background text-primary rounded-lg px-4 py-3 border border-border focus:border-primary outline-none transition-colors" />
          </div>

          <div>
            <label class="block text-secondary text-sm mb-2">Stroke</label>
            <select v-model="form.stroke"
              class="w-full bg-background text-primary rounded-lg px-4 py-3 border border-border focus:border-primary outline-none transition-colors">
              <option value="">Select stroke</option>
              <option>Freestyle</option>
              <option>Breaststroke</option>
              <option>Backstroke</option>
              <option>Butterfly</option>
            </select>
          </div>

          <div>
            <label class="block text-secondary text-sm mb-2">Time (seconds)</label>
            <input v-model="form.time_seconds" type="number" step="0.01" placeholder="35.10"
              class="w-full bg-background text-primary rounded-lg px-4 py-3 border border-border focus:border-primary outline-none transition-colors" />
          </div>

          <div>
            <label class="block text-secondary text-sm mb-2">Log Type</label>
            <select v-model="form.log_type"
              class="w-full bg-background text-primary rounded-lg px-4 py-3 border border-border focus:border-primary outline-none transition-colors">
              <option value="">Select type</option>
              <option>Training</option>
              <option>Time Trial</option>
              <option>Competition</option>
            </select>
          </div>

          <div>
            <label class="block text-secondary text-sm mb-2">Pool Length (meters)</label>
            <select v-model="form.pool_length"
              class="w-full bg-background text-primary rounded-lg px-4 py-3 border border-border focus:border-primary outline-none transition-colors">
              <option value="">Select pool length</option>
              <option :value="25">25m</option>
              <option :value="50">50m</option>
            </select>
          </div>

          <div>
            <label class="block text-secondary text-sm mb-2">Remarks</label>
            <input v-model="form.remarks" type="text" placeholder="Optional notes"
              class="w-full bg-background text-primary rounded-lg px-4 py-3 border border-border focus:border-primary outline-none transition-colors" />
          </div>

        </div>

        <div v-if="formError" class="mt-4 text-red-600 dark:text-red-400 text-sm font-medium">{{ formError }}</div>
        <div v-if="formSuccess" class="mt-4 text-green-600 dark:text-green-400 text-sm font-medium">Time log saved successfully!</div>

        <div class="flex justify-end gap-3 mt-8">
          <button
            @click="toggleForm"
            class="px-5 py-2.5 rounded-xl text-sm font-semibold text-secondary hover:text-primary hover:bg-surface-hover border border-transparent hover:border-border transition-colors"
          >
            Cancel
          </button>
          <button
            @click="saveTimeLog"
            :disabled="saving"
            class="bg-btn-primary hover:bg-btn-primary-hover disabled:opacity-50 text-btn-primary-text px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            {{ saving ? 'Saving...' : (form.id ? 'Update' : 'Save') }}
          </button>
        </div>
        </div>
      </div>

      <!-- Time Logs Table -->
      <div class="bg-surface rounded-2xl border border-border overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border text-secondary bg-surface-hover/50">
              <th class="text-left px-6 py-4 font-medium">Swimmer</th>
              <th class="text-left px-6 py-4 font-medium">Event</th>
              <th class="text-left px-6 py-4 font-medium">Time</th>
              <th class="text-left px-6 py-4 font-medium">Type</th>
              <th class="text-left px-6 py-4 font-medium">Pool</th>
              <th class="text-left px-6 py-4 font-medium">Date</th>
              <th class="text-left px-6 py-4 font-medium">Remarks</th>
              <th class="text-left px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="8" class="text-center text-secondary px-6 py-8">
                Loading...
              </td>
            </tr>
            <tr v-else-if="timeLogs.length === 0">
              <td colspan="8" class="text-center text-secondary px-6 py-8">
                No time logs yet. Add your first entry.
              </td>
            </tr>
            <tr
              v-else
              v-for="log in timeLogs"
              :key="log.id"
              class="border-b border-border hover:bg-surface-hover transition-colors last:border-0"
            >
              <td class="px-6 py-4 font-semibold text-primary">{{ log.swimmers?.full_name }}</td>
              <td class="px-6 py-4 text-secondary">{{ log.event }}</td>
              <td class="px-6 py-4 text-primary font-mono font-bold">{{ log.time_seconds }}s</td>
              <td class="px-6 py-4">
                <span class="bg-surface-hover border border-border text-secondary px-2.5 py-1 rounded-md text-xs font-medium">{{ log.log_type }}</span>
              </td>
              <td class="px-6 py-4 text-secondary">{{ log.pool_length }}m</td>
              <td class="px-6 py-4 text-secondary">{{ log.log_date }}</td>
              <td class="px-6 py-4 text-secondary">{{ log.remarks || '-' }}</td>
              <td class="px-6 py-4 flex gap-3">
                <button @click="editTimeLog(log)" class="text-primary hover:underline text-sm font-medium">Edit</button>
                <button @click="deleteTimeLog(log.id)" class="text-red-600 dark:text-red-400 hover:underline text-sm font-medium">Delete</button>
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
const timeLogs = ref([])
const isLoading = ref(true)
const showForm = ref(false)
const saving = ref(false)
const formError = ref('')
const formSuccess = ref(false)

const form = ref({
  id: null,
  swimmer_id: '',
  log_date: '',
  event: '',
  stroke: '',
  time_seconds: '',
  log_type: '',
  pool_length: '',
  remarks: ''
})

const resetForm = () => {
  form.value = {
    id: null, swimmer_id: '', log_date: '', event: '',
    stroke: '', time_seconds: '', log_type: '',
    pool_length: '', remarks: ''
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

const editTimeLog = (log) => {
  form.value = { ...log }
  showForm.value = true
}

const { show: showConfirm } = useConfirmModal()
const { finish: finishLoading } = useLoadingIndicator()

const deleteTimeLog = async (id) => {
  const confirmed = await showConfirm({
    title: 'Delete Time Log',
    message: 'Are you sure you want to delete this time log? This action cannot be undone.',
    confirmText: 'Delete',
    variant: 'danger',
  })
  if (!confirmed) return
  const { error } = await supabase.from('time_logs').delete().eq('id', id)
  if (error) {
    alert('Error deleting time log.')
  } else {
    await fetchTimeLogs()
  }
}

const fetchSwimmers = async () => {
  const { data } = await supabase
    .from('swimmers')
    .select('*')
    .order('full_name', { ascending: true })
  swimmers.value = data || []
}

const fetchTimeLogs = async () => {
  const { data } = await supabase
    .from('time_logs')
    .select('*, swimmers(full_name)')
    .order('log_date', { ascending: false })
  timeLogs.value = data || []
}

const saveTimeLog = async () => {
  formError.value = ''
  formSuccess.value = false

  if (!form.value.swimmer_id) {
    formError.value = 'Please select a swimmer.'
    return
  }
  if (!form.value.time_seconds) {
    formError.value = 'Time is required.'
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
    event: form.value.event || null,
    stroke: form.value.stroke || null,
    time_seconds: parseFloat(form.value.time_seconds),
    log_type: form.value.log_type || null,
    pool_length: form.value.pool_length || null,
    remarks: form.value.remarks || null,
  }

  let error;
  if (form.value.id) {
    const res = await supabase.from('time_logs').update(payload).eq('id', form.value.id)
    error = res.error
  } else {
    const res = await supabase.from('time_logs').insert(payload)
    error = res.error
  }

  saving.value = false

  if (error) {
    formError.value = 'Error saving time log. Try again.'
    return
  }

  formSuccess.value = true
  resetForm()

  await fetchTimeLogs()

  setTimeout(() => {
    showForm.value = false
    formSuccess.value = false
  }, 1500)
}

onMounted(async () => {
  await fetchSwimmers()
  await fetchTimeLogs()
  isLoading.value = false
  finishLoading()
})
</script>