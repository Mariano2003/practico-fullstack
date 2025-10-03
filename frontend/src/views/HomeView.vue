<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
</script>

<template>
  <div>
    <h1>Maratón</h1>
    <TheWelcome />
    <router-link to="/atletas">Atletas</router-link> |
    <router-link to="/ciudades">Ciudades</router-link>
  </div>
</template>
