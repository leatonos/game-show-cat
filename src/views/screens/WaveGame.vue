<script setup lang="ts">
import { socket } from '../../plugins/plugins';
import { onMounted, onUnmounted, ref } from 'vue';
import { oppositesList, type Opposites } from '../../plugins/opposites';

const props = defineProps<{
  isHostView: boolean
  room_id: string
}>();

// --- STATE --- //
const isVisible = ref(true)
const isRollingOpposites = ref(false)
const range = ref(0)
const pointer = ref(0)
const opposites = ref<Opposites>({
    left: 'Anything',
    right: 'Everything'
})

// --- SOCKET LOGIC --- //
onMounted(() => {
    
    socket.on('show_range', () => { 
        isVisible.value = !isVisible.value
    })

  socket.on('got_random_range', ({ random_number }: { random_number: number }) => {
    range.value = random_number
  })

  socket.on('got_random_opposites', ({ random_index }: { random_index: number }) => {
    if (isRollingOpposites.value) return
    isRollingOpposites.value = true

    let ticks = 0
    const maxTicks = 15

    const shuffle = setInterval(() => {
      const i = Math.floor(Math.random() * oppositesList.length)
      opposites.value = oppositesList[i]!
      ticks++

      if (ticks >= maxTicks) {
        clearInterval(shuffle)

        setTimeout(() => {
          opposites.value = oppositesList[random_index]!
          isRollingOpposites.value = false
        }, 200)
      }
     }, 90)
  })


  socket.on('pointer_moved', ({ degrees }: { degrees: number }) => {
      pointer.value += degrees
  })

})

onUnmounted(() => {
  socket.off('show_range')
  socket.off('got_random_range')
  socket.off('got_random_opposites')
  socket.off('pointer_moved')
})

// --- FUNCTIONS --- //
const getRandomRange = () => {
    socket.emit('get_random_range',{'room_id':props.room_id})
}

const getRandomOpposites = () => {
    socket.emit('get_random_opposites', {'room_id':props.room_id,'length': oppositesList.length,})
}

const movePointer = (degrees: number) => {
    socket.emit("move_pointer",{degrees:degrees,room_id:props.room_id})
}

const ToggleRange = () =>{
    socket.emit('toggle_range',{room_id:props.room_id})
}

</script>

<template>
  <main class="screen_container">
    <div class="wave_dial_container">
      <div class="dial_mask">
        <img class="dial_part small_circle" src="../../assets/wave-game/small-semicircle.svg" alt="Small Dial" />

        <img  class="dial_part pointer" src="../../assets/wave-game/pointer.svg" 
          :style="{ 
            transform: `translateY(-2vw) rotate(${pointer}deg)`,
            transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
          }"
        />  

        <img 
          v-if="isVisible"class="dial_part range" src="../../assets/wave-game/range.svg" 
          :style="{ 
            transform: `rotate(${range}deg)`,
            transition: 'transform 0.6s ease-out'
          }"
        />
      </div>

      <img class="dial_part big_circle" src="../../assets/wave-game/big-semicircle.svg" alt="Big Dial" />
    </div>

    <div class="dial_question">
      <div class="side side_a">{{ opposites.left }}</div>
      <div class="side side_b">{{ opposites.right }}</div>
    </div>
  </main>

  <aside class="host_controls" v-if="isHostView">
    <h3>Commands</h3>
    <button @click="getRandomRange">Get Range</button>
    <button @click="ToggleRange">Toogle Range</button>
    <button @click="getRandomOpposites">Get Opposites</button>
    <h3>Pointer move</h3>
    <button @click="movePointer(5)">+5</button>
    <button @click="movePointer(-5)">-5</button>
  </aside>
</template>

<style scoped>
.screen_container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #1a1a1a;
  overflow: hidden;
}

.wave_dial_container {
  position: relative;
  height: 30vw; /* half of width for semicircle */
  width: 60vw;
  margin-bottom: 30px;
}

.dial_mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 2;
}

.dial_part {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.big_circle { z-index: 1; }
.range {
  z-index: 2;
  transform-origin: 50% 100%;
}
.pointer {
  z-index: 3;
  transform-origin: 50% 100%;
}
.small_circle { z-index: 4; }

.dial_question {
  display: flex;
  gap: 20px;
}

.side {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 180px;
  height: 80px;
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  border-radius: 8px;
}

.side_a { background-color: #ef4444; }
.side_b { background-color: #3b82f6; }

.host_controls {
  position: fixed;
  top: 0;
  left: 0;
  width: 220px;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 10px;
  z-index: 1;
}

button {
  padding: 10px;
  cursor: pointer;
}

/* ---------------------------
   Mobile: full screen controls
---------------------------- */
@media (max-width: 768px), (max-height: 500px) {
  .host_controls {
    width: 100vw;
    height: 100vh;
    padding: 16px;
    z-index: 999;
    box-sizing: border-box;

    /* key changes */
    justify-content: flex-start;
    overflow-y: auto;
  }

  .host_controls h3 {
    margin-top: 8px;
    margin-bottom: 4px;
  }

  .host_controls button {
    width: 100%;
    padding: 12px;
    font-size: 1rem;
  }

  /* 👇 grid layout for buttons */
  .host_controls {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  /* headers span full width */
  .host_controls h3 {
    grid-column: 1 / -1;
    text-align: center;
  }
}


</style>