<template>
  <div class="t-page q-pa-md">
    <!-- NAV -->
    <div class="t-nav t-glass">
      <div class="t-logo">
        <span class="dot"></span>
        <span class="t-grad-text">Timely</span>
      </div>
      <div class="row items-center q-gutter-sm t-nav-actions">
        <button class="t-btn t-btn-ghost" @click="themeDrawer = true">
          <q-icon name="palette" />
          <span class="t-hide-sm">Theme</span>
        </button>
        <button class="t-btn" @click="onAddClick">
          <q-icon name="add" />
          <span class="t-hide-sm">Neuer Termin</span>
        </button>
        <q-btn-dropdown flat dense round dropdown-icon="account_circle" style="color: var(--t-text);">
          <q-list class="t-glass" style="min-width: 160px;">
            <q-item clickable v-close-popup @click="store.handleLogout()">
              <q-item-section avatar><q-icon name="logout" /></q-item-section>
              <q-item-section>Log out</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <!-- SIDEBAR -->
      <div class="col-12 col-md-3">
        <div class="t-card q-mb-md">
          <div class="text-caption" style="opacity:0.7; letter-spacing:0.15em; text-transform:uppercase;">
            {{ formatDateHeader(selectedDate) }}
          </div>
          <div class="t-grad-text" style="font-size: 56px; line-height: 1; margin: 8px 0 4px;">
            {{ selectedDate.getDate() }}
          </div>
          <div style="opacity:0.6; font-size: 13px;">
            {{ selectedDate.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' }) }}
          </div>
        </div>

        <div class="t-card q-mb-md">
          <div class="row items-center justify-between q-mb-sm">
            <div class="text-caption" style="opacity:0.7; letter-spacing:0.15em; text-transform:uppercase;">
              Heute
            </div>
            <div class="text-caption" style="opacity:0.6;">{{ todaysAppointments.length }}</div>
          </div>
          <div v-if="todaysAppointments.length === 0" class="text-caption" style="opacity:0.5;">
            Nichts geplant — chill day ✨
          </div>
          <div v-for="apt in todaysAppointments" :key="apt.event_id || apt.id || apt.title"
            class="row items-start q-py-xs" style="gap:10px;">
            <div style="width:6px; align-self:stretch; border-radius:6px;"
              :style="{ background: apt.color || 'var(--t-primary)' }"></div>
            <div class="col" style="min-width: 0;">
              <div class="t-clamp-1" style="font-weight:600;">{{ apt.title }}</div>
              <div class="text-caption t-clamp-2" style="opacity:0.6;">{{ apt.description }}</div>
            </div>
          </div>
        </div>

        <div class="t-card">
          <div class="text-caption q-mb-sm" style="opacity:0.7; letter-spacing:0.15em; text-transform:uppercase;">
            Stats
          </div>
          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <div class="t-grad-text" style="font-size:24px;">{{ store.appointments.length }}</div>
              <div class="text-caption" style="opacity:0.6;">Termine</div>
            </div>
            <div class="col-6">
              <div class="t-grad-text" style="font-size:24px;">{{ themeStore.theme.name }}</div>
              <div class="text-caption" style="opacity:0.6;">Theme</div>
            </div>
          </div>
        </div>
      </div>

      <!-- MAIN CALENDAR -->
      <div class="col-12 col-md-9">
        <div class="t-card">
          <div class="row items-center q-mb-md">
            <button class="t-btn t-btn-ghost" @click="navPrev"><q-icon name="chevron_left" /></button>
            <div class="t-grad-text q-mx-md" style="font-size: 24px; min-width: 220px; text-align:center;">
              {{ headerLabel }}
            </div>
            <button class="t-btn t-btn-ghost" @click="navNext"><q-icon name="chevron_right" /></button>
            <q-space />
            <q-btn-toggle v-model="viewMode" class="q-ml-sm" unelevated rounded
              toggle-color="primary" :options="[
                { label: 'Tag', value: 'day' },
                { label: 'Woche', value: 'week' },
                { label: 'Monat', value: 'month' },
              ]" />
          </div>

          <!-- MONTH VIEW -->
          <table v-if="viewMode === 'month'" class="t-cal">
            <thead>
              <tr>
                <th class="t-wk">KW</th>
                <th v-for="day in weekDays" :key="day">{{ day }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(week, wIdx) in calendarWeeks" :key="wIdx">
                <td class="t-wk">{{ getWeekNumber(week[0].date) }}</td>
                <td v-for="dayObj in week" :key="dayObj.date.toISOString()"
                  :class="{
                    't-other': !dayObj.isCurrentMonth,
                    't-today': isToday(dayObj.date),
                    't-selected': isSelected(dayObj.date),
                  }"
                  @click="openDay(dayObj.date)">
                  <div class="t-day-num">{{ dayObj.date.getDate() }}</div>
                  <div v-for="apt in appointmentsFor(dayObj.date).slice(0,2)"
                    :key="apt.event_id || apt.title"
                    class="t-event"
                    :style="{ background: apt.color || 'var(--t-primary)' }">
                    {{ apt.title }}
                  </div>
                  <div v-if="appointmentsFor(dayObj.date).length > 2" class="t-event"
                    style="background: transparent; color: var(--t-secondary);">
                    +{{ appointmentsFor(dayObj.date).length - 2 }} mehr
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- WEEK VIEW -->
          <div v-else-if="viewMode === 'week'" class="t-week">
            <div class="t-week-head">
              <div class="t-week-gutter"></div>
              <div v-for="d in weekDates" :key="d.toISOString()"
                class="t-week-day-head" :class="{ 't-today-head': isToday(d) }"
                @click="selectDay(d)">
                <div style="font-size:10px; opacity:0.6; letter-spacing:0.1em;">{{ weekDays[(d.getDay()+6)%7] }}</div>
                <div class="t-day-num">{{ d.getDate() }}</div>
              </div>
            </div>
            <div class="t-week-body">
              <div class="t-week-gutter">
                <div v-for="h in hours" :key="h" class="t-hour-label">{{ h }}:00</div>
              </div>
              <div v-for="d in weekDates" :key="d.toISOString()" class="t-week-col">
                <div v-for="h in hours" :key="h" class="t-hour-cell"></div>
                <div v-for="(it, i) in layoutEvents(appointmentsFor(d), d)" :key="i"
                  class="t-week-event"
                  :style="it.style"
                  @click="editEvent(it.apt)">
                  <div class="t-clamp-1" style="font-weight:700;">{{ it.apt.title }}</div>
                  <div class="t-clamp-2" style="opacity:0.85; font-size:10px;">{{ it.apt.description }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- DAY VIEW -->
          <div v-else class="t-week">
            <div class="t-week-head">
              <div class="t-week-gutter"></div>
              <div class="t-week-day-head t-today-head" style="flex: 1;">
                <div style="font-size:10px; opacity:0.6; letter-spacing:0.1em;">
                  {{ selectedDate.toLocaleDateString('de-DE', { weekday: 'long' }) }}
                </div>
                <div class="t-day-num">{{ selectedDate.getDate() }}</div>
              </div>
            </div>
            <div class="t-week-body">
              <div class="t-week-gutter">
                <div v-for="h in hours" :key="h" class="t-hour-label">{{ h }}:00</div>
              </div>
              <div class="t-week-col" style="flex:1;">
                <div v-for="h in hours" :key="h" class="t-hour-cell"></div>
                <div v-for="(it, i) in layoutEvents(appointmentsFor(selectedDate), selectedDate)" :key="i"
                  class="t-week-event"
                  :style="it.style"
                  @click="editEvent(it.apt)">
                  <div class="t-clamp-1" style="font-weight:700;">{{ it.apt.title }}</div>
                  <div class="t-clamp-2" style="opacity:0.85; font-size:11px;">{{ it.apt.description }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- THEME DRAWER -->
    <q-dialog v-model="themeDrawer" position="right" full-height>
      <div class="t-card t-theme-panel" style="width: 360px; max-width: 100vw; border-radius: var(--t-radius) 0 0 var(--t-radius); height: 100vh; overflow-y: auto;">
        <div class="row items-center q-mb-md">
          <div class="t-grad-text" style="font-size: 22px;">Theme Studio</div>
          <q-space />
          <q-btn flat round dense icon="close" @click="themeDrawer = false" />
        </div>

        <div class="text-caption q-mb-sm" style="opacity:0.7; letter-spacing:0.15em; text-transform:uppercase;">
          Presets
        </div>
        <div class="row q-col-gutter-sm q-mb-md">
          <div v-for="(p, key) in presets" :key="key" class="col-6">
            <div class="t-preset" :class="{ active: themeStore.presetKey === key }"
              @click="themeStore.setPreset(key)">
              <div class="swatch"
                :style="{ background: `linear-gradient(135deg, ${p.bg1}, ${p.primary}, ${p.secondary})` }"></div>
              <div class="label">
                <q-icon :name="p.icon" size="14px" /> {{ p.name }}
              </div>
            </div>
          </div>
        </div>

        <div class="text-caption q-mb-sm" style="opacity:0.7; letter-spacing:0.15em; text-transform:uppercase;">
          Colors
        </div>
        <div v-for="field in colorFields" :key="field.key" class="row items-center q-mb-sm" style="gap:10px;">
          <div style="width:32px; height:32px; border-radius:8px; border:1px solid var(--t-border); cursor:pointer;"
            :style="{ background: themeStore.theme[field.key] }">
            <q-popup-proxy cover transition-show="scale">
              <q-color :model-value="themeStore.theme[field.key]"
                @update:model-value="v => themeStore.setOverride(field.key, v)" />
            </q-popup-proxy>
          </div>
          <div style="flex:1; font-size:13px;">{{ field.label }}</div>
          <div class="text-caption" style="opacity:0.5; font-family: monospace;">
            {{ themeStore.theme[field.key] }}
          </div>
        </div>

        <q-separator class="q-my-md" style="opacity:0.2;" />

        <div class="text-caption q-mb-sm" style="opacity:0.7; letter-spacing:0.15em; text-transform:uppercase;">
          Layout Mode
        </div>
        <div class="row q-col-gutter-sm q-mb-md">
          <div v-for="mode in layoutModes" :key="mode.value" class="col-6">
            <div class="t-preset" :class="{ active: themeStore.layoutMode === mode.value }"
              @click="themeStore.layoutMode = mode.value"
              style="padding: 10px;">
              <div class="row items-center" style="gap:8px;">
                <q-icon :name="mode.icon" size="18px" />
                <div>
                  <div style="font-weight:700; font-size:12px;">{{ mode.label }}</div>
                  <div style="font-size:9px; opacity:0.6;">{{ mode.desc }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="text-caption q-mb-sm" style="opacity:0.7; letter-spacing:0.15em; text-transform:uppercase;">
          Density
        </div>
        <q-btn-toggle v-model="themeStore.density" spread no-caps unelevated rounded
          class="q-mb-md full-width"
          toggle-color="primary"
          :options="[
            { label: 'Compact', value: 'compact' },
            { label: 'Cozy', value: 'cozy' },
            { label: 'Comfy', value: 'comfy' },
          ]" />

        <div class="text-caption q-mb-sm" style="opacity:0.7; letter-spacing:0.15em; text-transform:uppercase;">
          Effects
        </div>
        <q-toggle v-model="themeStore.animatedBg" label="Animated background" />
        <q-toggle v-model="themeStore.glass" label="Glassmorphism" />

        <div class="q-mt-md">
          <div class="text-caption q-mb-xs" style="opacity:0.7;">Icon style</div>
          <div class="row items-center" style="gap:10px;">
            <q-btn-toggle v-model="themeStore.iconStyle" no-caps unelevated rounded
              toggle-color="primary" class="col"
              :options="[
                { label: 'Auto', value: 'auto' },
                { label: 'Filled', value: 'filled' },
                { label: 'Outlined', value: 'outlined' },
              ]" />
            <q-icon name="palette" size="28px" :style="{ color: themeStore.theme.primary }" />
          </div>
        </div>

        <div class="q-mt-md">
          <div class="text-caption" style="opacity:0.7;">Border radius: {{ themeStore.radius }}px</div>
          <q-slider v-model="themeStore.radius" :min="0" :max="32" />
        </div>

        <div class="q-mt-sm">
          <div class="text-caption q-mb-xs" style="opacity:0.7;">Font</div>
          <q-select v-model="themeStore.font" :options="['Inter','Space Grotesk','JetBrains Mono','Pacifico']"
            outlined dense>
            <template v-slot:selected-item="scope">
              <span :style="{ fontFamily: scope.opt }">{{ scope.opt }}</span>
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label :style="{ fontFamily: scope.opt, fontSize: '16px' }">{{ scope.opt }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>

        <button class="t-btn-reset" @click="themeStore.reset()">
          <q-icon name="restart_alt" /> Alles zurücksetzen
        </button>
      </div>
    </q-dialog>

    <!-- DAY DETAIL DIALOG -->
    <q-dialog v-model="dayDialog">
      <div class="t-card" style="min-width: 380px; max-width: 90vw;">
        <div class="row items-center q-mb-md">
          <div>
            <div class="t-grad-text" style="font-size: 22px;">
              {{ selectedDate.toLocaleDateString('de-DE', { weekday: 'long' }) }},
              {{ selectedDate.getDate() }}.
              {{ selectedDate.toLocaleDateString('de-DE', { month: 'long' }) }}
            </div>
            <div class="text-caption" style="opacity:0.6;">
              {{ dayEvents.length }} {{ dayEvents.length === 1 ? 'Termin' : 'Termine' }}
            </div>
          </div>
          <q-space />
          <q-btn flat round dense icon="close" v-close-popup style="color: var(--t-text);" />
        </div>

        <div v-if="dayEvents.length === 0" class="text-center q-py-lg" style="opacity:0.6;">
          Keine Termine — perfekter Tag zum Chillen ✨
        </div>

        <div v-for="apt in dayEvents" :key="apt.event_id"
          class="row items-start q-mb-sm cursor-pointer t-event-row"
          style="gap: 12px; padding: 12px; border-radius: 12px; background: var(--t-surface); border: 1px solid var(--t-border);"
          @click="editEvent(apt)">
          <div style="width:6px; align-self:stretch; border-radius:6px; min-height: 40px;"
            :style="{ background: apt.color || 'var(--t-primary)' }"></div>
          <div class="col" style="min-width: 0;">
            <div class="t-clamp-1" style="font-weight:700; font-size: 15px;">
              {{ apt.title }}
              <q-icon v-if="apt.is_recurring" name="repeat" size="14px" style="opacity:0.6;" />
            </div>
            <div v-if="apt.description" class="text-caption q-mt-xs t-clamp-2" style="opacity:0.7;">
              {{ apt.description }}
            </div>
            <div class="text-caption q-mt-xs" style="opacity:0.6;">
              <q-icon name="schedule" size="12px" />
              {{ formatTime(apt.start_time) }} – {{ formatTime(apt.end_time) }}
            </div>
          </div>
          <q-btn flat round dense icon="delete" size="sm"
            style="color: #ef4444;"
            @click.stop="deleteEvent(apt)" />
        </div>

        <button class="t-btn full-width q-mt-md" style="justify-content:center;"
          @click="openAddForSelected()">
          <q-icon name="add" /> Termin hinzufügen
        </button>
      </div>
    </q-dialog>

    <!-- ADD / EDIT DIALOG -->
    <q-dialog v-model="addTermin">
      <div class="t-card t-event-dialog">
        <div class="row items-center q-mb-md">
          <div class="t-grad-text" style="font-size: 22px;">
            {{ editingId ? 'Termin bearbeiten' : 'Neuer Termin' }}
          </div>
          <q-space />
          <q-btn flat round dense icon="close" v-close-popup style="color: var(--t-text);" />
        </div>
        <div class="q-gutter-md">
          <q-input v-model="termin.title" label="Titel" outlined dark @blur="checkInputs" />
          <q-input v-model="termin.description" label="Beschreibung" outlined dark type="textarea" @blur="checkInputs" />
          <div class="row items-center" style="gap: 12px;">
            <div style="font-size: 13px; opacity: 0.7;">Farbe</div>
            <div class="cursor-pointer"
              :style="{
                width: '40px', height: '40px', borderRadius: '10px',
                background: termin.color, border: '2px solid var(--t-border)',
                boxShadow: '0 4px 12px ' + termin.color + '55'
              }">
              <q-popup-proxy cover transition-show="scale">
                <q-color v-model="termin.color" />
              </q-popup-proxy>
            </div>
            <q-input v-model="termin.color" outlined dark dense style="flex:1;" />
          </div>
          <q-input v-model="termin.start_time" label="Start" outlined readonly>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer" style="color: var(--t-text);">
                <q-popup-proxy cover transition-show="scale">
                  <q-date v-model="termin.start_time" mask="DD.MM.YYYY HH:mm" />
                </q-popup-proxy>
              </q-icon>
              <q-icon name="schedule" class="cursor-pointer q-ml-sm" style="color: var(--t-text);">
                <q-popup-proxy cover transition-show="scale">
                  <q-time v-model="termin.start_time" mask="DD.MM.YYYY HH:mm" format24h />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input v-model="termin.end_time" label="Ende" outlined readonly>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer" style="color: var(--t-text);">
                <q-popup-proxy cover transition-show="scale">
                  <q-date v-model="termin.end_time" mask="DD.MM.YYYY HH:mm" />
                </q-popup-proxy>
              </q-icon>
              <q-icon name="schedule" class="cursor-pointer q-ml-sm" style="color: var(--t-text);">
                <q-popup-proxy cover transition-show="scale">
                  <q-time v-model="termin.end_time" mask="DD.MM.YYYY HH:mm" format24h />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-select v-if="calendarOptions.length > 1"
            v-model="termin.calendar_id" :options="calendarOptions"
            label="Kalender" outlined emit-value map-options />
          <q-toggle v-model="termin.is_recurring" label="Wiederkehrend" />
          <q-select v-if="termin.is_recurring" v-model="termin.recur_pattern"
            :options="recurOptions" label="Wiederholung" outlined emit-value map-options />
          <div v-if="addError" class="text-negative">{{ addError }}</div>
        </div>
        <div class="row justify-end q-mt-md q-gutter-sm">
          <button v-if="editingId" class="t-btn-reset" style="margin: 0; width: auto; padding: 10px 16px;"
            @click="deleteFromDialog">
            <q-icon name="delete" /> Löschen
          </button>
          <q-space />
          <button class="t-btn t-btn-ghost" v-close-popup>Abbrechen</button>
          <button class="t-btn" @click="submitTermin">
            {{ editingId ? 'Speichern' : 'Hinzufügen' }}
          </button>
        </div>
      </div>
    </q-dialog>
  </div>
</template>

<script setup>
import { usedbStore } from 'src/stores/dbStore'
import { useThemeStore, THEME_PRESETS, LAYOUT_MODES } from 'src/stores/themeStore'
import { useQuasar } from 'quasar'
import { onMounted, reactive, ref, computed } from 'vue'

const store = usedbStore()
const themeStore = useThemeStore()
const $q = useQuasar()

const presets = THEME_PRESETS
const layoutModes = LAYOUT_MODES
const colorFields = [
  { key: 'primary', label: 'Primary' },
  { key: 'secondary', label: 'Secondary' },
  { key: 'accent', label: 'Accent' },
  { key: 'bg1', label: 'Background' },
  { key: 'text', label: 'Text' },
]

const addTermin = ref(false)
const themeDrawer = ref(false)
const dayDialog = ref(false)
const addError = ref('')
const editingId = ref(null)
const recurOptions = [
  { label: 'Täglich', value: 'daily' },
  { label: 'Wöchentlich', value: 'weekly' },
  { label: 'Monatlich', value: 'monthly' },
]
const viewMode = ref('month')
const hours = Array.from({ length: 24 }, (_, i) => i)
const currentMonth = ref(new Date())
const selectedDate = ref(new Date())
const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

function nowLocal(offsetHours = 0) {
  const d = new Date()
  d.setHours(d.getHours() + offsetHours)
  d.setMinutes(0, 0, 0)
  const pad = n => String(n).padStart(2, '0')
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}
function parseLocal(str) {
  // "DD.MM.YYYY HH:mm" → Date
  const [date, time] = str.split(' ')
  const [dd, mm, yyyy] = date.split('.')
  const [h, m] = (time || '00:00').split(':')
  return new Date(+yyyy, +mm - 1, +dd, +h, +m)
}

const termin = reactive({
  title: '', description: '',
  start_time: nowLocal(1),
  end_time: nowLocal(2),
  color: '#ff00aa', calendar_id: null,
  is_recurring: false, recur_pattern: 'weekly',
})

function resetTermin() {
  termin.title = ''
  termin.description = ''
  termin.start_time = nowLocal(1)
  termin.end_time = nowLocal(2)
  termin.color = '#ff00aa'
  termin.is_recurring = false
  termin.recur_pattern = 'weekly'
  editingId.value = null
  addError.value = ''
}

function onAddClick() {
  resetTermin()
  addTermin.value = true
}

function editEvent(apt) {
  const fmt = d => {
    const x = new Date(d)
    const pad = n => String(n).padStart(2, '0')
    return `${pad(x.getDate())}.${pad(x.getMonth()+1)}.${x.getFullYear()} ${pad(x.getHours())}:${pad(x.getMinutes())}`
  }
  editingId.value = apt._origId || apt.event_id
  termin.title = apt.title
  termin.description = apt.description || ''
  termin.start_time = fmt(apt._origStart || apt.start_time)
  termin.end_time = fmt(apt._origEnd || apt.end_time)
  termin.color = apt.color || '#ff00aa'
  termin.calendar_id = apt.calendar_id
  termin.is_recurring = apt.is_recurring || false
  termin.recur_pattern = apt.recur_pattern || 'weekly'
  dayDialog.value = false
  addTermin.value = true
}

async function deleteFromDialog() {
  if (!editingId.value) return
  try {
    await store.removeAppointment({ event_id: editingId.value })
    $q.notify({ type: 'positive', message: 'Termin gelöscht' })
    addTermin.value = false
    resetTermin()
  } catch (e) {
    $q.notify({ type: 'negative', message: e.message })
  }
}

const calendarOptions = computed(() =>
  store.calendars.map(c => ({ label: c.name, value: c.calender_id }))
)

const sameDay = (a, b) => {
  const x = new Date(a), y = new Date(b)
  return x.getFullYear() === y.getFullYear() && x.getMonth() === y.getMonth() && x.getDate() === y.getDate()
}
const startOfDay = (d) => { const x = new Date(d); x.setHours(0,0,0,0); return x }
const isToday = (d) => sameDay(d, new Date())
const isSelected = (d) => sameDay(d, selectedDate.value)

function parseRecur(desc) {
  const m = desc?.match(/\[recur:(daily|weekly|monthly)\]/)
  return m ? m[1] : null
}
function cleanDesc(desc) {
  return (desc || '').replace(/\n?\[recur:(daily|weekly|monthly)\]/, '').trim()
}

const appointmentsFor = (d) => {
  const day = startOfDay(d).getTime()
  const next = day + 86400000
  const result = []
  for (const a of store.appointments) {
    const origStart = new Date(a.start_time)
    const origEnd = new Date(a.end_time || a.start_time)
    const duration = origEnd - origStart
    const pattern = a.is_recurring ? (parseRecur(a.description) || 'weekly') : null
    const view = {
      ...a,
      description: cleanDesc(a.description),
      recur_pattern: pattern,
      _origId: a.event_id,
      _origStart: a.start_time,
      _origEnd: a.end_time,
    }
    if (!pattern) {
      const s = startOfDay(origStart).getTime()
      const e = startOfDay(origEnd).getTime()
      if (s < next && e >= day) result.push(view)
      continue
    }
    // Recurring: check if any occurrence overlaps this day
    if (origStart.getTime() > next) continue
    let occ = new Date(origStart)
    let safety = 0
    while (occ.getTime() < next && safety++ < 400) {
      const occEnd = new Date(occ.getTime() + duration)
      if (startOfDay(occ).getTime() < next && startOfDay(occEnd).getTime() >= day) {
        result.push({ ...view, start_time: occ.toISOString(), end_time: occEnd.toISOString() })
      }
      if (pattern === 'daily') occ.setDate(occ.getDate() + 1)
      else if (pattern === 'weekly') occ.setDate(occ.getDate() + 7)
      else if (pattern === 'monthly') occ.setMonth(occ.getMonth() + 1)
      else break
    }
  }
  return result
}
const todaysAppointments = computed(() => appointmentsFor(new Date()))

const weekDates = computed(() => {
  const d = new Date(selectedDate.value)
  const offset = (d.getDay() + 6) % 7
  const monday = new Date(d)
  monday.setDate(d.getDate() - offset)
  return Array.from({ length: 7 }, (_, i) => {
    const x = new Date(monday)
    x.setDate(monday.getDate() + i)
    return x
  })
})

const headerLabel = computed(() => {
  if (viewMode.value === 'day') {
    return selectedDate.value.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })
  }
  if (viewMode.value === 'week') {
    const ws = weekDates.value[0], we = weekDates.value[6]
    return `${ws.getDate()}. ${ws.toLocaleDateString('de-DE',{month:'short'})} – ${we.getDate()}. ${we.toLocaleDateString('de-DE',{month:'short'})} ${we.getFullYear()}`
  }
  return formatMonthYear(currentMonth.value)
})

