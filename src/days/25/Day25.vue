<template>
  <PuzzleOutput
    :lines="output"
    :busy="busy"
    @clear="clearOutput"
  />
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import { useOutput } from "@/functions/output";
import { useDelay } from "@/functions/delay";
import { runPuzzle } from "./day25";
import PuzzleOutput from "@/components/PuzzleOutput.vue";

export default defineComponent({
  components: {
    PuzzleOutput
  },

  emits: ["handler", "busy"],

  setup(props, context) {
    const state = reactive({
      busy: false
    });
    const output = useOutput();
    const delay = useDelay(state, context);

    context.emit("handler", {
      runTest1(input: string[]) {
        output.system("Running test 1...");
        runPuzzle(input, output);
      },
      runPuzzle1(input: string[]) {
        output.system("Running puzzle 1...");
        delay(() => {
          runPuzzle(input, output);
        });
      }
    });

    return {
      ...toRefs(state),
      ...output.mixin
    };
  }
});
</script>
