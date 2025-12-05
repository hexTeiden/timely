<template>

  <div class="row items-center  q-pa-md">
    <nav class="justify-start">
      <span class="text-h5">Timely</span>
    </nav>

    <nav v-if="!user.loggedin" class="q-ml-auto">
      <q-btn color="primary" label="Log in" @click="store.handleLogin()" />
    </nav>

    <nav v-else>
      <q-btn-dropdown color="primary" label="Konto">
        <q-list>
          <q-item clickable v-close-popup>
            <q-item-section>
              <q-item-label>Account</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section>
              <q-item-label>Einstellungen</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator v-if="!$q.dark.isActive" />
          <q-separator dark v-else />
          <q-item clickable v-close-popup>
            <q-item-section>
              <q-item-label>Log out</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </nav>
  </div>


  <div class="q-pa-md">
    <q-date v-model="date" />
    {{ date.value }}
  </div>
  <div class="q-px-md">
    <q-btn color="primary" icon="add" label="Neuer Termin" @click="addTermin = true" />
  </div>


  <q-dialog v-model="addTermin">
    <q-card>
      <q-card-section class="row items-center">
        <ul>
          <li>
            <q-input v-model="termin.titel" type="text" label="Titel" @keyup="checkInputs" />
          </li>
          <li>
            <q-input v-model="termin.notizen" type="text" label="Notizen" @keyup="checkInputs" />
          </li>
          <li>
            <q-input v-model="termin.kategorie" type="text" label="Kategorie" @keyup="checkInputs" />
          </li>
          <li>
            <q-input v-model="termin.datum" type="date" label="Datum" @keyup="checkInputs" />
          </li>
        </ul>
      </q-card-section>
      <q-card-actions align="right">
        {{ addError }}
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn flat label="Add" color="primary" @click="store.addTermin(toRaw(termin))" :disabled="addError != ''" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <div>
    <ul>
      <li v-for="appointment in store.appointments" :key="appointment.id"
        :style="'background-color:' + appointment.color">
        {{ appointment.title }} <br>
        {{ appointment.description }} <br>
        {{ formatDate(appointment.start_time) }} <br>
        {{ getCurrentTimeFormatted(appointment.start_time) }} <br>
        {{ appointment.notizen }}<br>
        <q-btn color="negative" icon="delete" label="Delete" @click="store.removeTermin(toRaw(termin.id))"
          v-close-popup />
      </li>
    </ul>
  </div>
</template>

<script setup>
import { usedbStore } from 'src/stores/dbStore';
import { onMounted, reactive, ref, toRaw } from 'vue'

function getCurrentTimeFormatted() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();

  // Pad single-digit hours and minutes with a leading zero
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;

  return `${hours}:${minutes}`;
}

const addTermin = ref(false)
const addError = ref('')
const user = ref({})
const date = ref(new Date())
const time = ref(getCurrentTimeFormatted())
const store = usedbStore();

const termin = reactive({
  titel: '',
  kategorie: '',
  notizen: '',
  datum: date.value,
  uhrzeit: time.value
})


onMounted(async () => {
  try {
    await store.getAppointments();
  }
  catch (error) {
    console.error('Error fetching data:', error);
  }
});

const formatDate = (date) => {
  const d = new Date(date)
  return d.toLocaleDateString();
}

const checkInputs = () => {
  if (termin.titel == '' || termin.titel == undefined) {
    addError.value = 'Titel darf nicht leer sein.'
    return;
  }
  if (termin.notizen == '' || termin.notizen == undefined) {
    addError.value = 'Notizen darf nicht leer sein.'
    return;
  }
  if (termin.kategorie == '' || termin.kategorie == undefined) {
    addError.value = 'Kategorie darf nicht leer sein.'
    return;
  }

  addError.value = ''
}

// function testAdd() { console.log(toRaw(termin)) }
</script>
