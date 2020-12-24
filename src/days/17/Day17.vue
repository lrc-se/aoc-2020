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
import { PocketDimension, BasePocketDimension } from "./pocket-dimension";
import { HyperPocketDimension } from "./hyper-pocket-dimension";
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

    function runPuzzle(dimension: BasePocketDimension, cycles: number) {
      for (let i = 0; i < cycles; ++i) {
        dimension.executeCycle();
      }
      const count = dimension.countActiveCubes();
      output.print(`Number of active cubes after ${cycles == 1 ? "1 cycle" : `${cycles} cycles`}: ${count}`);
      output.print();
    }

    context.emit("handler", {
      runTest1(input: string[]) {
        output.system("Running test 1...");
        runPuzzle(new PocketDimension(input), 6);
      },
      runPuzzle1(input: string[]) {
        output.system("Running puzzle 1...");
        runPuzzle(new PocketDimension(input), 6);
      },
      runTest2(input: string[]) {
        output.system("Running test 2...");
        delay(() => {
          runPuzzle(new HyperPocketDimension(input), 6);
        });
      },
      runPuzzle2(input: string[]) {
        output.system("Running puzzle 2...");
        delay(() => {
          runPuzzle(new HyperPocketDimension(input), 6);
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
