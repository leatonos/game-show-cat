<script lang="ts">
import { wildCardLibrary } from "../../plugins/wildcards";
import WildCard from "../components/WildCard.vue";

export default {
  components: {
    WildCard
  },
  data() {
    return {
      wildcards: wildCardLibrary
    };
  }
};
</script>

<template>
  <div class="all-cards-container">
    <h1>All Wildcards</h1>
    <div class="cards-grid">
      <WildCard v-for="(card, index) in wildcards" :key="index" :wildCard="card" />
    </div>
    <p>{{ wildcards.length }} wildcards available</p>
  </div>
</template>

<style scoped>
.all-cards-container {
  padding: 20px;
}
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}
</style>