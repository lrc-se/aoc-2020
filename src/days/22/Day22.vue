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
import { createHandler } from "./day22";
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

    function runPuzzle2Delayed(input: string[]) {
      state.busy = true;
      emit("busy", true);
      nextTick(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            handler.runPuzzle2(input);
            state.busy = false;
            emit("busy", false);
          });
        });
      });
    }

    emit("handler", {
      ...handler,
      runPuzzle2(input: string[]) {
        output.system("Running puzzle 2...");
        runPuzzle2Delayed(input);
      }
    });

    return {
      ...toRefs(state),
      ...output.mixin
    };
  }
});
</script>
