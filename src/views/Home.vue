<template>
  <nav class="center">
    <ul v-if="links.length">
      <li v-for="link in links" :key="link.to">
        <router-link class="border" :to="link.to">{{ link.title }}</router-link>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { days } from "@/days/days";

export default defineComponent({
  setup() {
    return {
      links: [
        { title: "Test", to: "/test" },
        ...days.map(day => ({ title: `Day ${day.number}`, to: `/day/${day.number}` }))
      ]
    };
  }
});
</script>

<style scoped>
nav {
  margin-top: 3em;
}

nav ul {
  margin: -1em;
  padding: 0;
  display: flex;
  justify-content: center;
}

nav li {
  list-style-type: none;
  margin: 1em;
  flex: 0 0 20%;
}

nav a {
  padding: 1em;
  color: inherit;
  background-color: rgba(0, 0, 0, .25);
  font-family: 'Share Tech Mono', monospace;
  font-size: 2em;
  text-decoration: none;
  display: block;
  transition-property: color, background-color, border-color;
  transition-duration: .3s;
  transition-timing-function: ease-out;
}

nav a:hover {
  color: #acf;
  background-color: rgba(0, 0, 0, .5);
  border-color: #acf;
}
</style>
