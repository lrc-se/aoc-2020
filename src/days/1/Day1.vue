<template>
  <PuzzleOutput :lines="output" @clear="clearOutput" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useOutput } from "@/functions/output";
import { createHandler } from "./day1";
import PuzzleOutput from "@/components/PuzzleOutput.vue";

export default defineComponent({
  components: {
    PuzzleOutput
  },

  emits: ["handler"],

  setup(props, context) {
    const output = useOutput();
    const handler = createHandler(output);
    context.emit("handler", handler);

    return output.mixin;
  }
});
</script>
