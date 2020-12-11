<template>
  <div class="area center" :class="{ 'has-result': hasResult }">
    <div v-if="layout" class="layout border">
      <div
        v-for="(row, y) in layout"
        :key="y"
        class="row"
      >
        <div
          v-for="(col, x) in row"
          :key="x"
          class="col"
          :class="tileClasses[col]"
        />
      </div>
    </div>
    <div v-else class="stand-by message">Standing by</div>
    <div v-if="hasResult" class="result border">
      <div class="message">
        {{ seatCount == 1 ? "1 occupied seat" : `${seatCount} occupied seats` }}
        after
        {{ iterations == 1 ? "1 iteration" : `${iterations} iterations` }}
      </div>
      <button class="button" @click="reset">Reset</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, nextTick } from "vue";
import { getLayout, applyRules, countOccupiedSeats, PositionType, Layout } from "./day11";

export default defineComponent({
  emits: ["handler", "busy"],

  setup(props, { emit }) {
    const state = reactive({
      layout: null as unknown as Layout,
      seatCount: 0,
      iterations: 0,
      hasResult: false,
      tileClasses: {
        [PositionType.EmptySeat]: "empty",
        [PositionType.OccupiedSeat]: "occupied"
      } as { [K in PositionType]?: string }
    });

    function updateLayout(occupiedThreshold: number, maxSteps = Infinity, delay = 0) {
      if (applyRules(state.layout, occupiedThreshold, maxSteps)) {
        ++state.iterations;
        setTimeout(() => {
          updateLayout(occupiedThreshold, maxSteps, delay);
        }, delay);
      } else {
        state.seatCount = countOccupiedSeats(state.layout);
        state.hasResult = true;
        emit("busy", false);
      }
    }

    function reset() {
      state.layout = null as unknown as Layout;
      state.seatCount = 0;
      state.iterations = 0;
      state.hasResult = false;
    }

    function run(input: string[], occupiedThreshold: number, maxSteps = Infinity, delay = 0) {
      emit("busy", true);
      reset();
      nextTick(() => {
        state.layout = getLayout(input);
        updateLayout(occupiedThreshold, maxSteps, delay);
      });
    }

    emit("handler", {
      runTest1(input: string[]) {
        run(input, 4, 1, 400);
      },
      runPuzzle1(input: string[]) {
        run(input, 4, 1);
      },
      runTest2(input: string[]) {
        run(input, 5, Infinity, 400);
      },
      runPuzzle2(input: string[]) {
        run(input, 5);
      }
    });

    return {
      ...toRefs(state),
      reset
    };
  }
});
</script>

<style scoped>
.area {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
}

.layout {
  padding: 10px;
  background-image: url('floor.jpg');
  overflow: hidden;
}

.area.has-result .layout {
  opacity: .8;
}

.row {
  display: flex;
}

.col {
  width: 20px;
  flex: 0 1 auto;
}

.col::before {
  content: '';
  padding-top: 100%;
  display: block;
}

.col.empty {
  background-image: url('empty.png');
}

.col.occupied {
  background-image: url('occupied.png');
}

.message {
  color: #acf;
  font-size: 2em;
  font-weight: 700;
  text-transform: uppercase;
}

.stand-by {
  animation: blink 1.25s ease-in-out infinite;
}

.result {
  padding: 1.5em 2em;
  position: fixed;
  left: 50%;
  top: 50%;
  max-width: 90%;
  background-color: rgba(0, 0, 0, .85);
  z-index: 1;
  transform: translate(-50%, -50%);
}

.result .message {
  margin-bottom: 1rem;
}

@keyframes blink {
  0% { opacity: 0; }
  40% { opacity: 1; }
  60% { opacity: 1; }
  100% { opacity: 0; }
}
</style>
