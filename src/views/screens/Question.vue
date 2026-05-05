<script setup lang="ts">

import type { Question } from '../../plugins/questions';
import { socket } from '../../plugins/plugins';
import { onMounted, onUnmounted, ref } from 'vue';
import { playKeySound } from '../../plugins/soundEffects';

const props = defineProps<{
  isHostView: boolean
  room_id?: string
  question?: Question,
  chosenAlternative?: string
}>();

const answerQuestion = (alternative: string) => {
  if (!props.question) return
  if (props.chosenAlternative) return

  const question_state = alternative === props.question.correct ? 'correct' : 'wrong'

  if(question_state == 'correct'){
    playKeySound('1')
  }else{
    playKeySound('2')
  }

  socket.emit('answer_question', {  
    'question_id': props.question.id, 
    'chosen_alternative': alternative, 
    'question_state': question_state, 
    'room_id': props.room_id 
  });
}

const alternativeStyles = (alternative: string) => {

  if (!props.chosenAlternative || !props.question) return 'alternative'

  // If this is the chosen answer
  if (alternative === props.chosenAlternative && props.question) {
    return alternative === props.question.correct
      ? 'alternative correct'
      : 'alternative wrong'
  }

  // If player chose wrong, reveal the correct one
  if ( props.chosenAlternative !== props.question.correct && alternative === props.question.correct) {
    return 'alternative correct'
  }

  return 'alternative'
}

const show_options = () => {
  if (!props.room_id) return
  console.log('showing alternatives')
  socket.emit('reveal_alternatives', { room_id: props.room_id })
}

onMounted(() => {
  socket.on('show_alternatives', () => {
    isVisible.value = true
  })
})

onUnmounted(() => {
  socket.off('show_alternatives')
})

const isVisible = ref(false)

</script>

<template>
   <main class="screen_container">
        <div v-if="question?.image" class="question-image-container">
          <img class="question-image" :src="`/question_images/${props.question?.image}`" />
        </div>
        <div v-if="question?.video" class="video-container">
          <div class="video-wrapper">
            <iframe
              :src="props.question?.video"
              frameborder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </div>
        <div class="question">
          <h3>{{ props.question?.question }}</h3>
        </div>
        <div v-if="isVisible" class="alternatives">
            <div :class="alternativeStyles(alt)"  v-for="(alt, index) in props.question?.alternatives" :key="index" @click="answerQuestion(alt)">
                <p>{{ alt }}</p>
            </div>
        </div>
        <div v-if="isHostView" class="host_controls">
          <button class="host_button" @click="show_options">Show Alternatives</button>
          <button class="host_button" @click="socket.emit('change_screen', { room_id: props.room_id, screen: 'question_board' })">Back to Questions</button>
        </div>
   </main>
</template>

<style scoped>

.screen_container{
    width: 100%;
    height: 100dvh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
}

.question-image-container{
  width: 80%;
}

.question-image{
  width: auto;
  max-height: 30dvh;
}

.question{
  width: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.question h3{
  font-size: 2em;
  text-align: center;
}
.alternatives{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  width: 80%;
}
.alternative{
    border: 1px solid #ccc;
    padding: 10px;
    margin: 5px;
    max-height: fit-content;
    border-radius: 5px;
    text-align: center;
    width: 25%;
    font-size: 1.8rem;
    transition: 
        background-color 0.3s ease,
        transform 0.25s ease,
        box-shadow 0.25s ease;
}

.correct{
    background-color: #4caf50;
    color: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.wrong{
    background-color: #f44336;
    color: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}   

.host_controls{
  display: flex;
  margin-top: 20px;
  justify-content: center;
  align-items: center;
  gap:10px
}

.host_controls button{
  padding: 10px 20px;
  font-size: 1em;
  border-radius: 5px;
  border: none;
  background-color: black;
  color: white;
  cursor: pointer;
}
.host_controls{
  padding: 10px;
}
.host_controls button:hover{
  background-color: #333;
}

.video-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

/* 16:9 responsive video */
.video-wrapper {
  position: relative;
  width: 40%;
  aspect-ratio: 16 / 9;
  background: black;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
}

.video-wrapper iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
}

/* ---------------- SMALL PHONES ---------------- */
@media (max-width: 480px) {
 .alternatives{
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px;
  box-sizing: border-box;
 }
 .alternative{
  width: 100%;
 }
}

</style>
