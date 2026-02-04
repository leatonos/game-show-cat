<script setup lang="ts">


</script>

<template>
  <main class="card">
    <div class="hero_image">
        <img />
    </div>

    <div class="description">
        
    </div>
  </main>
</template>

<style scoped>

.room {
  width: 100%;
  padding: 0px;
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