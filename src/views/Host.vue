<script setup lang="ts">

import { onMounted, ref, watch } from 'vue';
import {socket} from '../plugins/plugins';
//import { getRandomString } from '../plugins/plugins';
import NewPlayer from './modals/NewPlayer.vue';
import type { Player } from '../types';
import { allQuestionCategories, type Question, type QuestionCategory, type QuestionState } from '../plugins/questions';

//Screen Components
import PlayerAdmin from './screens/PlayerAdmin.vue';
import QuestionSelection from './screens/QuestionSelection.vue';
import QuestionBoard from './screens/QuestionBoard.vue';
import QuestionScreen from './screens/Question.vue';
import WaveGame from './screens/WaveGame.vue';
import SecretWord from './screens/SecretWord.vue';


const createRoom = () => {
  //const roomId = getRandomString(5)
  const roomIdtest = 'game'
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
const activeScreen = ref<string>('controls')
const players = ref<Player[]>([])
const availableCategories = ref([...allQuestionCategories])
const activeQuestion = ref<Question | undefined>(undefined)
const chosenAlternative = ref<string | undefined>(undefined)

//Functions
const closeModal = () =>{
  console.log("Testing close btn")
  isModalOn.value = false
  activeScreen.value = 'controls'
}

const answerQuestion = (questionId: string, state: QuestionState) => {

  console.log("Answering question:", questionId, "with state:", state);

  for (const category of availableCategories.value) {
    const question = category.questions.find(q => q.id === questionId);

    if (question) {
      question.state = state;
      return; // stop once found
    }
  }
}

//Watcher makes updates in localStorage
watch(
  [players, availableCategories],
  ([newPlayers, newCategories]) => {
    localStorage.setItem('players', JSON.stringify(newPlayers))
    localStorage.setItem('availableCategories', JSON.stringify(newCategories))
  },
  { deep: true }
)

//Buttons list
const buttons = ref<GridButton[]>([
  { label: 'Players', action: 'show_players' },
  { label: 'Show Questions', action: 'show_questions' },
  { label: 'Choose Questions', action: 'open_question_selector' },
  { label: 'Show Wavegame', action: 'open_wavegame' },
  { label: "Show WordGame", action: "open_wordgame"},
  { label: "Load Saved Data", action: "load_saved_data"},
  { label: "Delete Saved Data & Reset Room", action: "delete_saved_data"},
  { label: "Syncronize Room", action: "synchronize_room"},
]);

//Button Handler
const handleButtonClick = (action: string) => {
  // Define what each action does in a clean lookup table
  const actions: Record<string, () => void> = {
    add_player: () => {isModalOn.value = true;activeScreen.value = 'add_player';},
    show_players: () => showPlayers(),
    show_questions: () => showQuestions(),
    open_question_selector: () => openQuestionSelector(),
    synchronize_room: () => synchronizeRoom(),
    load_saved_data: () => loadSavedData(),
    delete_saved_data: () => deleteSavedData(),
    open_wavegame: () => { socket.emit('change_screen', { room_id: roomId.value, screen: 'wave_game' })},
    open_wordgame: () => { socket.emit('change_screen', { room_id: roomId.value, screen: 'word_game' })}
  };

  // Execute the function if it exists, otherwise log a warning
  if (actions[action]) {
    actions[action]();
  } else {
    console.warn(`No logic defined for action: ${action}`);
  }
};

const openQuestionSelector = () => {
  socket.emit('change_screen', { room_id: roomId.value, screen: 'question_selector' })
}

const showQuestions = () => {
  //activeScreen.value = 'question_board'
  socket.emit('change_screen', { room_id: roomId.value, screen: 'question_board' })
}

const showPlayers = () => {
  socket.emit('change_screen', { room_id: roomId.value, screen: 'players' })
} 

const synchronizeRoom = () => {
  console.log("Synchronizing room data...");
  socket.emit('synchronize_room', { 'players': players.value, 'room_id': roomId.value, 'all_categories': availableCategories.value });
}

//Load Saved Data
const loadSavedData = () =>{
  players.value =  JSON.parse(localStorage.getItem('players') || '[]'),
  availableCategories.value = JSON.parse(localStorage.getItem('availableCategories') || '[]')
}
//Load Saved Data
const deleteSavedData = () =>{
  //Deletes Saved Data
  localStorage.clear()
  //Resets States
  availableCategories.value = allQuestionCategories
  players.value = []
  //Re-sync Room
  synchronizeRoom()
}


//Socket Listeners
onMounted(() => {

  socket.on('connect', () => {
    console.log('Connected! ID:', socket.id);
  });
 
  socket.on('room_created', (data)=>{
    isGameReady.value = true
    roomId.value = data.result
  })

  socket.on('player_created',(newPlayer:Player)=>{
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
    console.log("Player deleted:", deletedPlayerId);
    players.value = players.value.filter(p => p.id !== deletedPlayerId)
  })

  socket.on('player_chose_category', ({ player_id, category }: { player_id: string, category: string }) => {
    const player = players.value.find(p => p.id === player_id);
    console.log("Player chose category:", category);

    const categoryItem = availableCategories.value.find(cat => cat.name === category);

    // If either is missing, stop execution
    if (!player || !categoryItem) {
      console.warn("Player or Category not found");
      return;
    }

    // Now TypeScript knows 'categoryItem' is defined
    categoryItem.isChosen = true;

    console.log(availableCategories.value);
    player.chosenCategories.push(categoryItem.name)
    console.log(player)
    
  });

  socket.on('screen_changed', (data: { screen: string }) => {
    activeScreen.value = data.screen
  })

  socket.on('question_asked', (data)=>{
    chosenAlternative.value = undefined
    activeQuestion.value = data.question
    activeScreen.value = 'question'
  })

  socket.on('question_answered', ({ question_id, question_state, chosen_alternative }: { question_id: string, question_state: QuestionState, chosen_alternative: string })=>{
    console.log("Question answered:", question_id, question_state, chosen_alternative);
    answerQuestion(question_id, question_state);
    chosenAlternative.value = chosen_alternative
  })

})

</script>

<template>
  <div class="corner_button" v-if="activeScreen != 'controls'">
    <button @click="activeScreen = 'controls'">Back</button>
  </div>
  <div v-if="!isGameReady" v-motion-fade>
    <button @click="createRoom">Open game room</button>
  </div>
  <div class="game-control-container" v-if="isGameReady">
    <div v-if="activeScreen == 'controls'" class="control-grid">
      <button v-for="btn in buttons" :key="btn.action" class="control-button" @click="handleButtonClick(btn.action)">
        {{ btn.label }}
      </button>
    </div>
    
    <div v-if="activeScreen == 'players'">
      <PlayerAdmin :room_id="roomId" :players="players" />
    </div>
    <div v-if="activeScreen == 'question_selector'">
      <QuestionSelection :allQuestionCategories="availableCategories" :room_id="roomId" :players="players" />
    </div>
    <div v-if="activeScreen == 'question_board'">
      <QuestionBoard :allAvailableCategories="availableCategories" :room_id="roomId" :players="players" :isHostView="true" />
    </div>
    <div v-if="activeScreen == 'question' && activeQuestion">
      <QuestionScreen :chosenAlternative="chosenAlternative" :room_id="roomId" :question="activeQuestion" :isHostView="true" />
    </div>
    <div v-if="activeScreen == 'wave_game'">
      <WaveGame :room_id="roomId" :isHostView="true" />
    </div>
    <div v-if="activeScreen == 'word_game'">
      <SecretWord :room_id="roomId" :isHostView="true" />
    </div>
  </div>
  <Teleport to="body">
    <div v-if="isModalOn" class="modal-background">
      <div class="modal-container">
        <NewPlayer
          :roomId="roomId"
          v-if="activeScreen == 'add_player'"
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
  width: 100%;
  min-height: 100dvh;
  box-sizing: border-box;
}

.control-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: clamp(8px, 2vw, 16px);
  padding: clamp(8px, 2vw, 20px);
  max-width: 1200px;
  margin: 0 auto;
}

.corner_button {
  position: fixed;
  top: env(safe-area-inset-top, 10px);
  left: env(safe-area-inset-left, 10px);
  z-index: 1000;
}

.corner_button button {
  padding: 10px 14px;
  font-size: 14px;
  border-radius: 8px;
}

.control-button {
  display: flex;
  justify-content: center;
  align-items: center;

  aspect-ratio: 1 / 1;
  padding: clamp(12px, 3vw, 20px);

  font-size: clamp(14px, 2.5vw, 18px);
  font-weight: bold;

  background-color: black;
  color: white;
  border: none;
  border-radius: clamp(8px, 2vw, 14px);
  cursor: pointer;

  touch-action: manipulation;
}

</style>
