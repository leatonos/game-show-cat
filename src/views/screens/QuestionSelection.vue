<script setup lang="ts">

import { socket } from '../../plugins/plugins';
import type { Player } from '../../types';
import { type QuestionCategory } from '../../questions';
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
    .question_selection_component{
        display: flex;
        gap: 20px;
    }
    .player_list{
        display: flex;
        flex-direction: column;
    }
    .player_box{
        border: 1px solid #ccc;
        padding: 10px;
        margin: 5px;
        border-radius: 5px;
        transition: 
            background-color 0.3s ease,
            transform 0.25s ease,
            box-shadow 0.25s ease;
    }
     .player_box.active {
        background: #4caf50;
        color: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    }
    .category_list{
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
    }
    .category_box{
        border: 1px solid #ccc;
        padding: 10px;
        margin: 5px;
        max-height: fit-content;
        border-radius: 5px;
        text-align: center;
    }

   

</style>
