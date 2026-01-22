<script setup lang="ts">

import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { socket } from '../plugins/plugins'
import type { Player } from '../types'
import PlayerView from './components/PlayerView.vue'
import QuestionSelection from './screens/QuestionSelection.vue'
import { questionCategories, type QuestionCategory } from '../questions'

const route = useRoute()
const roomId = route.params.roomId as string
const players = ref<Player[]>([])
const activeScreen = ref<string>('question_setup')
const allQuestionCategories = ref(questionCategories)

// 1. Reactive sorted list
const sortedPlayers = computed(() => {
  // We spread into a new array [...players.value] because .sort() mutates the original
  return [...players.value].sort((a, b) => b.score - a.score)
})

onMounted(() => {
  socket.emit('join_room', roomId)

  socket.on('player_created', (newPlayer: Player) => {
    players.value.push(newPlayer)
  })

  socket.on('player_deleted', (deletedPlayerId) => {
    players.value = players.value.filter(p => p.id !== deletedPlayerId)
  })

  socket.on('score_updated', ({ player_id, score }: { player_id: string, score: number }) => {
    console.log('Score update received for', player_id, 'new score:', score)
    const player = players.value.find(p => p.id === player_id)
    if (player) {
      player.score = score
    }
  })

  socket.on('data_sync', ({ players: syncedPlayers, all_categories }: { players: Player[], all_categories: QuestionCategory[] }) => {
    console.log("Room synchronized from server.")
    players.value = syncedPlayers
    allQuestionCategories.value = all_categories
  })

  socket.on('player_chose_category', ({ player_id, category }: { player_id: string, category: string }) => {
    const player = players.value.find(p => p.id === player_id);
    const categoryItem = allQuestionCategories.value.find(cat => cat.name === category);

    // If either is missing, stop execution
    if (!player || !categoryItem) {
      console.warn("Player or Category not found");
      return;
    }

    // Now TypeScript knows 'categoryItem' is defined
    categoryItem.isChosen = true;

    console.log(allQuestionCategories.value);
    player.chosenCategories.push(categoryItem)
    
  });

  socket.on('screen_changed', (data: { screen: string }) => {
    console.log("Screen change received:", data.screen);
    activeScreen.value = data.screen
  })

})

</script>

<template>
  <main class="room">
    <!-- <h1>Room: {{ roomId }}</h1> -->
     <p>{{ activeScreen }}</p>
    <TransitionGroup v-if="activeScreen == 'players'" name="list" tag="div" class="players-container">
      <PlayerView 
        v-for="player in sortedPlayers" 
        :key="player.id" 
        :player="player" 
      />
    </TransitionGroup>
    <div v-if="activeScreen == 'question_selector'">
      <QuestionSelection :allQuestionCategories="allQuestionCategories" :room_id="roomId" :players="players" />
    </div>
  </main>
</template>

<style scoped>

.room {
  width: 100%;
  padding: 20px;
}

.players-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  position: relative; /* Important for internal transitions */
}

/* 4. The Magic: Smooth movement for elements changing position */
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(80px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>