<template>
  <div class="puzzle-container">
    <section class="puzzles center">
      <div
        v-for="puzzle in puzzles"
        :key="puzzle.number"
        class="puzzle"
      >
        <h3>Puzzle {{ puzzle.number }}</h3>
        <button
          class="button primary"
          :disabled="loading"
          @click="$emit('run-puzzle', puzzle.number)"
        >
          Run
        </button>
        <button
          v-if="puzzle.hasTest"
          class="button secondary"
          :disabled="loading"
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
import { Puzzle } from "@/days/days";

export default defineComponent({
  props: {
    puzzles: {
      type: Array as PropType<Puzzle[]>,
      default: () => []
    },
    loading: {
      type: Boolean
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
