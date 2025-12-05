<template>
  <div class="row items-start q-pa-md" style="gap: 1rem;">
    <!-- Header -->
    <div class="col-12 row items-center">
      <span class="text-h5">Timely</span>
      <q-space />
      <nav v-if="!user.loggedin">
        <q-btn color="primary" label="Log in" @click="store.handleLogin()" />
      </nav>
      <nav v-else>
        <q-btn-dropdown color="primary" label="Konto">
          <q-list>
            <q-item clickable @click="handleLogout">
              <q-item-section>Log out</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </nav>
    </div>

    <div class="col-12 row ">
      <!-- Sidebar -->
      <div class="col-4 col-sm-3 ">
        <!-- Mini Calendar -->
        <div class="q-mb-md">
          <div class="text-subtitle2 q-pb-md">{{ formatDateHeader(miniDate) }}</div>
          <q-date v-model="miniDate" minimal @update:model-value="date = miniDate" />

          <!-- Add Appointment Button -->
          <q-btn color="primary" icon="add" label="Neuer Termin" class=" q-my-md" @click="addTermin = true" />

          <!-- Customize Button -->
          <br>
          <q-btn color="secondary" icon="edit" label="Customize" class="q-my-md" />
        </div>


      </div>

      <!-- Main Calendar -->
      <div class="col-8 col-sm-9 ">
        <!-- Month Navigation -->
        <div class="row items-center justify-between q-mb-md bg-secondary">
          <q-btn icon="chevron_left" flat @click="previousMonth()" />
          <span class="text-h6">{{ formatMonthYear(currentMonth) }}</span>
          <q-btn icon="chevron_right" flat @click="nextMonth()" />
          <q-space />
          <q-btn-group unelevated class="bg-warning">
            <q-btn label="Tag" flat />
            <q-btn label="Woche" flat />
            <q-btn label="Monat" flat unelevated color="primary" />
          </q-btn-group>
        </div>

        <!-- Calendar Grid -->
        <q-card>
          <q-card-section class="q-pa-none">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr>
                  <th class="q-pa-sm bordered text-center bg-warning">KW</th>
                  <th v-for="day in weekDays" :key="day" class="q-pa-sm bordered text-center">
                    {{ day }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(week, weekIdx) in calendarWeeks" :key="weekIdx">
                  <td class="q-pa-sm text-center bg-warning text-bold">
                    {{ getWeekNumber(week[0]) }}
                  </td>
                  <td v-for="dayObj in week" :key="dayObj.date.toISOString()" @click="date = dayObj.date"
                    style="padding: 1rem; border: 1px solid #ddd; text-align: center; cursor: pointer; min-height: 80px;"
                    :style="'background-color: ' + (dayObj.isCurrentMonth ? '#fff' : '#f5f5f5')">
                    <div v-if="dayObj.isCurrentMonth" class="q-mb-sm ">
                      {{ dayObj.date.getDate() }}
                    </div>
                    <div v-else style="color: #999; margin-bottom: 0.5rem; ">
                      {{ dayObj.date.getDate() }}
                    </div>
                    <div class="text-caption">
                      <!-- Show appointment count or preview -->
                      <span
                        v-if="store.appointments.filter(a => formatDate(a.start_time) == formatDate(dayObj.date)).length > 0">
                        {{store.appointments.filter(a => formatDate(a.start_time) == formatDate(dayObj.date)).length
                        }}
                        {{store.appointments.filter(a => formatDate(a.start_time) == formatDate(dayObj.date)).length
                          === 1 ? 'Termin' : 'Termine'}}
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>

  <!-- Add/Edit Dialog -->
  <q-dialog v-model="addTermin">
    <q-card style="min-width: 400px;">
      <q-card-section class="row items-center q-pb-none">
        <span class="text-h6">Neuer Termin</span>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <div class="q-gutter-md">
          <q-input v-model="termin.title" label="Title" outlined @blur="checkInputs()" />
          <q-input v-model="termin.description" label="Description" outlined type="textarea" @blur="checkInputs()" />
          <!-- Color Picker -->
          <q-input filled v-model="color" label="Color">
            <template v-slot:append>
              <q-icon name="colorize" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-color v-model="color" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-input v-model="termin.start_time" label="Start Time" outlined type="date" />
          <q-input v-model="termin.end_time" label="End Time" outlined type="date" />
          <q-input v-model="termin.calendar_id" label="Calendar" outlined type="text" />
          <div v-if="addError" class="text-negative">{{ addError }}</div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn flat label="Add" color="primary" @click="submitTermin()" />
      </q-card-actions>
    </q-card>
  </q-dialog>


</template>

<script setup>
import { usedbStore } from 'src/stores/dbStore'
import { useQuasar } from 'quasar'
import { onMounted, reactive, ref, computed } from 'vue'

const store = usedbStore()
const $q = useQuasar()

const addTermin = ref(false)
const addError = ref('')
const user = ref({ loggedin: false })
const date = ref(new Date())
const miniDate = ref(new Date().toISOString().split('T')[0])
const currentMonth = ref(new Date())
const color = ref('#000000')
const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

const termin = reactive({
  title: '',
  description: '',
  start_time: '',
  end_time: new Date().toISOString().split('T')[0],
  color: '',
  calendar_id: '',
})

const formatDate = (date) => {
  const d = new Date(date)
  return d.toLocaleDateString();
}

function getCurrentTimeFormatted() {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

const calendarWeeks = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay() + 1) // Start from Monday

  const weeks = []
  let currentDate = new Date(startDate)

  while (currentDate <= lastDay || weeks[weeks.length - 1].some(d => d.isCurrentMonth)) {
    const week = []
    for (let i = 0; i < 7; i++) {
      week.push({
        date: new Date(currentDate),
        isCurrentMonth: currentDate.getMonth() === month,
      })
      currentDate.setDate(currentDate.getDate() + 1)
    }
    weeks.push(week)
    if (!week.some(d => d.isCurrentMonth)) break
  }

  return weeks
})

