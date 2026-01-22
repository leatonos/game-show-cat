<script setup lang="ts">

import { socket } from '../../plugins/plugins';

const props = defineProps<{
  player: {
    id: string;
    name: string;
    score: number;
  }
  isHostView?: boolean
  room_id?: string
}>();

const changeScore = (amount: number) => {
  socket.emit('update_score', { 'player_id': props.player.id, 'score': props.player.score + amount, 'room_id': props.room_id });
};

const deletePlayer = () => {
  socket.emit('delete_player', { 'player_id': props.player.id, 'room_id': props.room_id });
};

</script>



<template>
    <div v-motion-fade class="player-item">
      <h3 class="player_name">{{ player.name }}</h3>
      <p class="score">{{ player.score }}</p>
      <div v-if="isHostView">
        <div class="button-line">
          <button @click="changeScore(50)" class="score-button">+50</button>
          <button @click="changeScore(100)" class="score-button">+100</button>
          <button @click="changeScore(250)" class="score-button">+250</button>
        </div>
        <div class="button-line">
          <button @click="changeScore(-50)" class="score-button">-50</button>
          <button @click="changeScore(-100)" class="score-button">-100</button>
          <button @click="changeScore(-250)" class="score-button">-250</button>
        </div>
        <button @click="deletePlayer" class="delete-button">Delete</button>
      </div>
    </div>
</template>

<style scoped>

.button-line{
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-bottom: 5px;
}

.player-item {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 0;
  border-radius: 5px;
  background-color: #242424;
  width: 100%;
  box-sizing: border-box;
}

.player_name{
  font-size: 2em;
  margin-bottom: 0px;
}

.delete-button{
  width: 30%;
  text-align: center;
  padding: 10px 0px;
  box-sizing: border-box;
  background-color: #ff4d4d;
  color: white;
}

.score-button{
 width: 30%;
 text-align: center;
 padding: 10px 0px;
 box-sizing: border-box;
}

.score {
  font-size: 1.5em;
  font-weight: bold;
  color: #42b983;
}
</style>
