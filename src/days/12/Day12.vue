<template>
  <PuzzleOutput :lines="output" @clear="clearOutput" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useOutput } from "@/functions/output";
import { createHandler as createFunctionHandler } from "./day12-function";
import { createHandler as createClassHandler } from "./day12-class";
import PuzzleOutput from "@/components/PuzzleOutput.vue";

export default defineComponent({
  components: {
    PuzzleOutput
  },

  emits: ["handler"],

  setup(props, { emit }) {
    const output = useOutput();
    const functionHandler = createFunctionHandler(output);
    const classHandler = createClassHandler(output);
    emit("handler", {
      runTest1(input: string[]) {
        functionHandler.runTest1(input);
        classHandler.runTest1(input);
      },
      runPuzzle1(input: string[]) {
        functionHandler.runPuzzle1(input);
        classHandler.runPuzzle1(input);
      },
      runTest2(input: string[]) {
        functionHandler.runTest2(input);
        classHandler.runTest2(input);
      },
      runPuzzle2(input: string[]) {
        functionHandler.runPuzzle2(input);
        classHandler.runPuzzle2(input);
      }
    });

    return output.mixin;
  }
});
</script>
