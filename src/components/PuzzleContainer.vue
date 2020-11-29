<template>
  <div class="puzzle-container">
    <section class="puzzles center">
      <div
        v-for="puzzle in puzzles"
        :key="puzzle.number"
        class="puzzle"
      >
        <h3>Puzzle {{ puzzle.number }}</h3>
        <button class="button" @click="$emit('run-puzzle', puzzle.number)">Run</button>
        <button
          v-if="puzzle.hasTest"
          class="button"
          @click="$emit('run-test', puzzle.number)"
        >
          Test
        </button>
      </div>
    </section>
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export interface Puzzle {
  number: number;
  hasTest?: boolean;
}

export default defineComponent({
  props: {
    puzzles: {
      type: Array as PropType<Puzzle[]>,
      default: () => []
    }
  },

  emits: ["run-puzzle", "run-test"]
});
</script>

<style scoped>
.puzzles {
  margin-bottom: 2em;
  display: flex;
  justify-content: center;
}

.puzzle + .puzzle {
  margin-left: 2em;
}
</style>
