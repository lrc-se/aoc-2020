import { OutputPublic } from "@/functions/output";

export function createHandler(output: OutputPublic) {
  return {
    runPuzzle1(input: string[]) {
      output.error(input[0]);
    },
    runTest1(input: string[]) {
      input.forEach(line => output.print(line));
    },
    runPuzzle2(input: string[]) {
      output.system(input[1]);
    }
  };
}
