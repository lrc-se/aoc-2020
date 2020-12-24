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
import { createHandler } from "./day22";
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
    const handler = createHandler(output);

    context.emit("handler", {
      ...handler,
      runPuzzle2(input: string[]) {
        output.system("Running puzzle 2...");
        delay(() => {
          handler.runPuzzle2(input);
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
