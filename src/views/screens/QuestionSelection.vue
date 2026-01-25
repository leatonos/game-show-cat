<script setup lang="ts">

import { socket } from '../../plugins/plugins';
import type { Player } from '../../types';
import { type QuestionCategory } from '../../plugins/questions';
import { computed, ref } from 'vue';

const props = defineProps<{
    players:Player[],
    room_id:string,
    allQuestionCategories:QuestionCategory[]
}>();

const playerTurn = ref<number>(0);

const nextTurn = () => {
    if (props.players.length === 0) return;
    playerTurn.value = (playerTurn.value + 1) % props.players.length;
}

const chooseCategory = (playerIndex: number, category: string, room_id: string) => {
    const chosenPlayer = props.players[playerIndex];
    
    if (chosenPlayer) {
        socket.emit('choose_category', { 
            'player_id': chosenPlayer.id, 
            'room_id': room_id, 
            'category': category 
        });
        nextTurn();
    }
}

const availableCategories = computed(() => {
    return props.allQuestionCategories.filter(cat => !cat.isChosen);
});

</script>

<template>
    <div class="question_selection_component">
        <div class="player_list">
            <div class="player_box" v-for="(player, index) in props.players" :key="player.id" :class="{ active: index === playerTurn }" @click="playerTurn = index">
                <p>{{ player.name }}</p>
            </div>
        </div>
        <div class="category_list">
            <div 
                class="category_box" 
                @click="chooseCategory(playerTurn, category.name, props.room_id)" 
                v-for="category in availableCategories" 
                :key="category.name"
            >
                <p>{{ category.name }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>

.question_selection_component {
  display: flex;
  gap: 16px;
  height: 100vh;
  background-color: #121212;
  padding: 30px;
  box-sizing: border-box;
}

/* PLAYER LIST */
.player_list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 180px;
  flex-shrink: 0;
}

.player_box {
  background-color: #1a1a1a;
  border: 1px solid #333;
  padding: 12px;
  border-radius: 6px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.15s ease;
}

.player_box:hover {
  transform: scale(1.02);
}

.player_box.active {
  background-color: #4caf50;
  color: black;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
}

/* CATEGORY GRID — FIXED */
.category_list {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, minmax(240px, 1fr));
  gap: 12px;
  align-content: start; /* 🔑 prevents vertical spreading */
}

/* CATEGORY TILE — SIMPLE & STABLE */
.category_box {
  background-color: #1e1e1e;
  border: 1px solid #333;
  border-radius: 6px;
  min-height: 70px;
  padding: 12px;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: transform 0.15s ease, background-color 0.2s ease;
}

.category_box:hover {
  background-color: #252525;
  transform: scale(1.03);
}

.category_box p {
  margin: 0;
  color: #fff;
  font-weight: bold;
  font-size: 2.3rem;
  text-align: center;
}

/* SMALL SCREENS */
@media (max-width: 800px), (max-height: 600px) {
  .player_list {
    width: 140px;
  }

  .category_list {
    grid-template-columns: repeat(4, minmax(120px, 1fr));
  }

  .category_box {
    min-height: 60px;
  }

  .category_box p {
    font-size: 0.9rem;
  }
}


</style>
