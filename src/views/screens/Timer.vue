<script setup lang="ts">
import { socket } from '../../plugins/plugins'
import { onMounted, ref } from 'vue'
import { playKeySound } from '../../plugins/soundEffects';

const props = defineProps<{
  isHostView: boolean
  room_id?: string
}>()

type TimerState = 'paused' | 'running' | 'idle' | 'finish'

// ---------------- STATE ----------------
const gameState = ref<TimerState>('idle')
const timeLeft = ref(120)
let timer: number | null = null

// ---------------- TIMER ----------------
const startTimer = () => {
  if (timer) return
  gameState.value = 'running'

  timer = window.setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      playKeySound('3');
      stopTimer('finish')
    }
  }, 1000)
}

const stopTimer = (newState: TimerState) => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  gameState.value = newState
}

const resetGame = () => {
  stopTimer('idle')
  timeLeft.value = 120
}

// ---------------- SOCKET EMITS ----------------
const hostStartTimer = () => {
  if (!props.room_id) return
  socket.emit('start_timer', { room_id: props.room_id })
}

const hostPauseTimer = () => {
  if (!props.room_id) return
  socket.emit('pause_timer', { room_id: props.room_id })
}

const hostRestartTimer = () => {
  if (!props.room_id) return
  socket.emit('restart_timer', { room_id: props.room_id })
}

const addSeconds = (seconds: number) => {
  if (!props.room_id) return
  socket.emit('add_seconds', { room_id: props.room_id, seconds })
}

// ---------------- SOCKET LISTENERS ----------------
onMounted(() => {

  socket.on('timer_started', () => {
    startTimer()
  })

  socket.on('timer_paused', () => {
    stopTimer('paused')
  })

  socket.on('timer_restarted', resetGame)

  socket.on('seconds_added', (data: { new_time: number }) => {
    timeLeft.value += data.new_time
  })

})

// ---------------- TIMER TEXT ----------------
function timeText(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>

<template>
  <main class="screen_container">
    <div class="timer_text">
      <h1 v-if="gameState != 'finish'">{{ timeText(timeLeft) }}</h1>
      <h1 v-if="gameState == 'finish'">00:00</h1>
    </div>

    <div v-if="isHostView" class="host_controls">
      <button @click="addSeconds(30)">Add 30s</button>
      <button @click="addSeconds(-30)">Remove 30s</button>
      <button @click="hostStartTimer">Start</button>
      <button @click="hostPauseTimer">Pause</button>
      <button @click="hostRestartTimer">Reset</button>
    </div>
  </main>
</template>

<style scoped>
.screen_container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0px;
  margin: 0;
}

.timer_text {
  display: flex;
  flex-direction: column;
  
}

.timer_text h1{
  font-size: clamp(0rem, 12vw, 16rem);
  margin: 0;
  padding: 0px;
  margin: 0px;
}
</style>