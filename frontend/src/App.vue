<template>
  <div>
    <nav>
      <router-link to="/atletas">Atletas</router-link> |
      <router-link to="/ciudades">Ciudades</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script lang="js">
export default {};
</script>

<style >
nav {
  padding: 1rem;
  background-color: #f0f0f0;
}
nav a {
  margin-right: 1rem;
  text-decoration: none;
  color: #333;
}
nav a.router-link-active {
  font-weight: bold;
}
</style>
