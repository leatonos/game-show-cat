<script setup lang="ts">
import { socket } from '../../plugins/plugins';
import { playKeySound } from '../../plugins/soundEffects';

const props = defineProps<{
  isHostView: boolean
  room_id?: string
}>();


</script>

<template>
   <main class="screen_container">
       
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
