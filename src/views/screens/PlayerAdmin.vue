<script setup lang="ts">
import type { Player } from '../../types';
import PlayerView from '../components/PlayerView.vue';

const props = defineProps<{
  players: Player[]
  room_id: string
}>();

</script>

<template>
    <div class="player-admin-screen">
       <PlayerView 
        v-for="player in props.players" 
        :key="player.id" 
        :player="player" 
        :isHostView="true"
        :room_id="props.room_id"
         />
    </div>

</template>

<style scoped>
.player-admin-screen {
  display: flex;
  padding: 20px;
  background-color: #222;
  border-radius: 8px;
  color: #fff;
}
</style>