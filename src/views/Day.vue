<template>
  <template v-if="day">
    <h2>Day {{ day.title ? `${day.number}: ${day.title}` : day.number }}</h2>
    <PuzzleContainer
      v-if="handlerLoaded"
      :puzzles="day.puzzles"
      :busy="busy"
      @run-test="runTest"
      @run-puzzle="runPuzzle"
    />
  </template>
  <component
    :is="component"
    v-if="component"
    @handler="setHandler"
    @busy="busy = $event"
  />
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, reactive, markRaw, toRefs } from "vue";
import { useInput } from "@/functions/input";
import { findDay, Puzzle } from "@/days/days";
import PuzzleContainer from "@/components/PuzzleContainer.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";

export default defineComponent({
  components: {
    PuzzleContainer
  },

  props: {
    number: {
      type: Number,
      required: true
    }
  },

  setup(props) {
    const input = useInput();
    const state = reactive({
      day: findDay(props.number),
      component: markRaw(defineAsyncComponent({
        loader: () => import(`@/days/${props.number}/Day${props.number}.vue`),
        delay: 0,
        loadingComponent: LoadingSpinner,
        errorComponent: ErrorMessage,
        onError(error, retry, fail) {
          error.message = "Day not found";
          fail();
        }
      })),
      handlerLoaded: false,
      busy: false
    });

    let handler: object;

    function callHandler(method: string, data: string[]) {
      if (handler) {
        const func = handler[method as keyof object] as (data: string[]) => void;
        if (func) {
          func(data);
        }
      }
    }

    async function runTest(puzzle: Puzzle) {
      state.busy = true;
      const data = await input.load(`day${props.number}-test${puzzle.testInput ?? puzzle.number}.txt`);
      state.busy = false;
      callHandler(`runTest${puzzle.number}`, data);
    }

    async function runPuzzle(puzzle: Puzzle) {
      state.busy = true;
      const data = await input.load(`day${props.number}.txt`);
      state.busy = false;
      callHandler(`runPuzzle${puzzle.number}`, data);
    }

    return {
      ...toRefs(state),
      runTest,
      runPuzzle,
      setHandler(instance: object) {
        handler = instance;
        state.handlerLoaded = true;
      }
    };
  }
});
</script>
