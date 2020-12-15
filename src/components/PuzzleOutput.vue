<template>
  <div class="puzzle-output center">
    <div class="output-container border">
      <output ref="output">
        <div
          v-for="(line, i) in lines"
          :key="i"
          class="line"
        >
          <template v-for="(part, j) in line" :key="j">
            <template v-if="isDefaultLinePart(part)">{{ part.text }}</template>
            <span v-else :class="part.type">{{ part.text }}</span>
          </template>
          <span v-if="i == lines.length - 1" class="cursor" />
        </div>
      </output>
    </div>
    <button
      class="clear button small"
      :disabled="busy"
      @click="$emit('clear')"
    >
      Clear
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch, nextTick } from "vue";
import { Line, LinePart, LineType } from "@/functions/output";

export default defineComponent({
  props: {
    lines: {
      type: Array as PropType<Line[]>,
      default: () => []
    },
    busy: {
      type: Boolean
    }
  },

  emits: ["clear"],

  setup(props) {
    const output = ref<HTMLOutputElement | null>(null);
    watch(() => props.lines, () => {
      const el = output.value;
      if (el) {
        nextTick(() => {
          el.scrollTop = el.scrollHeight;
        });
      }
    });

    return {
      output,
      isDefaultLinePart: (part: LinePart) => part.type == LineType.Default
    };
  }
});
</script>

<style scoped>
.puzzle-output {
  text-align: right;
}

.output-container {
  overflow: hidden;
}

output {
  width: 100%;
  height: 768px;
  max-height: 80vh;
  padding: 1em 1em 0;
  background-color: rgba(0, 0, 0, .667);
  font-family: 'Share Tech Mono', monospace;
  display: block;
  overflow: auto;
}

.clear {
  margin: 1em 0 0;
}

.line {
  height: 1.4em;
  text-align: left;
  white-space: nowrap;
}

.line:last-child {
  margin-bottom: 1em;
}

.error {
  color: #f23;
  font-weight: 700;
}

.system {
  color: #75f;
  font-style: italic;
}

.cursor {
  position: relative;
  width: .5em;
  margin-left: .1em;
  display: inline-block;
  vertical-align: bottom;
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
