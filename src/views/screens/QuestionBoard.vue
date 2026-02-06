<script setup lang="ts">

import type { Player } from '../../types';
import { socket } from '../../plugins/plugins';
import { computed, onMounted, ref } from 'vue';
import PlayerView from '../components/PlayerView.vue';
import type { Question, QuestionCategory } from '../../plugins/questions';
import { wildCardLibrary } from '../../plugins/wildcards';

const props = defineProps<{
  players:Player[],
  isHostView?: boolean
  room_id?: string
  allAvailableCategories:QuestionCategory[]
}>();


// States
const playerTurn = ref<number>(0);

// use computed to get the current player based on playerTurn
const currentPlayer = computed(() => {
  return props.players[playerTurn.value];
});

//find all questions for the current player 
const questionBoard = computed(() => {
  const player = currentPlayer.value;
  if (!player) {
    return [];
  }
  const categories: QuestionCategory[] = [];

  for (const categoryName of player.chosenCategories) {
    const category = props.allAvailableCategories.find(cat => cat.name === categoryName);
    if (category) {
      categories.push(category);
    }
  }
  return categories;
});

const askQuestion = (question:Question, player:Player | undefined,index:number,wildCardLocation:number) => {

  if (!player) {return}

  if(index==wildCardLocation){
    const randomWildCardNumber = Math.floor(Math.random() * wildCardLibrary.length)
    console.log('Random Number: '+randomWildCardNumber)
    const randomWildCard = wildCardLibrary[randomWildCardNumber]
    console.log('Random Card: '+randomWildCard)
    socket.emit('show_wild_card',{'room_id':props.room_id,'wild_card':randomWildCard})
  }

  console.log(`Asking question: ${question.question}`);
  socket.emit('ask_question', {player: player, 'question': question, 'room_id': props.room_id });
  
};

const setTurn = (index: number) => {
    socket.emit('change_turn', {'room_id':props.room_id,'turn':index})
};


// ---------------- SOCKET LISTENERS ----------------
onMounted(() => {

  socket.on('turn_changed', (data: { turn: number }) => {
    playerTurn.value = data.turn;
  })

})

</script>

<template>
   <main class="screen_container">
     <aside class="player_list">
      <PlayerView 
        v-for="(player, index) in props.players" 
        :key="player.id" 
        :player="player" 
        :isHostView="props.isHostView"
        :room_id="props.room_id"
        :class="{ active: index === playerTurn }"
        @click="setTurn(index)"
      />
    </aside>
      <div class="question_board" v-if="props.players[playerTurn]">
        <div class="question_category_box" v-for="category in questionBoard" :key="category.name">
          <h2>{{ category.name }}</h2>
          <p>{{ category.wildCardLocation }}</p>
          <div v-for="(question, index) in category.questions" :class="`question_box ${question.state}`" @click="askQuestion(question, currentPlayer, index, category.wildCardLocation!)"  :key="question.value">
            <p>{{ question.value }}</p>
          </div>
        </div>
      </div>
   </main>
   
</template>

<style scoped>
/* ---------------- SCREEN ---------------- */
.screen_container {
  display: flex;
  height: 100dvh;
  width: 100vw;
  background-color: #121212;
  overflow: hidden;
}

/* ---------------- PLAYER LIST ---------------- */
.player_list {
  flex: 0 0 280px;
  background-color: #1a1a1a;
  border-right: 2px solid #333;
  padding: 0px 10px;
  overflow-y: auto;
  box-sizing: border-box;
}

/* ---------------- QUESTION BOARD ---------------- */
.question_board {
  flex: 1;
  display: flex;
  gap: 12px;
  padding: 10px;
  background-color: #1e1e1e;
  overflow-x: auto;
  overflow-y: hidden;
}

/* ---------------- CATEGORY COLUMN ---------------- */
.question_category_box {
  flex: 0 0 clamp(160px, 22vw, 220px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  height: 100%;
}

/* ---------------- CATEGORY TITLE ---------------- */
.question_category_box h2 {
  font-size: clamp(0.9rem, 2.5vw, 1.1rem);
  text-align: center;
}

/* ---------------- QUESTION TILE ---------------- */
.question_box {
  flex: 1;
  min-height: 0;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: #121212;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.15s ease, filter 0.2s ease;
}

/* ---------------- TILE TEXT ---------------- */
.question_box p {
  font-size: clamp(1rem, 3vw, 2.4rem);
  font-weight: bold;
  color: white;
  text-align: center;
  line-height: 1;
}

/* ---------------- HOVER ---------------- */
.question_box:hover {
  transform: scale(1.04);
  filter: brightness(1.2);
}

/* ---------------- STATES ---------------- */
.correct {
  background-color: #4caf50 !important;
}

.wrong {
  background-color: #f44336 !important;
}

/* ---------------- MOBILE ---------------- */
@media (max-width: 768px) {
  .screen_container {
    flex-direction: column;
  }

  .player_list {
    flex: none;
    width: 100%;
    display: flex;
    gap: 8px;
    border-right: none;
    border-bottom: 2px solid #333;
    overflow-x: auto;
  }

  .question_category_box {
    flex: 0 0 70vw;
  }
}

/* ---------------- SMALL PHONES ---------------- */
@media (max-width: 480px) {
  .question_category_box {
    flex: 0 0 85vw;
  }

  .question_box p {
    font-size: 1.8rem;
  }
}


@media (min-width: 1300px) {
  .question_board{
    justify-content: center;
  }

  .question_box p{
    font-size: 4.4rem;
  }
  
}


</style>