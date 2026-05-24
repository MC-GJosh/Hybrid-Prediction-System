<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-32">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
    </div>

    <!-- Not Found -->
    <div v-else-if="!swimmer" class="flex flex-col items-center justify-center py-32">
      <p class="text-secondary text-lg mb-4">Swimmer not found.</p>
      <NuxtLink to="/swimmers" class="text-primary hover:underline text-sm">← Back to Swimmers</NuxtLink>
    </div>

    <!-- Profile Content -->
    <div v-else class="px-8 py-8 max-w-7xl mx-auto">

      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-4">
          <NuxtLink to="/swimmers" class="text-secondary hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </NuxtLink>
          <div>
            <h2 class="text-2xl font-bold text-primary">{{ swimmer.full_name }}</h2>
            <div class="flex items-center gap-3 mt-1">
              <span v-if="swimmer.age" class="text-secondary text-sm">{{ swimmer.age }} yrs old</span>
              <span v-if="swimmer.age && swimmer.gender" class="text-secondary opacity-50">•</span>
              <span v-if="swimmer.gender" class="text-secondary text-sm">{{ swimmer.gender }}</span>
            </div>
          </div>
        </div>
        <button
          @click="openEditProfile"
          class="flex items-center gap-2 bg-btn-primary hover:bg-btn-primary-hover text-btn-primary-text px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Edit Profile
        </button>
      </div>

      <!-- Quick Stats (click any card to edit inline) -->
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">

        <!-- Main Stroke -->
        <div
          class="group bg-surface border rounded-2xl p-5 transition-all cursor-pointer"
          :class="editingField === 'main_stroke' ? 'border-primary' : 'border-border hover:border-primary'"
          @click="editingField !== 'main_stroke' && startEdit('main_stroke', swimmer.main_stroke)"
        >
          <div class="flex items-center justify-between mb-2">
            <p class="text-secondary text-xs uppercase tracking-wider">Main Stroke</p>
            <svg v-if="editingField !== 'main_stroke'" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-secondary group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <div v-if="editingField === 'main_stroke'" @click.stop>
            <select v-model="editValue" class="w-full bg-background text-primary rounded-lg px-2 py-1.5 border border-primary outline-none text-sm mb-2 transition-colors">
              <option value="">—</option>
              <option>Freestyle</option>
              <option>Breaststroke</option>
              <option>Backstroke</option>
              <option>Butterfly</option>
              <option>IM</option>
            </select>
            <div class="flex gap-2">
              <button @click="saveField('main_stroke')" class="flex-1 bg-btn-primary hover:bg-btn-primary-hover text-btn-primary-text text-xs py-1 rounded-lg font-semibold transition-colors">✓ Save</button>
              <button @click="cancelEdit" class="flex-1 bg-surface-hover hover:bg-border text-primary text-xs py-1 rounded-lg transition-colors border border-border">✗</button>
            </div>
          </div>
          <p v-else class="text-primary text-lg font-bold">{{ swimmer.main_stroke || '—' }}</p>
        </div>

        <!-- Main Event -->
        <div
          class="group bg-surface border rounded-2xl p-5 transition-all cursor-pointer"
          :class="editingField === 'main_event' ? 'border-primary' : 'border-border hover:border-primary'"
          @click="editingField !== 'main_event' && startEdit('main_event', swimmer.main_event)"
        >
          <div class="flex items-center justify-between mb-2">
            <p class="text-secondary text-xs uppercase tracking-wider">Main Event</p>
            <svg v-if="editingField !== 'main_event'" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-secondary group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <div v-if="editingField === 'main_event'" @click.stop>
            <select v-model="editValue" class="w-full bg-background text-primary rounded-lg px-2 py-1.5 border border-primary outline-none text-sm mb-2 transition-colors">
              <option value="">— None —</option>
              <option>50m</option>
              <option>100m</option>
              <option>200m</option>
              <option>400m</option>
              <option>800m</option>
              <option>1500m</option>
            </select>
            <div class="flex gap-2">
              <button @click="saveField('main_event')" class="flex-1 bg-btn-primary hover:bg-btn-primary-hover text-btn-primary-text text-xs py-1 rounded-lg font-semibold transition-colors">✓ Save</button>
              <button @click="cancelEdit" class="flex-1 bg-surface-hover hover:bg-border text-primary text-xs py-1 rounded-lg transition-colors border border-border">✗</button>
            </div>
          </div>
          <p v-else class="text-primary text-lg font-bold">{{ swimmer.main_event || '—' }}</p>
        </div>

        <!-- Personal Best -->
        <div
          class="group bg-surface border rounded-2xl p-5 transition-all cursor-pointer"
          :class="editingField === 'personal_best' ? 'border-primary' : 'border-border hover:border-primary'"
          @click="editingField !== 'personal_best' && startEdit('personal_best', swimmer.personal_best)"
        >
          <div class="flex items-center justify-between mb-2">
            <p class="text-secondary text-xs uppercase tracking-wider">Personal Best</p>
            <svg v-if="editingField !== 'personal_best'" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-secondary group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <div v-if="editingField === 'personal_best'" @click.stop>
            <input v-model="editValue" type="number" step="0.01" placeholder="34.20" class="w-full bg-background text-primary rounded-lg px-2 py-1.5 border border-primary outline-none text-sm mb-2 transition-colors" @keyup.enter="saveField('personal_best')" @keyup.esc="cancelEdit" />
            <div class="flex gap-2">
              <button @click="saveField('personal_best')" class="flex-1 bg-btn-primary hover:bg-btn-primary-hover text-btn-primary-text text-xs py-1 rounded-lg font-semibold transition-colors">✓ Save</button>
              <button @click="cancelEdit" class="flex-1 bg-surface-hover hover:bg-border text-primary text-xs py-1 rounded-lg transition-colors border border-border">✗</button>
            </div>
          </div>
          <p v-else class="text-primary text-lg font-bold font-mono">{{ swimmer.personal_best ? swimmer.personal_best + 's' : '—' }}</p>
        </div>

        <!-- Height -->
        <div
          class="group bg-surface border rounded-2xl p-5 transition-all cursor-pointer"
          :class="editingField === 'height_cm' ? 'border-primary' : 'border-border hover:border-primary'"
          @click="editingField !== 'height_cm' && startEdit('height_cm', swimmer.height_cm)"
        >
          <div class="flex items-center justify-between mb-2">
            <p class="text-secondary text-xs uppercase tracking-wider">Height</p>
            <svg v-if="editingField !== 'height_cm'" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-secondary group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <div v-if="editingField === 'height_cm'" @click.stop>
            <input v-model="editValue" type="number" placeholder="170" class="w-full bg-background text-primary rounded-lg px-2 py-1.5 border border-primary outline-none text-sm mb-2 transition-colors" @keyup.enter="saveField('height_cm')" @keyup.esc="cancelEdit" />
            <div class="flex gap-2">
              <button @click="saveField('height_cm')" class="flex-1 bg-btn-primary hover:bg-btn-primary-hover text-btn-primary-text text-xs py-1 rounded-lg font-semibold transition-colors">✓ Save</button>
              <button @click="cancelEdit" class="flex-1 bg-surface-hover hover:bg-border text-primary text-xs py-1 rounded-lg transition-colors border border-border">✗</button>
            </div>
          </div>
          <p v-else class="text-primary text-lg font-bold">{{ swimmer.height_cm ? swimmer.height_cm + ' cm' : '—' }}</p>
        </div>

        <!-- Weight -->
        <div
          class="group bg-surface border rounded-2xl p-5 transition-all cursor-pointer"
          :class="editingField === 'weight_kg' ? 'border-primary' : 'border-border hover:border-primary'"
          @click="editingField !== 'weight_kg' && startEdit('weight_kg', swimmer.weight_kg)"
        >
          <div class="flex items-center justify-between mb-2">
            <p class="text-secondary text-xs uppercase tracking-wider">Weight</p>
            <svg v-if="editingField !== 'weight_kg'" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-secondary group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <div v-if="editingField === 'weight_kg'" @click.stop>
            <input v-model="editValue" type="number" placeholder="65" class="w-full bg-background text-primary rounded-lg px-2 py-1.5 border border-primary outline-none text-sm mb-2 transition-colors" @keyup.enter="saveField('weight_kg')" @keyup.esc="cancelEdit" />
            <div class="flex gap-2">
              <button @click="saveField('weight_kg')" class="flex-1 bg-btn-primary hover:bg-btn-primary-hover text-btn-primary-text text-xs py-1 rounded-lg font-semibold transition-colors">✓ Save</button>
              <button @click="cancelEdit" class="flex-1 bg-surface-hover hover:bg-border text-primary text-xs py-1 rounded-lg transition-colors border border-border">✗</button>
            </div>
          </div>
          <p v-else class="text-primary text-lg font-bold">{{ swimmer.weight_kg ? swimmer.weight_kg + ' kg' : '—' }}</p>
        </div>

      </div>

      <!-- Summary Row -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="bg-surface border border-border rounded-2xl p-5 flex items-center gap-4">
          <div class="bg-surface-hover border border-border rounded-xl p-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-secondary text-xs uppercase tracking-wider">Total Time Logs</p>
            <p class="text-primary text-xl font-bold">{{ timeLogs.length }}</p>
          </div>
        </div>
        <div class="bg-surface border border-border rounded-2xl p-5 flex items-center gap-4">
          <div class="bg-surface-hover border border-border rounded-xl p-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <p class="text-secondary text-xs uppercase tracking-wider">Training Sessions</p>
            <p class="text-primary text-xl font-bold">{{ trainingLogs.length }}</p>
          </div>
        </div>
        <div class="bg-surface border border-border rounded-2xl p-5 flex items-center gap-4">
          <div class="bg-surface-hover border border-border rounded-xl p-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <p class="text-secondary text-xs uppercase tracking-wider">Avg Fatigue</p>
            <p class="text-primary text-xl font-bold">{{ avgFatigue }}</p>
          </div>
        </div>
      </div>

      <!-- Two Column: Time Logs + Training Logs -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- Time Logs -->
        <div class="bg-surface rounded-2xl border border-border overflow-hidden">
          <div class="px-6 py-4 border-b border-border flex items-center justify-between">
            <h3 class="font-semibold text-primary">Time Logs</h3>
            <button
              @click="openAddTimeLog"
              class="flex items-center gap-1.5 bg-btn-primary hover:bg-btn-primary-hover text-btn-primary-text px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add
            </button>
          </div>
          <div v-if="timeLogs.length === 0" class="px-6 py-12 text-center text-secondary text-sm">
            No time logs recorded yet.
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-border text-secondary bg-surface-hover/30">
                  <th class="text-left px-6 py-3 text-xs uppercase tracking-wider font-medium">Date</th>
                  <th class="text-left px-6 py-3 text-xs uppercase tracking-wider font-medium">Event</th>
                  <th class="text-left px-6 py-3 text-xs uppercase tracking-wider font-medium">Time</th>
                  <th class="text-left px-6 py-3 text-xs uppercase tracking-wider font-medium">Type</th>
                  <th class="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="log in timeLogs"
                  :key="log.id"
                  class="border-b border-border hover:bg-surface-hover transition-colors last:border-0"
                >
                  <td class="px-6 py-3 text-secondary whitespace-nowrap text-xs">{{ log.log_date }}</td>
                  <td class="px-6 py-3 text-secondary text-xs">{{ log.event || '—' }}</td>
                  <td class="px-6 py-3 text-primary font-mono font-bold text-xs">{{ log.time_seconds }}s</td>
                  <td class="px-6 py-3">
                    <span class="bg-surface-hover text-secondary border border-border px-2 py-0.5 rounded-md text-xs font-semibold">
                      {{ log.log_type || '—' }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-2">
                      <button @click="openEditTimeLog(log)" class="text-secondary hover:text-primary transition-colors" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button @click="deleteTimeLog(log.id)" class="text-secondary hover:text-red-500 transition-colors" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Training Logs -->
        <div class="bg-surface rounded-2xl border border-border overflow-hidden">
          <div class="px-6 py-4 border-b border-border flex items-center justify-between">
            <h3 class="font-semibold text-primary">Training Logs</h3>
            <button
              @click="openAddTrainingLog"
              class="flex items-center gap-1.5 bg-btn-primary hover:bg-btn-primary-hover text-btn-primary-text px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add
            </button>
          </div>
          <div v-if="trainingLogs.length === 0" class="px-6 py-12 text-center text-secondary text-sm">
            No training logs recorded yet.
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-border text-secondary bg-surface-hover/30">
                  <th class="text-left px-6 py-3 text-xs uppercase tracking-wider font-medium">Date</th>
                  <th class="text-left px-6 py-3 text-xs uppercase tracking-wider font-medium">Status</th>
                  <th class="text-left px-6 py-3 text-xs uppercase tracking-wider font-medium">Volume</th>
                  <th class="text-left px-6 py-3 text-xs uppercase tracking-wider font-medium">Fatigue</th>
                  <th class="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="log in trainingLogs"
                  :key="log.id"
                  class="border-b border-border hover:bg-surface-hover transition-colors last:border-0"
                >
                  <td class="px-6 py-3 text-secondary whitespace-nowrap text-xs">{{ log.log_date }}</td>
                  <td class="px-6 py-3">
                    <span
                      :class="{
                        'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400': log.attendance === 'Present',
                        'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400': log.attendance === 'Absent',
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400': log.attendance === 'Sick',
                        'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-400': log.attendance === 'Injured',
                      }"
                      class="px-2 py-0.5 rounded-md text-xs font-semibold"
                    >{{ log.attendance || '—' }}</span>
                  </td>
                  <td class="px-6 py-3 text-primary font-mono text-xs">
                    {{ log.volume_meters ? log.volume_meters + 'm' : '—' }}
                  </td>
                  <td class="px-6 py-3 text-xs font-bold text-primary">
                    <span
                      v-if="log.fatigue_score"
                    >{{ log.fatigue_score }}/10</span>
                    <span v-else class="text-secondary">—</span>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-2">
                      <button @click="openEditTrainingLog(log)" class="text-secondary hover:text-primary transition-colors" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button @click="deleteTrainingLog(log.id)" class="text-secondary hover:text-red-500 transition-colors" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>

    <!-- ===================== MODALS ===================== -->

    <!-- Edit Profile Modal -->
    <div v-if="showProfileModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm dark:bg-black/60 flex items-center justify-center z-50 p-4">
      <div class="bg-surface border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div class="flex items-center justify-between px-6 py-5 border-b border-border bg-surface-hover/50">
          <h3 class="font-semibold text-lg text-primary">Edit Profile</h3>
          <button @click="showProfileModal = false" class="text-secondary hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="px-6 py-5 grid grid-cols-2 gap-4">
          <div class="col-span-2">
            <label class="block text-secondary text-xs mb-1.5">Full Name</label>
            <input v-model="profileForm.full_name" type="text" class="w-full bg-background text-primary rounded-lg px-4 py-2.5 border border-border focus:border-primary outline-none text-sm transition-colors" />
          </div>
          <div>
            <label class="block text-secondary text-xs mb-1.5">Age</label>
            <input v-model="profileForm.age" type="number" class="w-full bg-background text-primary rounded-lg px-4 py-2.5 border border-border focus:border-primary outline-none text-sm transition-colors" />
          </div>
          <div>
            <label class="block text-secondary text-xs mb-1.5">Gender</label>
            <select v-model="profileForm.gender" class="w-full bg-background text-primary rounded-lg px-4 py-2.5 border border-border focus:border-primary outline-none text-sm transition-colors">
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
          <div>
            <label class="block text-secondary text-xs mb-1.5">Main Stroke</label>
            <select v-model="profileForm.main_stroke" class="w-full bg-background text-primary rounded-lg px-4 py-2.5 border border-border focus:border-primary outline-none text-sm transition-colors">
              <option value="">Select</option>
              <option>Freestyle</option>
              <option>Breaststroke</option>
              <option>Backstroke</option>
              <option>Butterfly</option>
              <option>IM</option>
            </select>
          </div>
          <div>
            <label class="block text-secondary text-xs mb-1.5">Main Event</label>
            <select v-model="profileForm.main_event" class="w-full bg-background text-primary rounded-lg px-4 py-2.5 border border-border focus:border-primary outline-none text-sm transition-colors">
              <option value="">— None —</option>
              <option>50m</option>
              <option>100m</option>
              <option>200m</option>
              <option>400m</option>
              <option>800m</option>
              <option>1500m</option>
            </select>
          </div>
          <div>
            <label class="block text-secondary text-xs mb-1.5">Personal Best (s)</label>
            <input v-model="profileForm.personal_best" type="number" step="0.01" class="w-full bg-background text-primary rounded-lg px-4 py-2.5 border border-border focus:border-primary outline-none text-sm transition-colors" />
          </div>
          <div>
            <label class="block text-secondary text-xs mb-1.5">Height (cm)</label>
            <input v-model="profileForm.height_cm" type="number" class="w-full bg-background text-primary rounded-lg px-4 py-2.5 border border-border focus:border-primary outline-none text-sm transition-colors" />
          </div>
          <div>
            <label class="block text-secondary text-xs mb-1.5">Weight (kg)</label>
            <input v-model="profileForm.weight_kg" type="number" class="w-full bg-background text-primary rounded-lg px-4 py-2.5 border border-border focus:border-primary outline-none text-sm transition-colors" />
          </div>
        </div>
        <div class="px-6 pb-5 flex justify-end gap-3">
          <button @click="showProfileModal = false" class="px-4 py-2 rounded-lg bg-surface-hover hover:bg-border border border-transparent hover:border-border text-primary text-sm transition-colors">Cancel</button>
          <button @click="saveProfile" :disabled="profileSaving" class="px-5 py-2 rounded-lg bg-btn-primary hover:bg-btn-primary-hover text-btn-primary-text disabled:opacity-50 text-sm font-semibold transition-colors">
            {{ profileSaving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Time Log Modal -->
    <div v-if="showTimeLogModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm dark:bg-black/60 flex items-center justify-center z-50 p-4">
      <div class="bg-surface border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div class="flex items-center justify-between px-6 py-5 border-b border-border bg-surface-hover/50">
          <h3 class="font-semibold text-lg text-primary">{{ timeLogMode === 'add' ? 'Add Time Log' : 'Edit Time Log' }}</h3>
          <button @click="showTimeLogModal = false" class="text-secondary hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="px-6 py-5 grid grid-cols-2 gap-4">
          <div>
            <label class="block text-secondary text-xs mb-1.5">Date</label>
            <input v-model="timeLogForm.log_date" type="date" class="w-full bg-background text-primary rounded-lg px-4 py-2.5 border border-border focus:border-primary outline-none text-sm transition-colors" />
          </div>
          <div>
            <label class="block text-secondary text-xs mb-1.5">Time (seconds)</label>
            <input v-model="timeLogForm.time_seconds" type="number" step="0.01" placeholder="35.10" class="w-full bg-background text-primary rounded-lg px-4 py-2.5 border border-border focus:border-primary outline-none text-sm transition-colors" />
          </div>
          <div>
            <label class="block text-secondary text-xs mb-1.5">Event</label>
            <input v-model="timeLogForm.event" type="text" placeholder="100m Freestyle" class="w-full bg-background text-primary rounded-lg px-4 py-2.5 border border-border focus:border-primary outline-none text-sm transition-colors" />
          </div>
          <div>
            <label class="block text-secondary text-xs mb-1.5">Stroke</label>
            <select v-model="timeLogForm.stroke" class="w-full bg-background text-primary rounded-lg px-4 py-2.5 border border-border focus:border-primary outline-none text-sm transition-colors">
              <option value="">Select</option>
              <option>Freestyle</option>
              <option>Breaststroke</option>
              <option>Backstroke</option>
              <option>Butterfly</option>
              <option>Individual Medley (IM)</option>
            </select>
          </div>
          <div>
            <label class="block text-secondary text-xs mb-1.5">Log Type</label>
            <select v-model="timeLogForm.log_type" class="w-full bg-background text-primary rounded-lg px-4 py-2.5 border border-border focus:border-primary outline-none text-sm transition-colors">
              <option value="">Select</option>
              <option>Training</option>
              <option>Time Trial</option>
              <option>Competition</option>
            </select>
          </div>
          <div>
            <label class="block text-secondary text-xs mb-1.5">Pool Length</label>
            <select v-model="timeLogForm.pool_length" class="w-full bg-background text-primary rounded-lg px-4 py-2.5 border border-border focus:border-primary outline-none text-sm transition-colors">
              <option value="">Select</option>
              <option :value="25">25m</option>
              <option :value="50">50m</option>
            </select>
          </div>
          <div class="col-span-2">
            <label class="block text-secondary text-xs mb-1.5">Remarks</label>
            <input v-model="timeLogForm.remarks" type="text" placeholder="Optional notes" class="w-full bg-background text-primary rounded-lg px-4 py-2.5 border border-border focus:border-primary outline-none text-sm transition-colors" />
          </div>
        </div>
        <div class="px-6 pb-5 flex justify-end gap-3">
          <button @click="showTimeLogModal = false" class="px-4 py-2 rounded-lg bg-surface-hover hover:bg-border border border-transparent hover:border-border text-primary text-sm transition-colors">Cancel</button>
          <button @click="saveTimeLog" :disabled="timeLogSaving" class="px-5 py-2 rounded-lg bg-btn-primary hover:bg-btn-primary-hover text-btn-primary-text disabled:opacity-50 text-sm font-semibold transition-colors">
            {{ timeLogSaving ? 'Saving...' : timeLogMode === 'add' ? 'Add Log' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Training Log Modal -->
    <div v-if="showTrainingLogModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm dark:bg-black/60 flex items-center justify-center z-50 p-4">
      <div class="bg-surface border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div class="flex items-center justify-between px-6 py-5 border-b border-border bg-surface-hover/50">
          <h3 class="font-semibold text-lg text-primary">{{ trainingLogMode === 'add' ? 'Add Training Log' : 'Edit Training Log' }}</h3>
          <button @click="showTrainingLogModal = false" class="text-secondary hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="px-6 py-5 grid grid-cols-2 gap-4">
          <div>
            <label class="block text-secondary text-xs mb-1.5">Date</label>
            <input v-model="trainingLogForm.log_date" type="date" class="w-full bg-background text-primary rounded-lg px-4 py-2.5 border border-border focus:border-primary outline-none text-sm transition-colors" />
          </div>
          <div>
            <label class="block text-secondary text-xs mb-1.5">Attendance</label>
            <select v-model="trainingLogForm.attendance" class="w-full bg-background text-primary rounded-lg px-4 py-2.5 border border-border focus:border-primary outline-none text-sm transition-colors">
              <option value="">Select</option>
              <option>Present</option>
              <option>Absent</option>
              <option>Sick</option>
              <option>Injured</option>
            </select>
          </div>
          <div>
            <label class="block text-secondary text-xs mb-1.5">Volume (meters)</label>
            <input v-model="trainingLogForm.volume_meters" type="number" placeholder="5000" class="w-full bg-background text-primary rounded-lg px-4 py-2.5 border border-border focus:border-primary outline-none text-sm transition-colors" />
          </div>
          <div>
            <label class="block text-secondary text-xs mb-1.5">Intensity</label>
            <select v-model="trainingLogForm.intensity" class="w-full bg-background text-primary rounded-lg px-4 py-2.5 border border-border focus:border-primary outline-none text-sm transition-colors">
              <option value="">Select</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Max</option>
            </select>
          </div>
          <div>
            <label class="block text-secondary text-xs mb-1.5">Fatigue Score (1–10)</label>
            <input v-model="trainingLogForm.fatigue_score" type="number" min="1" max="10" placeholder="5" class="w-full bg-background text-primary rounded-lg px-4 py-2.5 border border-border focus:border-primary outline-none text-sm transition-colors" />
          </div>
          <div>
            <label class="block text-secondary text-xs mb-1.5">Sleep (hours)</label>
            <input v-model="trainingLogForm.sleep_hours" type="number" step="0.5" placeholder="8" class="w-full bg-background text-primary rounded-lg px-4 py-2.5 border border-border focus:border-primary outline-none text-sm transition-colors" />
          </div>
          <div class="col-span-2 flex items-center gap-3 mt-1">
            <input v-model="trainingLogForm.gym_session" type="checkbox" id="gym_modal" class="w-4 h-4 rounded border-border text-btn-primary" />
            <label for="gym_modal" class="text-primary text-sm font-medium">Gym Session Included</label>
          </div>
          <div class="col-span-2">
            <label class="block text-secondary text-xs mb-1.5">Notes</label>
            <input v-model="trainingLogForm.notes" type="text" placeholder="Optional notes" class="w-full bg-background text-primary rounded-lg px-4 py-2.5 border border-border focus:border-primary outline-none text-sm transition-colors" />
          </div>
        </div>
        <div class="px-6 pb-5 flex justify-end gap-3">
          <button @click="showTrainingLogModal = false" class="px-4 py-2 rounded-lg bg-surface-hover hover:bg-border border border-transparent hover:border-border text-primary text-sm transition-colors">Cancel</button>
          <button @click="saveTrainingLog" :disabled="trainingLogSaving" class="px-5 py-2 rounded-lg bg-btn-primary hover:bg-btn-primary-hover text-btn-primary-text disabled:opacity-50 text-sm font-semibold transition-colors">
            {{ trainingLogSaving ? 'Saving...' : trainingLogMode === 'add' ? 'Add Log' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { SwimmerService } from '~/composables/services/SwimmerService.js'
import { TimeLogService } from '~/composables/services/TimeLogService.js'
import { TrainingLogService } from '~/composables/services/TrainingLogService.js'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const supabase = useSupabase()

// ── Services ──────────────────────────────────────────────────────────────────
const swimmerService    = new SwimmerService(supabase)
const timeLogService    = new TimeLogService(supabase)
const trainingLogService = new TrainingLogService(supabase)

// ── State ─────────────────────────────────────────────────────────────────────
const swimmer      = ref(null)
const timeLogs     = ref([])
const trainingLogs = ref([])
const loading      = ref(true)

// Inline card editing
const editingField  = ref(null)   // which stat card field is being edited
const editValue     = ref('')     // current editable value
const fieldSaving   = ref(false)

// Edit Profile Modal
const showProfileModal = ref(false)
const profileSaving    = ref(false)
const profileForm      = ref({})

// Time Log Modal
const showTimeLogModal    = ref(false)
const timeLogMode         = ref('add')
const editingTimeLogId    = ref(null)
const timeLogSaving       = ref(false)
const emptyTimeLog = () => ({ log_date: '', event: '', stroke: '', time_seconds: '', log_type: '', pool_length: '', remarks: '' })
const timeLogForm         = ref(emptyTimeLog())

// Training Log Modal
const showTrainingLogModal  = ref(false)
const trainingLogMode       = ref('add')
const editingTrainingLogId  = ref(null)
const trainingLogSaving     = ref(false)
const emptyTrainingLog = () => ({ log_date: '', attendance: '', volume_meters: '', intensity: '', fatigue_score: '', sleep_hours: '', gym_session: false, notes: '' })
const trainingLogForm       = ref(emptyTrainingLog())

// ── Computed ──────────────────────────────────────────────────────────────────
const avgFatigue = computed(() => {
  const scores = trainingLogs.value.map(l => l.fatigue_score).filter(Boolean)
  if (!scores.length) return '—'
  return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
})

// ── Data Loading ──────────────────────────────────────────────────────────────
const { finish: finishLoading } = useLoadingIndicator()

const load = async () => {
  loading.value = true
  const id = route.params.id
  const [sw, tl, trl] = await Promise.all([
    swimmerService.getProfile(id),
    timeLogService.getBySwimmer(id),
    trainingLogService.getBySwimmer(id),
  ])
  swimmer.value      = sw.data
  timeLogs.value     = tl.data
  trainingLogs.value = trl.data
  loading.value = false
  finishLoading()
}

// ── Inline Card Editing ───────────────────────────────────────────────────────
const startEdit = (field, current) => {
  editingField.value = field
  editValue.value = current ?? ''
}

const cancelEdit = () => {
  editingField.value = null
  editValue.value = ''
}

const numericFields = ['personal_best', 'height_cm', 'weight_kg']

const saveField = async (field) => {
  fieldSaving.value = true
  const raw = editValue.value
  const value = numericFields.includes(field)
    ? (raw !== '' && raw !== null ? parseFloat(raw) : null)
    : (raw || null)
  const { data, error } = await swimmerService.updateProfile(swimmer.value.id, { [field]: value })
  fieldSaving.value = false
  if (!error) {
    swimmer.value = { ...swimmer.value, ...data }
    cancelEdit()
  }
}

// ── Profile Modal CRUD ────────────────────────────────────────────────────────
const openEditProfile = () => {
  profileForm.value = { ...swimmer.value }
  showProfileModal.value = true
}

const saveProfile = async () => {
  profileSaving.value = true
  const { data, error } = await swimmerService.updateProfile(swimmer.value.id, {
    full_name:     profileForm.value.full_name,
    age:           profileForm.value.age || null,
    gender:        profileForm.value.gender || null,
    main_stroke:   profileForm.value.main_stroke || null,
    main_event:    profileForm.value.main_event || null,
    personal_best: profileForm.value.personal_best ? parseFloat(profileForm.value.personal_best) : null,
    height_cm:     profileForm.value.height_cm ? parseFloat(profileForm.value.height_cm) : null,
    weight_kg:     profileForm.value.weight_kg ? parseFloat(profileForm.value.weight_kg) : null,
  })
  profileSaving.value = false
  if (!error) {
    swimmer.value = data
    showProfileModal.value = false
  }
}

// ── Time Log CRUD ─────────────────────────────────────────────────────────────
const openAddTimeLog = () => {
  timeLogMode.value = 'add'
  editingTimeLogId.value = null
  timeLogForm.value = emptyTimeLog()
  showTimeLogModal.value = true
}

const openEditTimeLog = (log) => {
  timeLogMode.value = 'edit'
  editingTimeLogId.value = log.id
  timeLogForm.value = {
    log_date:     log.log_date || '',
    event:        log.event || '',
    stroke:       log.stroke || '',
    time_seconds: log.time_seconds || '',
    log_type:     log.log_type || '',
    pool_length:  log.pool_length || '',
    remarks:      log.remarks || '',
  }
  showTimeLogModal.value = true
}

const saveTimeLog = async () => {
  timeLogSaving.value = true
  const payload = {
    swimmer_id:   swimmer.value.id,
    log_date:     timeLogForm.value.log_date || null,
    event:        timeLogForm.value.event || null,
    stroke:       timeLogForm.value.stroke || null,
    time_seconds: timeLogForm.value.time_seconds ? parseFloat(timeLogForm.value.time_seconds) : null,
    log_type:     timeLogForm.value.log_type || null,
    pool_length:  timeLogForm.value.pool_length || null,
    remarks:      timeLogForm.value.remarks || null,
  }
  if (timeLogMode.value === 'add') {
    await timeLogService.create(payload)
  } else {
    await timeLogService.update(editingTimeLogId.value, payload)
  }
  timeLogSaving.value = false
  showTimeLogModal.value = false
  const { data } = await timeLogService.getBySwimmer(swimmer.value.id)
  timeLogs.value = data
}

const { show: showConfirm } = useConfirmModal()

const deleteTimeLog = async (id) => {
  const confirmed = await showConfirm({
    title: 'Delete Time Log',
    message: 'Delete this time log? This action cannot be undone.',
    confirmText: 'Delete',
    variant: 'danger',
  })
  if (!confirmed) return
  await timeLogService.delete(id)
  timeLogs.value = timeLogs.value.filter(l => l.id !== id)
}

// ── Training Log CRUD ─────────────────────────────────────────────────────────
const openAddTrainingLog = () => {
  trainingLogMode.value = 'add'
  editingTrainingLogId.value = null
  trainingLogForm.value = emptyTrainingLog()
  showTrainingLogModal.value = true
}

const openEditTrainingLog = (log) => {
  trainingLogMode.value = 'edit'
  editingTrainingLogId.value = log.id
  trainingLogForm.value = {
    log_date:      log.log_date || '',
    attendance:    log.attendance || '',
    volume_meters: log.volume_meters || '',
    intensity:     log.intensity || '',
    fatigue_score: log.fatigue_score || '',
    sleep_hours:   log.sleep_hours || '',
    gym_session:   log.gym_session || false,
    notes:         log.notes || '',
  }
  showTrainingLogModal.value = true
}

const saveTrainingLog = async () => {
  trainingLogSaving.value = true
  const payload = {
    swimmer_id:    swimmer.value.id,
    log_date:      trainingLogForm.value.log_date || null,
    attendance:    trainingLogForm.value.attendance || null,
    volume_meters: trainingLogForm.value.volume_meters ? parseInt(trainingLogForm.value.volume_meters) : null,
    intensity:     trainingLogForm.value.intensity || null,
    fatigue_score: trainingLogForm.value.fatigue_score ? parseInt(trainingLogForm.value.fatigue_score) : null,
    sleep_hours:   trainingLogForm.value.sleep_hours ? parseFloat(trainingLogForm.value.sleep_hours) : null,
    gym_session:   trainingLogForm.value.gym_session,
    notes:         trainingLogForm.value.notes || null,
  }
  if (trainingLogMode.value === 'add') {
    await trainingLogService.create(payload)
  } else {
    await trainingLogService.update(editingTrainingLogId.value, payload)
  }
  trainingLogSaving.value = false
  showTrainingLogModal.value = false
  const { data } = await trainingLogService.getBySwimmer(swimmer.value.id)
  trainingLogs.value = data
}

const deleteTrainingLog = async (id) => {
  const confirmed = await showConfirm({
    title: 'Delete Training Log',
    message: 'Delete this training log? This action cannot be undone.',
    confirmText: 'Delete',
    variant: 'danger',
  })
  if (!confirmed) return
  await trainingLogService.delete(id)
  trainingLogs.value = trainingLogs.value.filter(l => l.id !== id)
}

onMounted(load)
</script>
