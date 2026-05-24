<template>
  <div>
    <!-- Main content -->
    <div class="px-8 py-8 max-w-7xl mx-auto">

      <!-- Welcome -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-primary">Welcome back, Coach!</h2>
        <p class="text-secondary mt-1">Here is your team overview.</p>
      </div>

      <!-- Stats cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <div class="bg-surface rounded-2xl p-6 border border-border">
          <p class="text-secondary text-sm mb-1">Total Swimmers</p>
          <p class="text-4xl font-bold text-primary">{{ stats.swimmers }}</p>
        </div>

        <div class="bg-surface rounded-2xl p-6 border border-border">
          <p class="text-secondary text-sm mb-1">Time Logs Recorded</p>
          <p class="text-4xl font-bold text-primary">{{ stats.timeLogs }}</p>
        </div>

        <div class="bg-surface rounded-2xl p-6 border border-border">
          <p class="text-secondary text-sm mb-1">Predictions Made</p>
          <p class="text-4xl font-bold text-primary">{{ stats.predictions }}</p>
        </div>

      </div>

      <!-- Quick actions -->
      <div class="mb-10">
        <h3 class="text-lg font-semibold mb-4 text-primary">Quick Actions</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

          <NuxtLink to="/swimmers" class="bg-surface hover:bg-surface-hover border border-border rounded-xl p-5 transition-colors group flex flex-col">
            <p class="font-semibold text-primary group-hover:underline">Add Swimmer</p>
            <p class="text-secondary text-sm mt-1">Register a new athlete profile</p>
          </NuxtLink>

          <NuxtLink to="/logs/time" class="bg-surface hover:bg-surface-hover border border-border rounded-xl p-5 transition-colors group flex flex-col">
            <p class="font-semibold text-primary group-hover:underline">Log Time Trial</p>
            <p class="text-secondary text-sm mt-1">Record a new race or trial time</p>
          </NuxtLink>

          <NuxtLink to="/predictions" class="bg-surface hover:bg-surface-hover border border-border rounded-xl p-5 transition-colors group flex flex-col">
            <p class="font-semibold text-primary group-hover:underline">View Predictions</p>
            <p class="text-secondary text-sm mt-1">See AI forecasts for your swimmers</p>
          </NuxtLink>

        </div>
      </div>

      <!-- Recent time logs -->
      <div>
        <h3 class="text-lg font-semibold mb-4 text-primary">Recent Time Logs</h3>
        <div class="bg-surface rounded-2xl border border-border overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-border text-secondary bg-surface-hover/50">
                <th class="text-left px-6 py-4 font-medium">Swimmer</th>
                <th class="text-left px-6 py-4 font-medium">Event</th>
                <th class="text-left px-6 py-4 font-medium">Time</th>
                <th class="text-left px-6 py-4 font-medium">Type</th>
                <th class="text-left px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="recentLogs.length === 0">
                <td colspan="5" class="text-center text-secondary px-6 py-8">
                  No time logs yet. Add your first swimmer and log a time.
                </td>
              </tr>
              <tr
                v-for="log in recentLogs"
                :key="log.id"
                class="border-b border-border hover:bg-surface-hover transition-colors last:border-0"
              >
                <td class="px-6 py-4 text-primary font-medium">{{ log.swimmers?.full_name }}</td>
                <td class="px-6 py-4 text-secondary">{{ log.event }}</td>
                <td class="px-6 py-4 text-primary font-mono font-semibold">{{ log.time_seconds }}s</td>
                <td class="px-6 py-4">
                  <span class="bg-surface-hover text-secondary border border-border px-2.5 py-1 rounded-md text-xs font-medium">{{ log.log_type }}</span>
                </td>
                <td class="px-6 py-4 text-secondary">{{ log.log_date }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const supabase = useSupabase()

const stats = ref({
  swimmers: 0,
  timeLogs: 0,
  predictions: 0
})

const recentLogs = ref([])

const { finish: finishLoading } = useLoadingIndicator()

onMounted(async () => {
  // get swimmer count
  const { count: swimmerCount } = await supabase
    .from('swimmers')
    .select('*', { count: 'exact', head: true })

  // get time log count
  const { count: timeLogCount } = await supabase
    .from('time_logs')
    .select('*', { count: 'exact', head: true })

  // get prediction count
  const { count: predictionCount } = await supabase
    .from('predictions')
    .select('*', { count: 'exact', head: true })

  stats.value = {
    swimmers: swimmerCount || 0,
    timeLogs: timeLogCount || 0,
    predictions: predictionCount || 0
  }

  // get recent time logs
  const { data } = await supabase
    .from('time_logs')
    .select('*, swimmers(full_name)')
    .order('log_date', { ascending: false })
    .limit(5)

  recentLogs.value = data || []
  finishLoading()
})
</script>