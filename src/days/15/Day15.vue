<template>
  <div v-if="examples" class="examples">
    <button
      v-for="(example, i) in examples"
      :key="i"
      class="button small"
      :disabled="busy"
      @click="runTest2Example(example, i)"
    >
      Example #{{ i + 1 }}
    </button>
  </div>
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
import { runPuzzle } from "./day15";
import PuzzleOutput from "@/components/PuzzleOutput.vue";

export default defineComponent({
  components: {
    PuzzleOutput
  },

  emits: ["handler", "busy"],

  setup(props, context) {
    const state = reactive({
      examples: null as string[] | null,
      busy: false
    });
    const output = useOutput();
    const delay = useDelay(state, context);

    context.emit("handler", {
      runTest1(input: string[]) {
        output.system("Running test 1...");
        input.forEach((line, i) => {
          output.print(`[Example #${i + 1}] `, true);
          runPuzzle(line, 2020, output);
        });
        output.print();
      },
      runPuzzle1(input: string[]) {
        output.system("Running puzzle 1...");
        runPuzzle(input[0], 2020, output);
        output.print();
      },
      runTest2(input: string[]) {
        state.examples = input;
        context.emit("busy", true);
      },
      runPuzzle2(input: string[]) {
        output.system("Running puzzle 2...");
        delay(() => {
          runPuzzle(input[0], 30000000, output);
          output.print();
        });
      }
    });

    return {
      ...output.mixin,
      ...toRefs(state),
      runTest2Example(example: string, index: number) {
        output.system(`Running test 2 example #${index + 1}...`);
        state.examples = null;
        delay(() => {
          runPuzzle(example, 30000000, output);
          output.print();
        });
      }
    };
  }
});
</script>

<style scoped>
.examples {
  margin-top: -1em;
  margin-bottom: 1em;
}
</style>
