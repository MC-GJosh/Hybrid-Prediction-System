<template>
  <div class="pb-16">
    <div class="px-8 py-8 max-w-7xl mx-auto">

      <!-- Header -->
      <div class="mb-8 flex justify-between items-end">
        <div>
          <h2 class="text-3xl font-bold text-primary">
            AI Race Predictions
          </h2>
          <p class="text-secondary mt-2">Generate forecasted swim times using historical training and competition logs.</p>
        </div>
        <button
          id="btn-open-generate-modal"
          @click="openModal"
          class="bg-btn-primary hover:bg-btn-primary-hover text-btn-primary-text px-5 py-2.5 rounded-xl font-semibold transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          <span>Generate Prediction</span>
        </button>
      </div>

      <!-- Overview Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div class="bg-surface rounded-2xl p-6 border border-border">
          <p class="text-secondary text-sm mb-1">Total Predictions</p>
          <p class="text-4xl font-bold text-primary">{{ predictions.length }}</p>
        </div>
        <div class="bg-surface rounded-2xl p-6 border border-border">
          <p class="text-secondary text-sm mb-1">High Confidence</p>
          <p class="text-4xl font-bold text-primary">{{ highConfidenceCount }}</p>
        </div>
        <div class="bg-surface rounded-2xl p-6 border border-border">
          <p class="text-secondary text-sm mb-1">Improving Trends</p>
          <p class="text-4xl font-bold text-primary">{{ improvingCount }}</p>
        </div>
      </div>

      <!-- Latest Result Panel (shown after generation) -->
      <transition name="slide-fade">
        <div v-if="latestResult" class="mb-10">
          <h3 class="text-lg font-semibold mb-4 flex items-center gap-2 text-primary">
            <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Latest Prediction Result
          </h3>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <!-- Prediction Card -->
            <div class="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-5">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-secondary text-sm">Swimmer</p>
                  <p class="text-xl font-bold text-primary">{{ latestResult.swimmer }}</p>
                </div>
                <span
                  :class="confidenceBadgeClass(latestResult.confidence)"
                  class="text-xs font-semibold px-3 py-1 rounded-full border border-border"
                >{{ latestResult.confidence }} Confidence</span>
              </div>

              <div class="flex items-center gap-2">
                <span class="bg-surface-hover text-secondary text-xs px-2.5 py-1 rounded-full border border-border">{{ latestResult.event }}</span>
                <span
                  :class="trendClass(latestResult.trend)"
                  class="text-xs px-2.5 py-1 rounded-full border border-border font-medium"
                >{{ trendIcon(latestResult.trend) }} {{ latestResult.trend }}</span>
              </div>

              <div class="grid grid-cols-3 gap-3">
                <div class="bg-surface-hover rounded-xl p-4 text-center border border-border">
                  <p class="text-secondary text-xs mb-1">Best Case</p>
                  <p class="text-primary font-mono font-bold text-lg">{{ formatTime(latestResult.best_case) }}</p>
                </div>
                <div class="bg-surface rounded-xl p-4 text-center border border-primary">
                  <p class="text-primary font-semibold text-xs mb-1">Predicted</p>
                  <p class="text-primary font-mono font-bold text-2xl">{{ formatTime(latestResult.predicted_time) }}</p>
                </div>
                <div class="bg-surface-hover rounded-xl p-4 text-center border border-border">
                  <p class="text-secondary text-xs mb-1">Worst Case</p>
                  <p class="text-primary font-mono font-bold text-lg">{{ formatTime(latestResult.worst_case) }}</p>
                </div>
              </div>

              <div class="text-center text-xs text-secondary">
                Based on {{ latestResult.data_points }} data point{{ latestResult.data_points !== 1 ? 's' : '' }}
              </div>
            </div>

            <!-- Chart -->
            <div class="bg-surface border border-border rounded-2xl p-6">
              <p class="text-secondary text-sm font-medium mb-4">Time Trajectory</p>
              <ClientOnly>
                <apexchart
                  v-if="chartOptions && chartSeries.length"
                  type="line"
                  height="220"
                  :options="chartOptions"
                  :series="chartSeries"
                />
                <div v-else class="flex items-center justify-center h-[220px] text-secondary text-sm">
                  No chart data available
                </div>
              </ClientOnly>
            </div>

          </div>

          <!-- Claude AI Feedback -->
          <div class="mt-6 bg-surface border border-border rounded-2xl p-6 relative overflow-hidden">

            <div class="flex items-start gap-4 relative">
              <div class="w-10 h-10 rounded-xl bg-surface-hover border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                </svg>
              </div>

              <div class="flex-1">
                <div class="flex items-center gap-2 mb-3">
                  <p class="text-primary font-semibold text-sm">Claude AI Coach Feedback</p>
                  <span v-if="isFetchingFeedback" class="flex items-center gap-1.5 text-xs text-secondary">
                    <svg class="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </span>
                </div>

                <p v-if="isFetchingFeedback" class="text-secondary text-sm italic">
                  Claude is reviewing the performance data...
                </p>
                <p v-else-if="latestFeedback" class="text-primary text-sm leading-relaxed">
                  {{ latestFeedback }}
                </p>
                <p v-else class="text-secondary text-sm italic">
                  Feedback unavailable — ensure the backend is running.
                </p>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Predictions Table -->
      <div class="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <div class="p-6 border-b border-border flex justify-between items-center bg-surface-hover/50">
          <h3 class="text-lg font-semibold text-primary">Recent Forecasts</h3>
        </div>

        <table class="w-full text-sm text-left">
          <thead class="text-secondary uppercase text-xs bg-surface-hover/30">
            <tr>
              <th class="px-6 py-4 font-medium">Swimmer</th>
              <th class="px-6 py-4 font-medium">Event</th>
              <th class="px-6 py-4 font-medium">Target Date</th>
              <th class="px-6 py-4 font-medium">Predicted Time</th>
              <th class="px-6 py-4 font-medium">Trend</th>
              <th class="px-6 py-4 font-medium">Confidence</th>
              <th class="px-6 py-4 font-medium">AI Feedback</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-if="loading" class="animate-pulse">
              <td colspan="7" class="px-6 py-8 text-center text-secondary">Loading predictions...</td>
            </tr>
            <tr v-else-if="predictions.length === 0">
              <td colspan="7" class="px-6 py-12 text-center">
                <div class="text-secondary mb-2">No predictions generated yet.</div>
                <button @click="openModal" class="text-primary underline text-sm font-medium">Generate your first one →</button>
              </td>
            </tr>
            <tr
              v-else
              v-for="pred in predictions"
              :key="pred.id"
              class="hover:bg-surface-hover transition-colors cursor-pointer"
              @click="viewPrediction(pred)"
            >
              <td class="px-6 py-4 font-medium text-primary">{{ pred.swimmers?.full_name || 'Unknown' }}</td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-hover text-secondary border border-border">
                  {{ pred.event }}
                </span>
              </td>
              <td class="px-6 py-4 text-secondary">{{ formatDate(pred.target_date) || '—' }}</td>
              <td class="px-6 py-4">
                <div class="text-primary font-mono font-bold text-base">{{ formatTime(pred.predicted_time) }}</div>
                <div class="text-xs text-secondary mt-1" v-if="pred.best_case">
                  Best: {{ formatTime(pred.best_case) }} · Worst: {{ formatTime(pred.worst_case) }}
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  v-if="pred.trend"
                  :class="trendClass(pred.trend)"
                  class="text-xs px-2 py-0.5 rounded-full border border-border font-medium"
                >{{ trendIcon(pred.trend) }} {{ pred.trend }}</span>
                <span v-else class="text-secondary">—</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <div class="w-full bg-border rounded-full h-1.5 max-w-[80px]">
                    <div
                      class="h-1.5 rounded-full transition-all bg-primary"
                      :style="{ width: getConfidenceWidth(pred.confidence) }"
                    ></div>
                  </div>
                  <span class="text-xs text-secondary font-medium">{{ pred.confidence || 'Medium' }}</span>
                </div>
              </td>
              <td class="px-6 py-4 max-w-xs">
                <p class="text-secondary text-xs leading-relaxed line-clamp-3">
                  {{ pred.feedback_text || '—' }}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <!-- Generate Modal -->
    <transition name="modal">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm dark:bg-black/60"
        @click.self="!isGenerating && closeModal()"
      >
        <div class="bg-surface border border-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">

          <div class="px-6 py-4 border-b border-border flex justify-between items-center">
            <h3 class="text-lg font-bold text-primary">Generate Prediction</h3>
            <button id="btn-close-modal" @click="!isGenerating && closeModal()" :disabled="isGenerating" :class="{ 'opacity-50 cursor-not-allowed': isGenerating }" class="text-secondary hover:text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="generatePrediction" class="p-6 space-y-4">

            <!-- Swimmer Select -->
            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Swimmer</label>
              <select
                id="select-swimmer"
                v-model="form.swimmer_id"
                required
                class="w-full bg-background border border-border rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-primary transition-colors"
              >
                <option value="" disabled>Select Swimmer</option>
                <option v-for="swimmer in swimmers" :key="swimmer.id" :value="swimmer.id">
                  {{ swimmer.full_name }}
                </option>
              </select>
            </div>

            <!-- Stroke & Distance Inputs -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-secondary text-sm font-medium mb-2">Stroke</label>
                <select
                  v-model="form.event_stroke"
                  required
                  class="w-full bg-background border border-border rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="" disabled>Select Stroke</option>
                  <option>Freestyle</option>
                  <option>Breaststroke</option>
                  <option>Backstroke</option>
                  <option>Butterfly</option>
                  <option>Individual Medley (IM)</option>
                </select>
              </div>

              <div>
                <label class="block text-secondary text-sm font-medium mb-2">Distance</label>
                <select
                  v-model="form.distance"
                  required
                  :disabled="!form.event_stroke"
                  class="w-full bg-background border border-border rounded-xl px-4 py-3 text-primary disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="" disabled>{{ form.event_stroke ? 'Select Distance' : 'Select Stroke First' }}</option>
                  <option v-for="d in availableDistances" :key="d" :value="d">{{ d }}</option>
                </select>
              </div>
            </div>

            <!-- Target Date -->
            <div>
              <label class="block text-secondary text-sm font-medium mb-2">Target Date <span class="text-secondary opacity-70">(Optional)</span></label>
              <input
                id="input-target-date"
                v-model="form.target_date"
                type="date"
                class="w-full bg-background border border-border rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-primary transition-colors cursor-pointer"
              />
            </div>

            <!-- Error -->
            <div v-if="generateError" class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50 rounded-xl px-4 py-3 text-sm text-red-600 dark:text-red-300">
              {{ generateError }}
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-3 pt-2">
              <button type="button" @click="!isGenerating && closeModal()" :disabled="isGenerating" class="px-4 py-2 text-sm text-secondary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>
              <button
                id="btn-generate-submit"
                type="submit"
                :disabled="isGenerating"
                class="bg-btn-primary hover:bg-btn-primary-hover text-btn-primary-text disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2"
              >
                <svg v-if="isGenerating" class="animate-spin h-4 w-4 text-btn-primary-text" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ isGenerating ? 'Analyzing...' : 'Generate' }}</span>
              </button>
            </div>

          </form>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  middleware: 'auth'
})

