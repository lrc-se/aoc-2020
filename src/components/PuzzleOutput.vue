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
        <span v-if="i == lines.length - 1" class="cursor">&nbsp;</span>
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
      type: Array as PropType<Line[]>,
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
  font-family: monospace;
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

.cursor {
  position: relative;
  margin-left: .1em;
  display: inline-block;
}

.cursor::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 3px;
  height: 3px;
  background-color: rgba(255, 255, 255, .75);
  animation: blink .5s ease-in-out infinite;
}

@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: .25; }
  100% { opacity: 1; }
}
</style>
