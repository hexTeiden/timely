<script setup>
import { usedbStore } from 'src/stores/dbStore';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useQuasar } from 'quasar';

const store = usedbStore();
const router = useRouter();
const $q = useQuasar();

const email = ref('')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)

const canSubmit = () => password.value && password.value === confirmPassword.value && email.value && username.value

async function register() {
  try {
    await store.handleUserRegister(email.value, password.value, username.value)
    $q.notify({ type: 'positive', message: 'Account erstellt ✨' })
  } catch (e) {
    $q.notify({ type: 'negative', message: e.message })
  }
}
</script>

<template>
  <div class="flex flex-center" style="min-height: 100vh; flex-direction: column; gap: 1.5rem; padding: 2rem;">
    <div class="t-logo" style="font-size: 42px;">
      <span class="dot"></span>
      <span class="t-grad-text">Timely</span>
    </div>
    <div style="opacity:0.7; font-size: 14px; letter-spacing:0.1em; text-transform:uppercase;">
      Account erstellen ✨
    </div>

    <div class="t-card" style="width: 100%; max-width: 380px;">
      <div class="q-gutter-md">
        <q-input v-model="username" type="text" label="Name" outlined />
        <q-input v-model="email" type="email" label="Email" outlined />
        <q-input v-model="password" :type="showPassword ? 'text' : 'password'" label="Password" outlined>
          <template v-slot:append>
            <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
              style="color: var(--t-text);"
              @click="showPassword = !showPassword" />
          </template>
        </q-input>
        <q-input v-model="confirmPassword" :type="showPassword ? 'text' : 'password'" label="Passwort bestätigen" outlined
          :error="confirmPassword !== '' && confirmPassword !== password"
          error-message="Passwörter stimmen nicht überein" />
      </div>

      <button class="t-btn full-width q-mt-md" style="justify-content:center;"
        :disabled="!canSubmit()" @click="register">
        Account erstellen
      </button>

      <div class="text-center q-mt-md">
        <span style="opacity:0.6; font-size: 13px;">Schon einen Account?</span>
        <q-btn flat dense label="Einloggen" class="q-ml-xs"
          style="color: var(--t-primary);"
          @click="router.push('/')" />
      </div>
    </div>
  </div>
</template>