const { logout } = useAuth()
const supabase = useSupabase()
const router = useRouter()
const { isDark } = useTheme()

// ── State ──────────────────────────────────────────────────────────────────────
const loading = ref(true)
const predictions = ref([])
const swimmers = ref([])

const isModalOpen = ref(false)
const isGenerating = ref(false)
const generateError = ref('')

const latestResult = ref(null)
const latestFeedback = ref('')
const isFetchingFeedback = ref(false)

const chartSeries = ref([])
const chartOptions = ref(null)

const form = ref({
  swimmer_id: '',
  event_stroke: '',
  distance: '',
  target_date: ''
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

// ── Auth ───────────────────────────────────────────────────────────────────────
const handleLogout = async () => {
  await logout()
  router.push('/login')
}

// ── Modal ──────────────────────────────────────────────────────────────────────
const openModal = () => {
  generateError.value = ''
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  form.value = { swimmer_id: '', event_stroke: '', distance: '', target_date: '' }
  generateError.value = ''
}

// ── Data Fetching ──────────────────────────────────────────────────────────────
const fetchPredictions = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('predictions')
      .select(`
        *,
        swimmers(full_name),
        ai_feedback(feedback_text)
      `)
      .order('created_at', { ascending: false })
    if (error) throw error

    predictions.value = data.map(pred => ({
      ...pred,
      feedback_text: pred.ai_feedback?.[0]?.feedback_text || null
    }))
  } catch (e) {
    console.error('Error fetching predictions:', e)
  } finally {
    loading.value = false
  }
}

