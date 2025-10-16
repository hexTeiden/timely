<template>
  <q-page class="flex flex-center">
    <img alt="Quasar logo" src="~assets/quasar-logo-vertical.svg" style="width: 200px; height: 200px" />
  </q-page>
</template>

<script setup>
import { usedbStore } from 'src/stores/example-store';
import { onMounted } from 'vue'

const store = usedbStore();

onMounted(async () => {
  try {
    await store.getTest();
    console.log(store.test)
  }
  catch (error) {
    console.error('Error fetching data:', error);
  }
});

</script>
