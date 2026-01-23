<script setup lang="ts">

import type { Player } from '../../types';
import { socket } from '../../plugins/plugins';
import { ref } from 'vue';
import PlayerView from '../components/PlayerView.vue';
import type { Question } from '../../questions';

const props = defineProps<{
  players:Player[],
  isHostView?: boolean
  room_id?: string
}>();

const playerTurn = ref<number>(0);

const askQuestion = (question:Question) => {
  console.log(`Asking question: ${question.question}`);
  socket.emit('ask_question', { 'question': question, 'room_id': props.room_id });
};

</script>



<template>
   <main class="screen_container">

     <aside class="player_list">
        <PlayerView 
          v-for="player in props.players" 
          :key="player.id" 
          :player="player" 
          :isHostView="props.isHostView"
          :room_id="props.room_id"
          />
     </aside>
        <div class="question_board" v-if="props.players[playerTurn]">
          <div class="question_category_box" v-for="category in props.players[playerTurn]?.chosenCategories" :key="category.name">
            <h2>{{ category.name }}</h2>
            <div class="question_box" v-for="question in category.questions" :key="question.value">
              <p>{{ question.value }}</p>
            </div>
          </div>
          <div class="question_category_box" v-for="category in props.players[playerTurn]?.chosenCategories" :key="category.name">
            <h2>{{ category.name }}</h2>
            <div class="question_box" @click="askQuestion(question)" v-for="question in category.questions" :key="question.value">
              <p>{{ question.value }}</p>
            </div>
          </div>
     </div>
   </main>
</template>

<style scoped>

.screen_container{
  display: flex;
  flex-direction: row;
  gap: 20px;
  background-color: #1e1e1e;
  border-radius: 8px;
  box-sizing: border-box;
  height: calc(100vh - 60px);
}
.player_list{
  width: 250px;
  height: 100%;
  overflow-y: auto;
  border-right: 1px solid #444;
  box-sizing: border-box;
}

.question_board{
  width: calc(100% - 250px);
  padding: 0px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #1e1e1e;
  border-radius: 8px;
  box-sizing: border-box;
  height: 100%;
  overflow-y: auto;
}

.question_category_box{
  padding: 10px;
  border-radius: 5px;
  width: 25%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.question_box{
  width: 50%;
  background-color: #444;
  border-radius: 5px;
  padding: 10px;
  margin: 5px 0px;
  text-align: center;
}
</style>
