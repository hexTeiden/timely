<script setup>
import { usedbStore } from 'src/stores/dbStore';

const store = usedbStore();
</script>

<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="store.handleLogin()">
      <label for="email">Email:</label>
      <input type="email" id="email" v-model="email" required />

      <label for="password">Password:</label>
      <input type="password" id="password" v-model="password" required />

      <button type="submit">Login</button>
    </form>
  </div>
</template>
