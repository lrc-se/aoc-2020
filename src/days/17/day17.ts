import { PocketDimension } from "./pocket-dimension";
import { OutputPublic } from "@/functions/output";

function runPuzzle(input: string[], cycles: number, output: OutputPublic) {
  const dimension = new PocketDimension(input);
  for (let i = 0; i < cycles; ++i) {
    dimension.executeCycle();
  }
  const count = dimension.countActiveCubes();
  output.print(`Number of active cubes after ${cycles == 1 ? "1 cycle" : `${cycles} cycles`}: ${count}`);
  output.print();
}

export function createHandler(output: OutputPublic) {
  return {
    runTest1(input: string[]) {
      output.system("Running test 1...");
      runPuzzle(input, 6, output);
    },
    runPuzzle1(input: string[]) {
      output.system("Running puzzle 1...");
      runPuzzle(input, 6, output);
    }
  };
}