const fetchSwimmers = async () => {
  try {
    const { data, error } = await supabase
      .from('swimmers')
      .select('id, full_name, main_event, target_time, personal_best')
      .order('full_name')
    if (error) throw error
    swimmers.value = data || []
  } catch (e) {
    console.error('Error fetching swimmers:', e)
  }
}

const fetchHistoricalLogs = async (swimmerId, event) => {
  try {
    const { data, error } = await supabase
      .from('time_logs')
      .select('log_date, time_seconds')
      .eq('swimmer_id', swimmerId)
      .eq('event', event)
      .order('log_date', { ascending: true })
    if (error) throw error
    return data || []
  } catch {
    return []
  }
}

const fetchFeedbackForPrediction = async (predictionId) => {
  const { data } = await supabase
    .from('ai_feedback')
    .select('feedback_text')
    .eq('prediction_id', predictionId)
    .limit(1)
  return data?.[0]?.feedback_text || null
}

// ── Chart Builder ──────────────────────────────────────────────────────────────
const buildChart = (historicalLogs, prediction) => {
  const histPoints = historicalLogs.map(l => ({
    x: new Date(l.log_date).getTime(),
    y: parseFloat(l.time_seconds)
  }))

  const lastHistDate = histPoints.length
    ? histPoints[histPoints.length - 1].x
    : Date.now()

  // Spread predicted points across time
  const day = 24 * 60 * 60 * 1000
  const worstDate  = lastHistDate + 20 * day  // 20 days → worst case
  const predDate   = lastHistDate + 30 * day  // 30 days → predicted
  const bestDate   = lastHistDate + 45 * day  // 45 days → best case

  // Connect last historical point to predictions
  const lastHistPoint = histPoints.length > 0 ? histPoints[histPoints.length - 1] : { x: lastHistDate, y: prediction.predicted_time }

  chartSeries.value = [
    {
      name: 'Historical Times',
      data: histPoints,
      zIndex: 5
    },
    {
      name: 'Predicted (Worst)',
      data: [
        { x: lastHistPoint.x, y: lastHistPoint.y },
        { x: worstDate, y: prediction.worst_case }
      ]
    },
    {
      name: 'Predicted',
      data: [
        { x: lastHistPoint.x, y: lastHistPoint.y },
        { x: predDate, y: prediction.predicted_time }
      ]
    },
    {
      name: 'Predicted (Best)',
      data: [
        { x: lastHistPoint.x, y: lastHistPoint.y },
        { x: bestDate, y: prediction.best_case }
      ]
    }
  ]

  const textColor = isDark.value ? '#9ca3af' : '#6b7280'
  const gridColor = isDark.value ? '#1f2937' : '#e5e7eb'

  chartOptions.value = {
    chart: {
      background: 'transparent',
      toolbar: { show: false },
      animations: { enabled: true, easing: 'easeinout', speed: 800 }
    },
    theme: { mode: isDark.value ? 'dark' : 'light' },
    grid: {
      borderColor: gridColor,
      strokeDashArray: 4
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: { colors: textColor, fontSize: '11px' },
        datetimeUTC: false
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: { colors: textColor, fontSize: '11px' },
        formatter: (v) => `${v.toFixed(2)}s`
      },
      reversed: true
    },
    stroke: {
      curve: 'smooth',
      width: [2.5, 1.5, 2, 1.5],
      dashArray: [0, 6, 4, 6]
    },
    colors: ['#60a5fa', '#f97316', '#a78bfa', '#22c55e'],
    markers: {
      size: [4, 6, 6, 8],
      hover: { size: 9 }
    },
    annotations: {
      xaxis: prediction.target_date ? [
        {
          x: new Date(prediction.target_date).getTime(),
          borderColor: '#ef4444',
          strokeDashArray: 4,
          label: {
            text: 'Race Day',
            style: {
              color: '#fff',
              background: '#ef4444',
              fontSize: '11px'
            }
          }
        }
      ] : [],
      points: [
        {
          x: bestDate,
          y: prediction.best_case,
          marker: {
            size: 8,
            fillColor: '#22c55e',
            strokeColor: '#fff',
            strokeWidth: 2,
          },
          label: {
            text: `Best ${prediction.best_case}s`,
            style: {
              color: '#fff',
              background: '#22c55e',
              fontSize: '11px',
              padding: { left: 6, right: 6, top: 3, bottom: 3 }
            }
          }
        },
        {
          x: predDate,
          y: prediction.predicted_time,
          marker: {
            size: 8,
            fillColor: '#a78bfa',
            strokeColor: '#fff',
            strokeWidth: 2,
          },
          label: {
            text: `Predicted ${prediction.predicted_time}s`,
            style: {
              color: '#fff',
              background: '#a78bfa',
              fontSize: '11px',
              padding: { left: 6, right: 6, top: 3, bottom: 3 }
            }
          }
        },
        {
          x: worstDate,
          y: prediction.worst_case,
          marker: {
            size: 8,
            fillColor: '#f97316',
            strokeColor: '#fff',
            strokeWidth: 2,
          },
          label: {
            text: `Worst ${prediction.worst_case}s`,
            style: {
              color: '#fff',
              background: '#f97316',
              fontSize: '11px',
              padding: { left: 6, right: 6, top: 3, bottom: 3 }
            }
          }
        }
      ]
    },
    legend: {
      labels: { colors: textColor },
      fontSize: '12px'
    },
    tooltip: {
      theme: isDark.value ? 'dark' : 'light',
      x: { format: 'dd MMM yyyy' },
      y: { formatter: (v) => `${v.toFixed(2)}s` }
    }
  }
}

