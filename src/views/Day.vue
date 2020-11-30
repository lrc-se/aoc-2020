<template>
  <template v-if="day">
    <h2>Day {{ number }}</h2>
    <PuzzleContainer
      v-if="handlerLoaded"
      :puzzles="day.puzzles"
      :loading="loadingInput"
      @run-puzzle="runPuzzle"
      @run-test="runTest"
    />
  </template>
  <component
    :is="component"
    v-if="component"
    @handler="setHandler"
  />
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, reactive, markRaw, toRefs } from "vue";
import { useInput } from "@/functions/input";
import { findDay } from "@/days/days";
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
      loadingInput: false
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

    async function runPuzzle(number: number) {
      state.loadingInput = true;
      const data = await input.load(`/inputs/day${props.number}.txt`);
      state.loadingInput = false;
      callHandler(`runPuzzle${number}`, data);
    }

    async function runTest(number: number) {
      state.loadingInput = true;
      const data = await input.load(`/inputs/day${props.number}-test${number}.txt`);
      state.loadingInput = false;
      callHandler(`runTest${number}`, data);
    }

    return {
      ...toRefs(state),
      runPuzzle,
      runTest,
      setHandler(instance: object) {
        handler = instance;
        state.handlerLoaded = true;
      }
    };
  }
});
</script>
