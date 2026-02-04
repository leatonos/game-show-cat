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
                <span class="player_badge">{{ player.chosenCategories.length }}</span>
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

/* ---------------- SCREEN ---------------- */
.question_selection_component {
  display: flex;
  gap: 16px;
  height: 100dvh;
  background-color: #121212;
  padding: clamp(12px, 3vw, 30px);
  box-sizing: border-box;
  overflow: hidden;
}

/* ---------------- PLAYER LIST ---------------- */
.player_list {
  flex: 0 0 180px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  padding: 10px;
  box-sizing: border-box;
}

/* PLAYER CARD */
.player_box {
  position: relative;
  background-color: #1a1a1a;
  border: 1px solid #333;
  padding: 12px;
  border-radius: 6px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.15s ease;
  box-sizing: border-box;
}

.player_box.active {
  background-color: #4caf50;
  color: black;
  font-weight: bold;
}

/* PLAYER BADGE */
.player_badge {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #4caf50;
  color: #000;
  font-size: 0.75rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.player_box.active .player_badge {
  background-color: #fff;
}

/* ---------------- CATEGORY GRID ---------------- */
.category_list {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: clamp(8px, 2vw, 16px);
  align-content: start;
  overflow-y: auto;
}

/* CATEGORY TILE */
.category_box {
  background-color: #1e1e1e;
  border: 1px solid #333;
  border-radius: 8px;
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
  font-size: clamp(0.9rem, 3vw, 2.2rem);
  text-align: center;
}

/* ---------------- MOBILE (PORTRAIT) ---------------- */
@media (max-width: 768px) {
  .question_selection_component {
    flex-direction: column;
  }

  .player_list {
    flex: none;
    flex-direction: row;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 8px;
  }

  .player_box {
    min-width: 120px;
    flex-shrink: 0;
  }

  .category_list {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
}

/* ---------------- SMALL PHONES ---------------- */
@media (max-width: 480px) {
  .category_box p {
    font-size: 1.1rem;
  }
}


</style>
