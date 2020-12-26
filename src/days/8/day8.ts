import { OutputPublic } from "@/functions/output";
import { createConsole, Operation } from "./game-console";

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

function runPuzzle2(input: string[], showStatus: boolean, output: OutputPublic) {
  let offset = 0;
  const con = createConsole();
  const operationMap: { [K in Operation]?: Operation } = {
    [Operation.NoOperation]: Operation.Jump,
    [Operation.Jump]: Operation.NoOperation
  };
  do {
    con.setProgram(input.slice(), true);
    const instruction = con.program[offset];
    const replacement = operationMap[instruction.operation];
    if (replacement) {
      if (showStatus) {
        output.print(`Changing '${instruction.operation}' to '${replacement}' at position ${offset}`);
      }
      instruction.operation = replacement;
      try {
        con.run();
        break;
      } catch (err) {
        if (showStatus) {
          output.error(err.message);
        }
      }
    }
    ++offset;
  } while (offset < con.program.length);
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
    },
    runTest2(input: string[]) {
      output.system("Running test 2...");
      runPuzzle2(input, true, output);
    },
    runPuzzle2(input: string[]) {
      output.system("Running puzzle 2...");
      runPuzzle2(input, false, output);
    }
  };
}