function layoutEvents(events, day) {
  const dayStart = startOfDay(day).getTime()
  const dayEnd = dayStart + 86400000
  // Clip events to this day, compute hour offsets
  const items = events.map(apt => {
    const s = Math.max(new Date(apt.start_time).getTime(), dayStart)
    const e = Math.min(new Date(apt.end_time || apt.start_time).getTime(), dayEnd)
    const startH = (s - dayStart) / 3600000
    const endH = Math.max((e - dayStart) / 3600000, startH + 0.5)
    return { apt, startH, endH, col: 0, cols: 1 }
  }).sort((a, b) => a.startH - b.startH || a.endH - b.endH)

  // Sweep: group overlapping events, assign columns
  let group = []
  let groupEnd = 0
  const flush = () => {
    const cols = []
    for (const it of group) {
      let placed = false
      for (let c = 0; c < cols.length; c++) {
        if (cols[c] <= it.startH) {
          it.col = c
          cols[c] = it.endH
          placed = true
          break
        }
      }
      if (!placed) {
        it.col = cols.length
        cols.push(it.endH)
      }
    }
    for (const it of group) it.cols = cols.length
    group = []
    groupEnd = 0
  }
  for (const it of items) {
    if (it.startH >= groupEnd && group.length) flush()
    group.push(it)
    groupEnd = Math.max(groupEnd, it.endH)
  }
  if (group.length) flush()

  return items.map(it => ({
    apt: it.apt,
    style: {
      top: `${it.startH * 48}px`,
      height: `${Math.max((it.endH - it.startH) * 48 - 2, 24)}px`,
      left: `calc(${(it.col / it.cols) * 100}% + 2px)`,
      width: `calc(${100 / it.cols}% - 4px)`,
      background: it.apt.color || 'var(--t-primary)',
    },
  }))
}