watch(isDark, () => {
  if (latestResult.value && chartOptions.value) {
    const textColor = isDark.value ? '#9ca3af' : '#6b7280'
    const gridColor = isDark.value ? '#1f2937' : '#e5e7eb'
    chartOptions.value = {
      ...chartOptions.value,
      theme: { mode: isDark.value ? 'dark' : 'light' },
      grid: { ...chartOptions.value.grid, borderColor: gridColor },
      xaxis: { ...chartOptions.value.xaxis, labels: { style: { colors: textColor, fontSize: '11px' } } },
      yaxis: { ...chartOptions.value.yaxis, labels: { style: { colors: textColor, fontSize: '11px' } } },
      legend: { ...chartOptions.value.legend, labels: { colors: textColor } },
      colors: ['#60a5fa', '#f97316', '#a78bfa', '#22c55e']
    }
  }
})

// ── Generate Prediction ────────────────────────────────────────────────────────
const generatePrediction = async () => {
  if (!form.value.swimmer_id || !form.value.event_stroke || !form.value.distance) return
  
  const currentSwimmerId = form.value.swimmer_id
  const currentTargetDate = form.value.target_date
  const eventName = `${form.value.distance} ${form.value.event_stroke}`

  isGenerating.value = true
  generateError.value = ''
  latestResult.value = null
  latestFeedback.value = ''

  try {
    const predResponse = await $fetch('/api/prediction', {
      method: 'POST',
      body: { swimmer_id: currentSwimmerId, event: eventName }
    })

    if (predResponse.error) {
      generateError.value = predResponse.error
      return
    }

    const swimmerName = swimmers.value.find(s => s.id === currentSwimmerId)?.full_name || 'Swimmer'

    latestResult.value = {
      swimmer: predResponse.swimmer || swimmerName,
      event: eventName,
      predicted_time: predResponse.predicted_time,
      best_case: predResponse.best_case,
      worst_case: predResponse.worst_case,
      trend: predResponse.trend,
      confidence: predResponse.confidence,
      data_points: predResponse.data_points || 0,
      recent_delta: predResponse.recent_delta,
      std_deviation: predResponse.std_deviation,
      target_date: currentTargetDate
    }

    const logs = await fetchHistoricalLogs(currentSwimmerId, eventName)
    buildChart(logs, latestResult.value)

    const insertData = {
      swimmer_id: currentSwimmerId,
      prediction_date: new Date().toISOString().split('T')[0],
      target_date: currentTargetDate || null,
      event: eventName,
      predicted_time: predResponse.predicted_time,
      best_case: predResponse.best_case,
      worst_case: predResponse.worst_case,
      confidence: predResponse.confidence,
      trend: predResponse.trend
    }
  
    const { data: insertedPred, error: insertError } = await supabase.from('predictions').insert(insertData).select()
    if (insertError) console.warn('Supabase insert warning:', insertError.message)
    const newPredictionId = insertedPred?.[0]?.id

    await fetchPredictions()
    closeModal()

    isFetchingFeedback.value = true

    // Fetch training logs for this swimmer
    const { data: trainingData } = await supabase
      .from('training_logs')
      .select('fatigue_score, sleep_hours, attendance, volume_meters')
      .eq('swimmer_id', currentSwimmerId)
      .order('log_date', { ascending: false })
      .limit(10)

    // Calculate averages
    let avg_fatigue = null
    let avg_sleep = null
    let avg_volume = null
    let attendance_rate = null

    if (trainingData && trainingData.length > 0) {
      const fatigueScores = trainingData
        .filter(t => t.fatigue_score)
        .map(t => t.fatigue_score)
      const sleepHours = trainingData
        .filter(t => t.sleep_hours)
        .map(t => t.sleep_hours)
      const volumes = trainingData
        .filter(t => t.volume_meters)
        .map(t => t.volume_meters)
      const presentCount = trainingData
        .filter(t => t.attendance === 'Present').length

      if (fatigueScores.length)
        avg_fatigue = parseFloat((fatigueScores.reduce((a,b) => a+b,0) / fatigueScores.length).toFixed(1))
      if (sleepHours.length)
        avg_sleep = parseFloat((sleepHours.reduce((a,b) => a+b,0) / sleepHours.length).toFixed(1))
      if (volumes.length)
        avg_volume = parseFloat((volumes.reduce((a,b) => a+b,0) / volumes.length).toFixed(0))
      attendance_rate = parseFloat(((presentCount / trainingData.length) * 100).toFixed(0))
    }

    // Get swimmer's target time
    const swimmer = swimmers.value.find(s => s.id === currentSwimmerId)

    const feedbackResponse = await $fetch('/api/feedback', {
      method: 'POST',
      body: {
        swimmer_name: latestResult.value.swimmer,
        event: eventName,
        predicted_time: predResponse.predicted_time,
        best_case: predResponse.best_case,
        worst_case: predResponse.worst_case,
        trend: predResponse.trend,
        confidence: predResponse.confidence,
        data_points: predResponse.data_points || 0,
        avg_fatigue,
        avg_sleep,
        avg_volume,
        attendance_rate,
        target_time: swimmer?.target_time || null,
        target_date: currentTargetDate || null,
        personal_best: swimmer?.personal_best || null,
        recent_delta: predResponse.recent_delta,
        std_deviation: predResponse.std_deviation
      }
    })
    latestFeedback.value = feedbackResponse?.feedback || ''

    // Save feedback to Supabase
    if (feedbackResponse?.feedback && newPredictionId) {
      const { error: fbError } = await supabase.from('ai_feedback').insert({
        swimmer_id: currentSwimmerId,
        prediction_id: newPredictionId,
        feedback_text: feedbackResponse.feedback
      })
      if (fbError) console.error('Supabase feedback insert error:', fbError.message)
      
      // Refresh table so the new feedback text appears in the row
      await fetchPredictions()
    }

  } catch (err) {
    console.error('Generate failed:', err)
    generateError.value = err?.data?.statusMessage || 'Failed to generate prediction. Is the backend running?'
  } finally {
    isGenerating.value = false
    isFetchingFeedback.value = false
  }
}

