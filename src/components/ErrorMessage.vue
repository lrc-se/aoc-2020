<template>
  <div class="error">{{ error.message }}</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    error: {
      type: Error,
      required: true
    }
  }
});
</script>

<style scoped>
.error {
  margin: 2em 0;
  color: #f23;
  font-size: 3em;
  font-weight: 700;
  text-transform: uppercase;
  animation: blink 1.5s ease-in-out infinite;
}

@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% {opacity: 1; }
}
</style>
