<template>
  <h2>Test</h2>
  <p>
    <button class="button primary" @click="load">Run</button>
  </p>
  <PuzzleOutput :lines="lines" @clear="clearOutput" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useInput } from "@/functions/input";
import { useOutput } from "@/functions/output";
import PuzzleOutput from "@/components/PuzzleOutput.vue";

export default defineComponent({
  components: {
    PuzzleOutput
  },

  setup() {
    const input = useInput();
    const output = useOutput();

    return {
      async load() {
        const lines = await input.load("/inputs/test.txt");
        lines[0].split(",").forEach(part => {
          output.print(part, true);
        });
        output.print("");
        output.error(lines[1]);
        output.system(lines[2]);
      },
      lines: output.lines,
      clearOutput() {
        output.clear();
      }
    };
  }
});
</script>