function formatMonthYear(d) {
  return d.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })
}

function formatDateHeader(d) {
  const date = new Date(d + 'T00:00:00')
  return date.toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' })
}

function previousMonth() {
  currentMonth.value.setMonth(currentMonth.value.getMonth() - 1)
  currentMonth.value = new Date(currentMonth.value)
}

function nextMonth() {
  currentMonth.value.setMonth(currentMonth.value.getMonth() + 1)
  currentMonth.value = new Date(currentMonth.value)
}

function getWeekNumber(dayObj) {
  const date = new Date(dayObj.date) // Extract the date from the day object
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + 4 - (date.getDay() || 7))
  const yearStart = new Date(date.getFullYear(), 0, 1)
  const weekNum = Math.ceil((((date - yearStart) / 86400000) + 1) / 7)
  return weekNum
}

// function getAppointmentsForDate(d) {
//   const dateStr = d.toISOString().split('T')[0]
//   return store.appointments.filter(apt => apt.datum === dateStr)
// }

function checkInputs() {
  if (!termin.title?.trim()) {
    addError.value = 'Title darf nicht leer sein.'
    return false
  }
  if (!termin.description?.trim()) {
    addError.value = 'Description darf nicht leer sein.'
    return false
  }
  addError.value = ''
  return true
}

async function submitTermin() {
  if (!checkInputs()) return
  try {
    await store.addAppointment(termin)
    $q.notify({ type: 'positive', message: 'Termin hinzugefügt' })
    addTermin.value = false
    termin.title = ''
    termin.description = ''
    termin.color = ''
    termin.calendar_id = ''
    termin.start_time = new Date().toISOString().split('T')[0]
    termin.end_time = getCurrentTimeFormatted()
  } catch (e) {
    $q.notify({ type: 'negative', message: e.message })
  }
}

function handleLogout() {
  user.value.loggedin = false
  // Add logout logic to store if needed
}

onMounted(async () => {
  try {
    await store.getAppointments()
  } catch (error) {
    console.error('Error fetching appointments:', error)
  }
})
</script>
