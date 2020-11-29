<template>
  <h2 v-if="!loadError">Day {{ day }}</h2>
  <component :is="component" v-if="component" />
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, reactive, markRaw } from "vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";

export default defineComponent({
  props: {
    day: {
      type: Number,
      required: true
    }
  },

  setup(props) {
    const state = reactive({
      component: markRaw(defineAsyncComponent({
        loader: () => import(`@/days/${props.day}/Day${props.day}.vue`),
        delay: 0,
        loadingComponent: LoadingSpinner,
        errorComponent: ErrorMessage,
        onError(error, retry, fail) {
          error.message = "Day not found";
          state.loadError = true;
          fail();
        }
      })),
      loadError: false
    });
    return state;
  }
});
</script>
