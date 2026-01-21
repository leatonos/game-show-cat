<script setup lang="ts">

import { onMounted, ref } from 'vue';
import {socket} from '../plugins/plugins';


const message = ref('');

onMounted(() => {
  socket.on('my-event', (data: any) => {
    message.value = data.text;
  });
});

</script>

<template>
  <div v-motion-fade>

  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
