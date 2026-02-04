<script setup lang="ts">
import { ref } from 'vue'
import type { Player } from '../../types'
import PlayerView from '../components/PlayerView.vue'
import { getRandomString, socket } from '../../plugins/plugins'

const props = defineProps<{
  players: Player[]
  room_id: string
}>()

// --- STATE ---
const isModalOpen = ref(false)
const name = ref('')

// --- METHODS ---
const createPlayer = () => {
  if (!name.value.trim()) return

  const newPlayerId = getRandomString(5)

  socket.emit('create_new_player', {
    name: name.value,
    id: newPlayerId,
    room_id: props.room_id,
  })

  name.value = ''
  isModalOpen.value = false
}
</script>

<template>
  <div class="player-admin-screen">

    <!-- HEADER -->
    <div class="header">
      <h2>Room: {{ props.room_id }}</h2>
      <button class="add-player-btn" @click="isModalOpen = true">
        + Add Player
      </button>
    </div>

    <!-- PLAYER LIST -->
    <div class="player-grid">
      <div
        v-for="player in props.players"
        :key="player.id"
        class="player-admin-item"
      >
        <PlayerView
          :player="player"
          :isHostView="true"
          :room_id="props.room_id"
        />
      </div>
    </div>

    <!-- MODAL -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="modal-background" @click.self="isModalOpen = false">
        <div class="modal-container" v-motion-fade>
          <h3>Add Player</h3>

          <input
            v-model="name"
            placeholder="Enter player name"
            @keyup.enter="createPlayer"
          />

          <div class="modal-actions">
            <button @click="createPlayer">Add</button>
            <button class="secondary" @click="isModalOpen = false">Cancel</button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<style scoped>
/* --- LAYOUT --- */
.player-admin-screen {
  background-color: #222;
  border-radius: 12px;
  color: #fff;
  padding: 40px;
  min-height: 100dvh;
  box-sizing: border-box;
}

/* --- HEADER --- */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.add-player-btn {
  padding: 10px 14px;
  border-radius: 8px;
  border: none;
  font-weight: bold;
  cursor: pointer;
}

/* --- PLAYER GRID --- */
.player-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.player-admin-item {
  width: 100%;
}

/* --- MODAL --- */
.modal-background {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-container {
  background: #333;
  padding: 20px;
  border-radius: 12px;
  width: min(90vw, 400px);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-container input {
  padding: 10px;
  border-radius: 6px;
  border: none;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.modal-actions button {
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.modal-actions .secondary {
  background: #555;
  color: #fff;
}
</style>
