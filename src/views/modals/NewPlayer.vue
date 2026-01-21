<script setup lang="ts">
import { ref } from 'vue'
import { getRandomString, socket } from '../../plugins/plugins'

// Register both names exactly as you requested
const emit = defineEmits(['closeThisModal'])

const props = defineProps<{
  roomId: string
}>()

const name = ref('')

const createPlayer = (newPlayerName:string) => {

  const newPlayerId = getRandomString(5)
  socket.emit('create_new_player', { 'name': newPlayerName, 'id':newPlayerId, 'room_id': props.roomId})
  name.value = ''
    
}

const closeModal = () => {
  emit('closeThisModal')
}
</script>

<template>
  <div class="new-player-modal" v-motion-fade>
    <p>{{ props.roomId }}</p>
    <input v-model="name" placeholder="Enter Player Name" @keyup.enter="createPlayer(name)" />
    <button @click="createPlayer(name)">Add Player</button>
    <button @click="closeModal">Close</button>
  </div>
</template>

<style scoped>


.new-player-modal {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  background-color: #333;
  border-radius: 8px;
}
</style>