<template>
  <PuzzleOutput
    :lines="output"
    :busy="busy"
    @clear="clearOutput"
  />
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, nextTick } from "vue";
import { useOutput } from "@/functions/output";
import { createHandler } from "./day23";
import PuzzleOutput from "@/components/PuzzleOutput.vue";

export default defineComponent({
  components: {
    PuzzleOutput
  },

  emits: ["handler", "busy"],

  setup(props, { emit }) {
    const output = useOutput();
    const state = reactive({
      busy: false
    });
    const handler = createHandler(output);

    function runPuzzleDelayed(input: string[], puzzleCallback: (input: string[]) => void) {
      state.busy = true;
      emit("busy", true);
      nextTick(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            puzzleCallback(input);
            state.busy = false;
            emit("busy", false);
          });
        });
      });
    }

    emit("handler", {
      runTest1: handler.runTest1,
      runPuzzle1: handler.runPuzzle1,
      runTest2(input: string[]) {
        output.system("Running test 2...");
        runPuzzleDelayed(input, handler.runTest2);
      },
      runPuzzle2(input: string[]) {
        output.system("Running puzzle 2...");
        runPuzzleDelayed(input, handler.runPuzzle2);
      }
    });

    return {
      ...toRefs(state),
      ...output.mixin
    };
  }
});
</script>
