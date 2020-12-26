<template>
  <div class="error">{{ message }}</div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  props: {
    error: {
      type: [Error, String],
      required: true
    }
  },

  setup(props) {
    return {
      message: computed(() => (props.error as Error).message || props.error)
    };
  }
});
</script>

<style scoped>
.error {
  margin: 2em 0;
  color: #f23;
  font-size: 3em;
  font-weight: 700;
  line-height: 1.3;
  text-transform: uppercase;
  animation: blink 1.5s ease-in-out infinite;
}

@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% {opacity: 1; }
}
</style>
