<template>
  <div class="day-20">
    <div v-if="seaMonsterImage" class="sea-monsters">
      <div class="sea-monster-heading">There be monsters here!</div>
      <div class="image border">
        <div
          v-for="(row, y) in seaMonsterImage"
          :key="y"
          class="row"
        >
          <div
            v-for="(tile, x) in row"
            :key="x"
            class="tile"
            :class="getTileClass(tile)"
          />
        </div>
      </div>
    </div>
    <PuzzleOutput :lines="output" @clear="clear" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import { useOutput } from "@/functions/output";
import { createHandler } from "./day20";
import { Image, Pixel } from "./camera-array";
import PuzzleOutput from "@/components/PuzzleOutput.vue";

export default defineComponent({
  components: {
    PuzzleOutput
  },

  emits: ["handler"],

  setup(props, { emit }) {
    const state = reactive({
      seaMonsterImage: null as Image | null
    });
    const output = useOutput();
    const handler = createHandler(output);

    function runPuzzle1(input: string[], callback: (input: string[]) => void) {
      state.seaMonsterImage = null;
      callback(input);
    }

    function runPuzzle2(input: string[], callback: (input: string[]) => Image | null) {
      state.seaMonsterImage = null;
      const image = callback(input);
      state.seaMonsterImage = image;
    }

    function getTileClass(tile: Pixel): string {
      switch (tile) {
        case Pixel.MonochromeOff:
          return "";
        case Pixel.MonochromeOn:
          return "rough-water";
        case Pixel.SeaMonster:
          return "monster";
        default:
          return "unknown";
      }
    }

    function clear() {
      output.clear();
      state.seaMonsterImage = null;
    }

    emit("handler", {
      runTest1(input: string[]) {
        runPuzzle1(input, handler.runTest1);
      },
      runPuzzle1(input: string[]) {
        runPuzzle1(input, handler.runPuzzle1);
      },
      runTest2(input: string[]) {
        runPuzzle2(input, handler.runTest2);
      },
      runPuzzle2(input: string[]) {
        runPuzzle2(input, handler.runPuzzle2);
      }
    });

    return {
      ...toRefs(state),
      getTileClass,
      clear,
      output: output.mixin.output
    };
  }
});
</script>

<style scoped>
.sea-monsters {
  margin-top: -.5em;
  margin-bottom: 2em;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.sea-monster-heading {
  margin-bottom: .5em;
  flex-basis: 100%;
}

.image {
  background-color: #22f;
  overflow: hidden;
}

.row {
  display: flex;
}

.tile {
  width: 6px;
  height: 6px;
}

.tile.rough-water {
  background-color: #00e;
  border-radius: 50% 0 50% 0;
}

.tile.monster {
  background-color: #090;
  border-radius: 0 50% 0 50%;
}

.tile.unknown {
  background-color: #333;
  border-radius: 50%;
}
</style>