function navPrev() {
  if (viewMode.value === 'month') return previousMonth()
  const d = new Date(selectedDate.value)
  d.setDate(d.getDate() - (viewMode.value === 'week' ? 7 : 1))
  selectedDate.value = d
  currentMonth.value = new Date(d.getFullYear(), d.getMonth(), 1)
}
function navNext() {
  if (viewMode.value === 'month') return nextMonth()
  const d = new Date(selectedDate.value)
  d.setDate(d.getDate() + (viewMode.value === 'week' ? 7 : 1))
  selectedDate.value = d
  currentMonth.value = new Date(d.getFullYear(), d.getMonth(), 1)
}

const calendarWeeks = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const startOffset = (firstDay.getDay() + 6) % 7
  const startDate = new Date(firstDay)
  startDate.setDate(firstDay.getDate() - startOffset)

  const weeks = []
  const cursor = new Date(startDate)
  for (let w = 0; w < 6; w++) {
    const week = []
    for (let i = 0; i < 7; i++) {
      week.push({ date: new Date(cursor), isCurrentMonth: cursor.getMonth() === month })
      cursor.setDate(cursor.getDate() + 1)
    }
    weeks.push(week)
    if (w >= 4 && !week.some(d => d.isCurrentMonth)) break
  }
  return weeks
})

