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
import { PocketDimension, BasePocketDimension } from "./pocket-dimension";
import { HyperPocketDimension } from "./hyper-pocket-dimension";
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

    function runPuzzle(dimension: BasePocketDimension, cycles: number) {
      for (let i = 0; i < cycles; ++i) {
        dimension.executeCycle();
      }
      const count = dimension.countActiveCubes();
      output.print(`Number of active cubes after ${cycles == 1 ? "1 cycle" : `${cycles} cycles`}: ${count}`);
      output.print();
    }

    function runPuzzleDelayed(dimension: BasePocketDimension, cycles: number) {
      state.busy = true;
      emit("busy", true);
      nextTick(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            runPuzzle(dimension, cycles);
            state.busy = false;
            emit("busy", false);
          });
        });
      });
    }

    emit("handler", {
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
        runPuzzleDelayed(new HyperPocketDimension(input), 6);
      },
      runPuzzle2(input: string[]) {
        output.system("Running puzzle 2...");
        runPuzzleDelayed(new HyperPocketDimension(input), 6);
      }
    });

    return {
      ...toRefs(state),
      ...output.mixin
    };
  }
});
</script>
