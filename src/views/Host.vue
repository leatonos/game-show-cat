<script setup lang="ts">

import { onMounted, ref } from 'vue';
import {socket,getRandomString} from '../plugins/plugins';
import NewPlayer from './modals/NewPlayer.vue';
import type { Player } from '../types';
import PlayerAdmin from './screens/PlayerAdmin.vue';


const createRoom = () => {
  const roomId = getRandomString(5)
  const roomIdtest = 'test'
  socket.emit('create_room', roomIdtest );
};

interface GridButton {
  label: string;
  action: string;
}

//States
const isGameReady = ref<boolean>(false)
const roomId = ref<string>('Game not ready')
const isModalOn = ref<boolean>(false)
const screenState = ref<string>('controls')
const players = ref<Player[]>([])


//Functions
const closeModal = () =>{
  console.log("Testing close btn")
  isModalOn.value = false
  screenState.value = 'controls'
}

//Buttons list
const buttons = ref<GridButton[]>([
  { label: 'Add Player', action: 'add_player' },
  { label: 'Players', action: 'show_players' },
  { label: 'Questions', action: 'show_questions' },
  { label: 'Help', action: 'get_help' }
]);

//Button Handler
const handleButtonClick = (action: string) => {
  // Define what each action does in a clean lookup table
  const actions: Record<string, () => void> = {
    add_player: () => {isModalOn.value = true;screenState.value = 'add_player';},
    show_players: () => screenState.value = 'players',
    show_questions: () => socket.emit('get_questions'),
    get_help: () => window.open('https://wiki.yourgame.com'),
    open_shop: () => alert('Welcome to the Shop!')
  };

  // Execute the function if it exists, otherwise log a warning
  if (actions[action]) {
    actions[action]();
  } else {
    console.warn(`No logic defined for action: ${action}`);
  }
};


//Socket Listeners
onMounted(() => {

  socket.on('connect', () => {
    console.log('Connected! ID:', socket.id);
  });
 
  socket.on('room_created', (data)=>{
    isGameReady.value = true
    roomId.value = data.result
  })

  socket.on('player_created',(newPlayer)=>{
    players.value.push(newPlayer)
  })

  socket.on('score_updated', (data) => {
    const updatedPlayer = players.value.find(player => player.id === data.player_id);
    if (updatedPlayer) {
      updatedPlayer.score = data.score;
    }
    socket.emit('update_players', { 'players': players.value, 'room_id': roomId.value});
  })

  socket.on('player_deleted', (deletedPlayerId) => {
    players.value = players.value.filter(p => p.id !== deletedPlayerId.player_id)
  })

})

</script>

<template>
  <div v-if="!isGameReady" v-motion-fade>
    <button @click="createRoom">Start game</button>
  </div>

  <div class="game-control-container" v-if="isGameReady">
    <h1>Game id: {{ roomId }}</h1>
    <p>{{ screenState }}</p>
    <div v-if="screenState != 'controls'">
      <button @click="screenState = 'controls'">Back</button>
    </div>
    <div v-if="screenState == 'controls'" class="control-grid">
      <button 
        v-for="btn in buttons" 
        :key="btn.action" 
        class="control-button"
        @click="handleButtonClick(btn.action)"
      >
        {{ btn.label }}
      </button>
    </div>
    <div v-if="screenState == 'players'">
      <PlayerAdmin :room_id="roomId" :players="players" />
    </div>
  </div>
  <Teleport to="body">
    <div v-if="isModalOn" class="modal-background">
      <div class="modal-container">
        <NewPlayer
          :roomId="roomId"
          v-if="screenState == 'add_player'"
          @closeThisModal="closeModal"
        />
      </div>
  </div>
  </Teleport>
  
</template>

<style scoped>

.modal-background{
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  z-index: 999;
  background-color: rgba(0,0,0,0.5);
}

.modal-container{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80%;
  height: 80%;
  border-radius: 8px;
  box-sizing: border-box;
}
.game-control-container {
  text-align: center;
  margin: 20px;
}
.control-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr); 
  gap: 15px;
  max-width: 100%;
  margin: 20px auto;
}

.control-button {
  /* Layout */
  display: flex;
  justify-content: center;
  align-items: center;
  
  /* Sizing & Spacing */
  padding: 20px;
  width: 100%;
  aspect-ratio: 1 / 1; /* Optional: Makes buttons perfect squares */

  /* Visuals */
  font-weight: bold;
  background-color: black;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
}
</style>
