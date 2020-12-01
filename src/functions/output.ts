import { reactive, computed } from "vue";

export enum LineType {
  Default = "default",
  Error = "error",
  System = "system"
}

export interface LinePart {
  type: LineType;
  text: string;
}

export type Line = LinePart[];

export interface OutputPublic {
  print: (text?: string, newLine?: boolean) => void;
  error: (text?: string, newLine?: boolean) => void;
  system: (text?: string, newLine?: boolean) => void;
  clear: () => void;
}

export function useOutput() {
  const state = reactive({
    lines: [[]] as Line[]
  });

  function write(text?: string, type: LineType = LineType.Default, noNewLine = false) {
    if (text) {
      if (!state.lines.length) {
        state.lines.push([{ type, text }]);
      } else {
        state.lines[state.lines.length - 1].push({ type, text });
      }
    }
    if (!noNewLine) {
      state.lines.push([]);
    }
  }

  function print(text?: string, noNewLine = false) {
    write(text, LineType.Default, noNewLine);
  }

  function error(text?: string, noNewLine = false) {
    write(text, LineType.Error, noNewLine);
  }

  function system(text?: string, noNewLine = false) {
    write(text, LineType.System, noNewLine);
  }

  function clear() {
    state.lines = [[]];
  }

  return {
    print,
    error,
    system,
    clear,
    lines: computed(() => state.lines.slice())
  };
}
