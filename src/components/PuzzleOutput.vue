<template>
  <div class="puzzle-output center">
    <output class="border">
      <div
        v-for="(line, i) in lines"
        :key="i"
        class="line"
      >
        <template v-for="(part, j) in line" :key="j">
          <template v-if="isDefaultLinePart(part)">{{ part.text }}</template>
          <span v-else :class="part.type">{{ part.text }}</span>
        </template>
      </div>
    </output>
    <button class="clear button" @click="$emit('clear')">Clear</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Line, LinePart, LineType } from "@/functions/output";

export default defineComponent({
  props: {
    lines: {
      type: Array as PropType<Array<Line>>,
      default: () => []
    }
  },

  emits: ["clear"],

  setup() {
    return {
      isDefaultLinePart: (part: LinePart) => part.type == LineType.Default
    };
  }
});
</script>

<style scoped>
.puzzle-output {
  text-align: right;
}

output {
  width: 100%;
  height: 768px;
  max-height: 80vh;
  padding: 1em;
  background-color: rgba(0, 0, 0, .25);
  display: block;
  overflow: auto;
}

.clear {
  margin: 1em 0 0;
}

.line {
  text-align: left;
  white-space: nowrap;
}

.error {
  color: #f25;
  font-weight: 700;
}

.system {
  color: #25f;
  font-style: italic;
}
</style>
