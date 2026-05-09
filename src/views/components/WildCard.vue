<script setup lang="ts">
import type { WildCardType } from '../../plugins/wildcards';

const props = defineProps<{
  wildCard: WildCardType
}>();

const cardColor = props.wildCard.color

type CardColor = 'white' | 'blue' | 'green' | 'black' | 'red'

interface ColorTheme {
  background: string
  border: string
  shadow: string
  nameText: string
  descText: string
  badge: string
  badgeText: string
  imageRing: string
  divider: string
}

const colorThemes: Record<CardColor, ColorTheme> = {
  white: {
    background: 'linear-gradient(160deg, #e8e8e8 0%, #c8c8c8 50%, #a8a8a8 100%)',
    border: '1.5px solid rgba(255,255,255,0.6)',
    shadow: '0 8px 32px rgba(0,0,0,0.35), 0 1.5px 4px rgba(0,0,0,0.2)',
    nameText: '#1a1a1a',
    descText: '#2c2c2c',
    badge: 'rgba(0,0,0,0.15)',
    badgeText: '#111',
    imageRing: '3px solid rgba(0,0,0,0.2)',
    divider: 'rgba(0,0,0,0.15)',
  },
  blue: {
    background: 'linear-gradient(160deg, #1a3a6b 0%, #1565c0 60%, #0d47a1 100%)',
    border: '1.5px solid rgba(100,160,255,0.25)',
    shadow: '0 8px 36px rgba(21,101,192,0.45), 0 1.5px 6px rgba(21,101,192,0.2)',
    nameText: '#e8f0fe',
    descText: '#b3caf7',
    badge: 'rgba(255,255,255,0.12)',
    badgeText: '#90caf9',
    imageRing: '3px solid rgba(144,202,249,0.4)',
    divider: 'rgba(144,202,249,0.2)',
  },
  green: {
    background: 'linear-gradient(160deg, #1b4332 0%, #2d6a4f 60%, #1b4332 100%)',
    border: '1.5px solid rgba(95,198,133,0.3)',
    shadow: '0 8px 36px rgba(27,67,50,0.5), 0 1.5px 6px rgba(45,106,79,0.3)',
    nameText: '#d8f3dc',
    descText: '#95d5b2',
    badge: 'rgba(255,255,255,0.10)',
    badgeText: '#74c69d',
    imageRing: '3px solid rgba(116,198,157,0.4)',
    divider: 'rgba(116,198,157,0.2)',
  },
  black: {
    background: 'linear-gradient(160deg, #0a0a0a 0%, #1c1c1c 60%, #111 100%)',
    border: '1.5px solid rgba(255,255,255,0.08)',
    shadow: '0 8px 40px rgba(0,0,0,0.8), 0 1.5px 6px rgba(0,0,0,0.5)',
    nameText: '#f5f5f5',
    descText: '#aaa',
    badge: 'rgba(255,255,255,0.06)',
    badgeText: '#888',
    imageRing: '3px solid rgba(255,255,255,0.1)',
    divider: 'rgba(255,255,255,0.07)',
  },
  red: {
    background: 'linear-gradient(160deg, #7f1d1d 0%, #b91c1c 60%, #991b1b 100%)',
    border: '1.5px solid rgba(252,165,165,0.2)',
    shadow: '0 8px 36px rgba(153,27,27,0.55), 0 1.5px 6px rgba(185,28,28,0.3)',
    nameText: '#fef2f2',
    descText: '#fca5a5',
    badge: 'rgba(255,255,255,0.10)',
    badgeText: '#f87171',
    imageRing: '3px solid rgba(248,113,113,0.4)',
    divider: 'rgba(248,113,113,0.2)',
  },
}

const isValidColor = (color: string): color is CardColor =>
  Object.keys(colorThemes).includes(color)

const theme: ColorTheme = isValidColor(cardColor)
  ? colorThemes[cardColor]
  : colorThemes['white']
</script>

<template>
  <main
    class="card"
    :style="{
      background: theme.background,
      border: theme.border,
      boxShadow: theme.shadow,
    }"
  >

    <div class="card_name_container">
      <h1 :style="{ color: theme.nameText }">{{ props.wildCard.name }}</h1>
      <div class="divider" :style="{ background: theme.divider }" />
    </div>

    <div class="card_image_container">
      <img
        class="card_image"
        :src="`/cards_images/${props.wildCard.image}`"
        :style="{ outline: theme.imageRing }"
      />
    </div>

    <div class="description_container">
      <p :style="{ color: theme.descText }">{{ props.wildCard.description }}</p>
      <i :style="{ color: theme.badgeText }">{{ props.wildCard.useCondition }}</i>
    </div>
  </main>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 0.75em;
  width: 25dvw;
  min-width: 300px;
  min-height: 50dvh;
  height: auto;
  padding: 1.5em;
  border-radius: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
}

.card:hover {
  transform: translateY(-4px) scale(1.01);
}

.card_name_container h1 {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 0.4em 0;
  letter-spacing: 0.01em;
}

.divider {
  height: 1px;
  width: 100%;
  border-radius: 1px;
}

.card_image_container {
  width: 100%;
}

.card_image {
  width: 100%;
  height: 180px; /* or whatever fixed size you want */
  object-fit: cover;
  border-radius: 8px;
  display: block;
  outline-offset: 2px;
}

.description_container {
  display: flex;
  flex-direction: column;
  gap: 0.4em;
}

.description_container p {
  text-align: left;
  font-weight: 600;
  font-size: 1.3rem;
  margin: 0;
  line-height: 1.5;
}

.description_container i {
  text-align: left;
  font-size: 0.75rem;
  opacity: 0.85;
}
</style>