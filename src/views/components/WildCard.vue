<script setup lang="ts">
import type { WildCardType } from '../../plugins/wildcards';

const props = defineProps<{
  wildCard:WildCardType
}>();


const imageLink = props.wildCard.image
const cardColor = props.wildCard.color

</script>

<template>
  <main :style="{backgroundColor: `${cardColor}`}" class="card">
    <div class="card_image_container">
        <img class="card_image" :src="imageLink" />
    </div>
    <div class="description_container">
      <h2>{{ props.wildCard.name }}</h2>
      <p>{{ props.wildCard.description }}</p>
      <i>{{ props.wildCard.useCondition }}</i>
    </div>
  </main>
</template>

<style scoped>

.card{
  display: flex;
  flex-direction: column;
  width: 35%;
  max-width: 240px;
  padding: 2em;
  border-radius: 12px;
}

.card_image_container{
  width: 100%;
}

.card_image{
  width: 100%;
  height:auto;
  border-radius: 6px;
}

.description_container p{
  text-align:left;
}

.description_container i{
  text-align:left;
}


</style>