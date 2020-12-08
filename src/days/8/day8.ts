import { OutputPublic } from "@/functions/output";
import { createConsole } from "./game-console";

function runPuzzle1(input: string[], output: OutputPublic) {
  const con = createConsole(input);
  try {
    con.run();
  } catch (err) {
    output.error(err.message);
  }
  output.print(`Accumulator value: ${con.accumulator}`);
  output.print();
}

export function createHandler(output: OutputPublic) {
  return {
    runTest1(input: string[]) {
      output.system("Running test 1...");
      runPuzzle1(input, output);
    },
    runPuzzle1(input: string[]) {
      output.system("Running puzzle 1...");
      runPuzzle1(input, output);
    }
  };
}
