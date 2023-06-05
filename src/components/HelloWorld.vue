<template>
  <div class="hello">
    <DanmuMessage v-for="item, index in 10" :key="index" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import DanmuMessage from './DanmuMessage.vue';

import DanmuWebSocket from '@/utils/DanmuWebSocket';

onMounted(() => {
  const ws = new DanmuWebSocket(156277);
  ws.connect().then((message) => {
    console.log(message);
  }).catch((err) => {
    console.log(err);
  });
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
