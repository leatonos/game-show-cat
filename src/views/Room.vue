<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { socket } from '../plugins/plugins'
import type { Player } from '../types'
import PlayerView from './components/PlayerView.vue'

const route = useRoute()
const roomId = route.params.roomId as string
const messages = ref<string[]>([])
const players = ref<Player[]>([])

// 1. Reactive sorted list
const sortedPlayers = computed(() => {
  // We spread into a new array [...players.value] because .sort() mutates the original
  return [...players.value].sort((a, b) => b.score - a.score)
})

onMounted(() => {
  socket.emit('join_room', roomId)

  socket.on('room-message', (data: any) => {
    messages.value.push(data.text)
  })

  socket.on('player_created', (newPlayer: Player) => {
    players.value.push(newPlayer)
  })

  // 2. Listen for score updates to trigger the re-sort
  socket.on('score_updated', ({ player_id, score }: { player_id: string, score: number }) => {
    console.log('Score update received for', player_id, 'new score:', score)
    const player = players.value.find(p => p.id === player_id)
    if (player) {
      player.score = score
    }
  })
})
</script>

<template>
  <main class="room">
    <h1>Room: {{ roomId }}</h1>
    
    <TransitionGroup name="list" tag="div" class="players-container">
      <PlayerView 
        v-for="player in sortedPlayers" 
        :key="player.id" 
        :player="player" 
      />
    </TransitionGroup>
  </main>
</template>

<style scoped>
.room {
  width: 100%;
  padding: 20px;
}

.players-container {
  display: flex;
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
  transform: translateY(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>