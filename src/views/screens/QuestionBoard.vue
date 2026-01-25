<script setup lang="ts">

import type { Player } from '../../types';
import { socket } from '../../plugins/plugins';
import { computed, ref } from 'vue';
import PlayerView from '../components/PlayerView.vue';
import type { Question, QuestionCategory } from '../../plugins/questions';

const props = defineProps<{
  players:Player[],
  isHostView?: boolean
  room_id?: string
  allAvailableCategories:QuestionCategory[]
}>();

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

const askQuestion = (question:Question, player:Player | undefined) => {

  if (!player) {return}

  console.log(`Asking question: ${question.question}`);
  socket.emit('ask_question', {player: player, 'question': question, 'room_id': props.room_id });

};

const setTurn = (index: number) => {
    playerTurn.value = index;
};

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
          @click="setTurn(index)"
          />
     </aside>
      <div class="question_board" v-if="props.players[playerTurn]">
        <div class="question_category_box" v-for="category in questionBoard" :key="category.name">
          <h2>{{ category.name }}</h2>
          <div :class="`question_box ${question.state}`" @click="askQuestion(question, currentPlayer)" v-for="question in category.questions" :key="question.value">
            <p>{{ question.value }}</p>
          </div>
        </div>
      </div>
   </main>
</template>

<style scoped>
/* Base Container - Full Screen */
.screen_container {
  display: flex;
  flex-direction: row;
  gap: 0; /* Removed gap to make the border-right more seamless */
  background-color: #121212; /* Slightly deeper dark mode */
  height: 100vh;
  width: 100vw;

  font-family: sans-serif;
}

/* Sidebar - Optimized for Landscape */
.player_list {
  width: 220px;
  height: 100%;
  overflow-y: auto;
  border-right: 2px solid #333;
  background-color: #1a1a1a;
  box-sizing: border-box;
  padding: 10px;
}

/* The Game Board */
.question_board {
  width: calc(100% - 220px);
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: row;
  background-color: #1e1e1e;
  overflow: auto;
  padding: 10px;
  box-sizing: border-box;
}

/* Category Columns */
.question_category_box {
  display: flex;
  height: auto;
  flex-direction: column;
  flex: 0 0 200px;
  gap: 10px;
  padding: 5px;
  overflow-y: auto;
  align-items: center;
  justify-content: center;
}

.question_category_box h2 {
  font-size: 1rem;
  text-align: center;
  margin-bottom: 10px;
}

/* The Individual Tiles */
.question_box {
  width: 80%;
  aspect-ratio: 5/3; /* Keeps tiles nicely proportioned */
  background-color: #121212; /* Classic Blue Jeopardy vibe */
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: transform 0.1s ease, background-color 0.2s;
}

.question_box:hover {
  transform: scale(1.02);
  filter: brightness(1.2);
}

.question_box p {
  color: #fff;
  font-weight: bold;
  font-size: 2.8rem;
  margin: 0;
}

/* Answer States */
.correct {
  background-color: #4caf50 !important;
  border-color: #2e7d32;
}

.wrong {
  background-color: #f44336 !important;
  border-color: #c62828;
}

@media (max-height: 600px), (max-width: 800px) {
.question_category_box {
    flex: 0 0 33%; /* or whatever width you want */
  }

  .question_category_box h2 {
    font-size: 1.1rem;
    margin-bottom: 15px;
  }

  .question_box {
    min-height: 40px;
    width: 80%;
  }
}
</style>
