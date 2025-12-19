<script setup>
import { usedbStore } from 'src/stores/dbStore';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const store = usedbStore();
const router = useRouter();

const email = ref('')
const username = ref('');
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
</script>

<template>
  <div class="flex flex-center" style="min-height: 100vh; flex-direction: column; gap: 2rem;">

    <div>
      <div class=" text-h4 text-center q-mb-md" :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-6'">
        Willkommen zu Timely!
      </div>
    </div>

    <q-card>
      <q-card-section class="row flex-center">
        <div class="q-gutter-md">
          <q-input v-model="email" type="email" label="Email" />
          <q-input v-model="username" type="text" label="Name" />
          <q-input v-model="password" :type="showPassword ? 'text' : 'password'" label="Password">
            <template v-slot:append>
              <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                @click="showPassword = !showPassword" />
            </template>
          </q-input>

          <q-input v-model="confirmPassword" :type="showPassword ? 'text' : 'password'" label="Confirm Password">
            <template v-slot:append>
              <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                @click="showPassword = !showPassword" />
            </template>
          </q-input>

        </div>
      </q-card-section>
      <q-card-section class="row flex-center">
        <q-btn :disabled="password != confirmPassword || email === '' || confirmPassword === '' || username === ''"
          icon="check" label="Log in with pasword" color="primary" @click="store.handleUserRegister(email, password)"
          v-close-popup />
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
          <q-btn flat label="Einloggen" color="secondary" @click="router.push('/')" v-close-popup />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
