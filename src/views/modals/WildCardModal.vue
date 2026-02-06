<script setup lang="ts">
import {socket} from '../../plugins/plugins'
import type { WildCardType } from '../../plugins/wildcards';
import WildCard from '../components/WildCard.vue';



const props = defineProps<{
  roomId: string
  wildCard:WildCardType
  isVisible:boolean
}>()

const closeModal = () => {
  console.log('I am sending it I think...')
  socket.emit('hide_wild_card', {'room_id':props.roomId})
}

</script>

<template v-if="props.isVisible">
  <div class="wildcard-modal" v-motion-fade>
    <WildCard :wildCard="props.wildCard" />
    <button @click="closeModal">Close</button>
  </div>
</template>

<style scoped>


.wildcard-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100dvw;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  background-color: #333;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  box-sizing: border-box;
  background-color: rgba(0,0,0,0.2);
}
</style>