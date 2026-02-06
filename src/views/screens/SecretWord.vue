<script setup lang="ts">
import { socket } from '../../plugins/plugins'
import { onMounted, ref } from 'vue'
import { secretWords } from '../../plugins/secretWords'

const props = defineProps<{
  isHostView: boolean
  room_id?: string
}>()

type WordGameState = 'paused' | 'running' | 'idle' | 'finish'

// ---------------- STATE ----------------
const allWordsAvailable = ref<string[]>([...secretWords])
const guessingWord = ref<string>('')
const gameState = ref<WordGameState>('idle')
const score = ref(0)
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
      stopTimer('finish')
    }
  }, 1000)
}
const stopTimer = (newGameState:WordGameState) => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  gameState.value = newGameState
}
const resetGame = () => {
  stopTimer('idle')
  timeLeft.value = 120
  score.value = 0
  allWordsAvailable.value = [...secretWords]
}



// ---------------- SOCKET EMITS ----------------
const startGameCommand = () => {

  if (!props.room_id) return
  if (allWordsAvailable.value.length === 0) return

  const randomNumber = Math.floor(Math.random() * allWordsAvailable.value.length)
  const newWord = allWordsAvailable.value[randomNumber]

  socket.emit('start_word_game', {'room_id': props.room_id,'word': newWord})
}

const pauseGameCommand = () => {
  if (!props.room_id) return
  socket.emit('pause_word_game', { room_id: props.room_id })
}

const restartGameCommand = () => {
  if (!props.room_id) return
  socket.emit('restart_game', { room_id: props.room_id })
}

// ---------------- WORD LOGIC ----------------
const pickNextWord = (addScore: number) => {
  if (!props.room_id) return

  // remove word locally (HOST ONLY)
  allWordsAvailable.value = allWordsAvailable.value.filter(w => w !== guessingWord.value)

  // Pick a new Word
  const randomNumber = Math.floor(Math.random() * allWordsAvailable.value.length)
  const newWord = allWordsAvailable.value[randomNumber]

  // Score to be sent to the server
  const newScore = score.value + addScore

  // send WORD, not index
  socket.emit('word_update', {
    room_id: props.room_id,
    word: newWord!,
    score:newScore
  })
}


// ---------------- SOCKET LISTENERS ----------------
onMounted(() => {

  socket.on('word_game_started', (data: { word: string }) => {
    startTimer()
    guessingWord.value = data.word
  })

  socket.on('word_game_paused', () => {
    stopTimer('paused')
  })

  socket.on('word_game_restarted', resetGame)

  socket.on('word_updated',(data: { word: string, new_score: number }) => {
    guessingWord.value = data.word
    score.value = data.new_score
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
      <h1 v-if="gameState == 'finish'">Score: {{ score }}</h1>
    </div>

    <div class="secret_word">
      <h2 v-if="gameState == 'running'">{{ guessingWord }}</h2>
    </div>

    <div v-if="isHostView" class="host_controls">
      <button @click="pickNextWord(10)">Next</button>
      <button @click="pickNextWord(0)">Skip</button>
      <button @click="startGameCommand">Start</button>
      <button @click="pauseGameCommand">Pause</button>
      <button @click="restartGameCommand">Reset</button>
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
  height: 100vh;
  padding: 0px;
  margin: 0;
  gap:10px;
}


.timer_text{
  display: flex;
  flex-direction: column;
}

.timer_text h1{
  font-size: clamp(4rem, 12vw, 16rem);
  margin: 0;
}

.secret_word h2{
  font-size: clamp(4rem, 8vw, 16rem);
  margin: 0;
}



</style>