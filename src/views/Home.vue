<template>
  <nav class="center">
    <ul v-if="links.length">
      <li
        v-for="link in links"
        :key="link.to"
        class="border"
      >
        <router-link :to="link.to">{{ link.title }}</router-link>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";

const days = [1];

export default defineComponent({
  setup() {
    return {
      links: [
        { title: "Test", to: "/test" },
        ...days.map(day => ({ title: `Day ${day}`, to: `/day/${day}` }))
      ]
    };
  }
});
</script>

<style scoped>
nav {
  margin-top: 2em;
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
  font-size: 2em;
  text-decoration: none;
  display: block;
}
</style>
