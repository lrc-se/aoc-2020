<template>
  <header>
    <h1>
      <span class="goto-home" @click="gotoHome">Advent of Code 2020</span>
    </h1>
  </header>
  <main><router-view /></main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const router = useRouter();

    return {
      gotoHome() {
        router.push({ name: "home" });
      }
    };
  }
});
</script>

<style>
* {
  box-sizing: border-box;
}

html {
  font-size: 17px;
}

body {
  margin: 0;
  padding: 2em;
  color: #fefeff;
  background: #000 url('assets/img/bg.jpg') center center/cover fixed;
  font-family: 'Nova Square', sans-serif;
  font-size: 1em;
  line-height: 1.4;
  text-align: center;
  text-shadow: 2px 2px 2px #000;
  overflow-y: scroll;
}

h1 {
  margin: 0 0 .5em;
  font-size: 3.333em;
}

h2 {
  margin: .75em 0 .333em;
  font-size: 2.25em;
}

h3 {
  margin: .75em 0 .333em;
  font-size: 1.5em;
}

a {
  color: #23f;
}

.button {
  margin: .5em;
  padding: .75em 1.25em;
  color: #000;
  background-color: #acf;
  border: none;
  border-radius: 4px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 1em;
  font-variant: small-caps;
  line-height: 1;
  letter-spacing: .1em;
  text-transform: uppercase;
  text-shadow: 0 0 1px #000;
  cursor: pointer;
  box-shadow: 0 0 3px #000, 0 0 5px rgba(0, 0, 0, .75) inset;
  transition-property: text-shadow, box-shadow, opacity;
  transition-duration: .3s;
  transition-timing-function: ease-out;
}

.button:hover {
  text-shadow: 0 0 2px #000;
  box-shadow: 0 0 5px #000, 0 0 5px #000 inset;
}

.button:disabled {
  opacity: .5;
}

.button.primary {
  color: #fff;
  background-color: #23f;
}

.button.primary:hover {
  text-shadow: 0 0 5px #000;
}

.button.secondary {
  color: #fff;
  background-color: #75f;
}

.button.secondary:hover {
  text-shadow: 0 0 3px #000;
}

.button.small {
  padding: .75em 1.25em;
  font-size: .75em;
}

.center {
  width: 1024px;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
}

.border {
  border: 1px solid #fff;
  border-radius: 4px;
}

.goto-home {
  cursor: pointer;
  transition: color .3s ease-out;
}

.goto-home:hover {
  color: #acf;
}
</style>