// ── View Prediction ────────────────────────────────────────────────────────────
const viewPrediction = async (pred) => {
  latestResult.value = {
    swimmer: pred.swimmers?.full_name || 'Unknown',
    event: pred.event,
    predicted_time: pred.predicted_time,
    best_case: pred.best_case,
    worst_case: pred.worst_case,
    trend: pred.trend,
    confidence: pred.confidence,
    data_points: pred.data_points || 0,
    recent_delta: pred.recent_delta || null,
    std_deviation: pred.std_deviation || null,
    target_date: pred.target_date
  }

  latestFeedback.value = pred.feedback_text 
    || await fetchFeedbackForPrediction(pred.id) 
    || 'No feedback generated for this prediction.'

  const logs = await fetchHistoricalLogs(pred.swimmer_id, pred.event)
  buildChart(logs, latestResult.value)

  if (process.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// ── Computed ───────────────────────────────────────────────────────────────────
const highConfidenceCount = computed(() =>
  predictions.value.filter(p => p.confidence?.toLowerCase() === 'high').length
)

const improvingCount = computed(() =>
  predictions.value.filter(p => p.trend?.toLowerCase() === 'improving').length
)

// ── Formatters ─────────────────────────────────────────────────────────────────
const formatDate = (dateString) => {
  if (!dateString) return ''
  const d = new Date(dateString)
  return isNaN(d.getTime()) ? dateString : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

const formatTime = (t) => {
  if (t == null) return '—'
  return `${Number(t).toFixed(2)}s`
}

const getConfidenceWidth = (c) => {
  const conf = (c || '').toLowerCase()
  if (conf === 'high') return '100%'
  if (conf === 'medium') return '60%'
  return '30%'
}

const confidenceBadgeClass = (c) => {
  const conf = (c || '').toLowerCase()
  if (conf === 'high') return 'text-primary bg-surface-hover'
  if (conf === 'medium') return 'text-secondary bg-background'
  return 'text-secondary bg-background'
}

const trendClass = (t) => {
  const trend = (t || '').toLowerCase()
  if (trend === 'improving') return 'text-primary bg-surface-hover'
  if (trend === 'declining') return 'text-secondary bg-background'
  return 'text-secondary bg-background'
}

const trendIcon = (t) => {
  const trend = (t || '').toLowerCase()
  if (trend === 'improving') return '↓'
  if (trend === 'declining') return '↑'
  return '→'
}

// ── Lifecycle ──────────────────────────────────────────────────────────────────
const { finish: finishLoading } = useLoadingIndicator()

onMounted(async () => {
  await Promise.all([fetchSwimmers(), fetchPredictions()])
  finishLoading()
})
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.4s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.25s ease-in;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-16px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.modal-enter-active {
  transition: all 0.25s ease-out;
}
.modal-leave-active {
  transition: all 0.2s ease-in;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>