function formatMonthYear(d) {
  return d.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })
}
function formatDateHeader(d) {
  return new Date(d).toLocaleDateString('de-DE',
    { weekday: 'long', day: '2-digit', month: 'long' })
}
function previousMonth() {
  const d = new Date(currentMonth.value); d.setMonth(d.getMonth() - 1); currentMonth.value = d
}
function nextMonth() {
  const d = new Date(currentMonth.value); d.setMonth(d.getMonth() + 1); currentMonth.value = d
}
function selectDay(d) {
  selectedDate.value = d
  currentMonth.value = new Date(d.getFullYear(), d.getMonth(), 1)
}
function openDay(d) {
  selectDay(d)
  dayDialog.value = true
}
function openAddForSelected() {
  const base = new Date(selectedDate.value)
  base.setHours(new Date().getHours() + 1, 0, 0, 0)
  const end = new Date(base)
  end.setHours(base.getHours() + 1)
  const pad = n => String(n).padStart(2, '0')
  const fmt = d => `${pad(d.getDate())}.${pad(d.getMonth()+1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
  termin.start_time = fmt(base)
  termin.end_time = fmt(end)
  dayDialog.value = false
  addTermin.value = true
}
const dayEvents = computed(() => appointmentsFor(selectedDate.value))
function formatTime(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}
async function deleteEvent(apt) {
  try {
    await store.removeAppointment(apt)
    $q.notify({ type: 'positive', message: 'Termin gelöscht' })
  } catch (e) {
    $q.notify({ type: 'negative', message: e.message })
  }
}
function getWeekNumber(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 4 - (d.getDay() || 7))
  const yearStart = new Date(d.getFullYear(), 0, 1)
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}
function checkInputs() {
  if (!termin.title?.trim()) { addError.value = 'Titel darf nicht leer sein.'; return false }
  if (!termin.description?.trim()) { addError.value = 'Beschreibung darf nicht leer sein.'; return false }
  addError.value = ''; return true
}
async function submitTermin() {
  if (!checkInputs()) return
  try {
    if (!termin.calendar_id) {
      const cal = await store.ensureDefaultCalendar()
      termin.calendar_id = cal.calender_id
    }
    const payload = {
      title: termin.title,
      description: (termin.description || '') + (termin.is_recurring ? `\n[recur:${termin.recur_pattern}]` : ''),
      start_time: parseLocal(termin.start_time).toISOString(),
      end_time: parseLocal(termin.end_time).toISOString(),
      color: termin.color || null,
      calendar_id: termin.calendar_id,
      is_recurring: !!termin.is_recurring,
    }
    if (editingId.value) {
      await store.updateAppointment(editingId.value, payload)
    } else {
      await store.addAppointment(payload)
    }
    $q.notify({ type: 'positive', message: editingId.value ? 'Gespeichert ✨' : 'Termin hinzugefügt ✨' })
    addTermin.value = false
    resetTermin()
  } catch (e) {
    $q.notify({ type: 'negative', message: e.message || String(e) })
  }
}

onMounted(async () => {
  themeStore.applyToDocument()
  try {
    await store.initAuth()
    await store.ensureAppUser()
    const cal = await store.ensureDefaultCalendar()
    if (cal) termin.calendar_id = cal.calender_id
    await store.getAppointments()
  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'Kalender-Setup fehlgeschlagen: ' + err.message })
  }
})
</script>

<style scoped>
.t-page { min-height: 100vh; padding-bottom: 90px; }
</style>
