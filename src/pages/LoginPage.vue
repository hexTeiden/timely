<script setup>
import { usedbStore } from 'src/stores/dbStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = usedbStore();

const email = ref('')
const password = ref('')
const showPassword = ref(false)
</script>

<template>
  <div class="flex flex-center " style="min-height: 100vh; flex-direction: column; gap: 2rem;">

    <div>
      <div class=" text-h4 text-center q-mb-md" :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-6'">
        Willkommen zurück!
      </div>
    </div>


    <div class="q-gutter-md">
      <q-card>
        <q-card-section class="row flex-center">
          <q-btn color="positive" icon="check" label="Login with Google" @click="store.handleGoogleLogin" />
        </q-card-section>

        <div class="row items-center q-mb-md ">
          <div class="col">
            <q-separator />
          </div>
          <div class="col-auto text-caption q-px-md" :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-6'">
            ODER
          </div>
          <div class="col">
            <q-separator />
          </div>
        </div>

        <q-card-section class="row flex-center">
          <div class="q-gutter-md">
            <q-input v-model="email" type="email" label="Email" />
            <q-input v-model="password" :type="showPassword ? 'text' : 'password'" label="Password">
              <template v-slot:append>
                <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                  @click="showPassword = !showPassword" />
              </template>
            </q-input>
          </div>
        </q-card-section>
        <q-card-section class="row flex-center">
          <q-btn :disabled="password === '' || email === ''" icon="check" label="Log in with pasword" color="primary"
            @click="store.handleLogin(email, password)" v-close-popup />
        </q-card-section>

        <div class="row items-center q-mb-md ">
          <div class="col">
            <q-separator />
          </div>
          <div class="col-auto text-caption q-px-md" :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-6'">
            ODER
          </div>
          <div class="col">
            <q-separator />
          </div>
        </div>

        <q-card-section class="text-center">
          <div>
            <span :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-6'">Noch keinen Account?</span>
            <q-btn flat label="Registrieren" color="secondary" @click="router.push('/register')" v-close-popup />
          </div>
        </q-card-section>
      </q-card>

    </div>
  </div>
</template>
