<template>
  <PuzzleContainer
    :puzzles="puzzles"
    @run-puzzle="runPuzzle"
    @run-test="runTest"
  />
  <PuzzleOutput :lines="output" @clear="clearOutput" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useOutput } from "@/functions/output";
import PuzzleContainer, { Puzzle } from "@/components/PuzzleContainer.vue";
import PuzzleOutput from "@/components/PuzzleOutput.vue";

export default defineComponent({
  components: {
    PuzzleContainer,
    PuzzleOutput
  },

  setup() {
    const output = useOutput();

    const puzzles: Puzzle[] = [
      { number: 1, hasTest: true },
      { number: 2, hasTest: false }
    ];

    return {
      puzzles,
      runPuzzle(number: number) {
        output.system(`Puzzle ${number} not available`);
      },
      runTest(number: number) {
        output.error(`Test ${number} not available`);
      },
      output: output.lines,
      clearOutput() {
        output.clear();
      }
    };
  }
});
</script>
