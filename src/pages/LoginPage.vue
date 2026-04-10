<script setup>
import { usedbStore } from 'src/stores/dbStore';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = usedbStore();

const email = ref('')
const password = ref('')
const showPassword = ref(false)

onMounted(() => {
  store.initAuth()
})
</script>

<template>
  <div class="flex flex-center" style="min-height: 100vh; flex-direction: column; gap: 1.5rem; padding: 2rem;">
    <div class="t-logo" style="font-size: 42px;">
      <span class="dot"></span>
      <span class="t-grad-text">Timely</span>
    </div>
    <div style="opacity:0.7; font-size: 14px; letter-spacing:0.1em; text-transform:uppercase;">
      Welcome back ✨
    </div>

    <div class="t-card" style="width: 100%; max-width: 380px;">
      <button class="t-btn t-btn-google full-width" style="justify-content:center;" @click="store.handleGoogleLogin">
        <q-icon name="login" /> Mit Google einloggen
      </button>

      <div class="row items-center q-my-md" style="gap:10px;">
        <div class="col"><q-separator dark /></div>
        <div class="text-caption" style="opacity:0.5;">ODER</div>
        <div class="col"><q-separator dark /></div>
      </div>

      <div class="q-gutter-md">
        <q-input v-model="email" type="email" label="Email" outlined />
        <q-input v-model="password" :type="showPassword ? 'text' : 'password'" label="Password" outlined>
          <template v-slot:append>
            <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
              style="color: var(--t-text);"
              @click="showPassword = !showPassword" />
          </template>
        </q-input>
      </div>

      <button class="t-btn full-width q-mt-md" style="justify-content:center;"
        :disabled="!email || !password"
        @click="store.handleLogin(email, password)">
        Einloggen
      </button>

      <div class="text-center q-mt-md">
        <span style="opacity:0.6; font-size: 13px;">Noch keinen Account?</span>
        <q-btn flat dense label="Registrieren" class="q-ml-xs"
          style="color: var(--t-primary);"
          @click="router.push('/register')" />
      </div>
    </div>
  </div>
</template>
