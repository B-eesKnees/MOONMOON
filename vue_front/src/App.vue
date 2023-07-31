<template>
   <nav class="main">
    <router-view />
  </nav>
</template>

<script>
import CSS from "../src/assets/css/reset.css"

export default {
  name: 'App',
  components: {
    CSS
  }
}
</script>

<style>
  a {
    cursor: pointer;
    text-decoration: none;
  }
  input[type=submit] {
    cursor: pointer;
  }
</style>
