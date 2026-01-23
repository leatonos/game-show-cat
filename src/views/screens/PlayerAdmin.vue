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
      <div  v-for="player in props.players" :key="player.id" class="player-admin-item">
        <PlayerView 
         :key="player.id" 
         :player="player" 
         :isHostView="true"
         :room_id="props.room_id"
          />
      </div>
    </div>

</template>

<style scoped>
.player-admin-screen {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1em;
  padding: 20px;
  background-color: #222;
  border-radius: 8px;
  color: #fff;
}
.player-admin-item{
  width: 23%;
}
</style>