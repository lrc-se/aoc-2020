import { OutputPublic } from "@/functions/output";

const SUM = 2020;

function getEntries(input: string[]): number[] {
  return input.map(x => +x);
}

function findSumTuple(terms: number[], sum: number): number[] {
  for (let i = 0, len = terms.length - 1; i < len; ++i) {
    for (let j = i + 1; j < terms.length; ++j) {
      if (terms[i] + terms[j] == sum) {
        return [terms[i], terms[j]];
      }
    }
  }
  return [];
}

function runPuzzle1(input: string[], output: OutputPublic) {
  const result = findSumTuple(getEntries(input), SUM);
  if (result.length) {
    output.print(`Found entries: ${result.join(", ")}`);
    output.print(`Result: ${result[0] * result[1]}`);
  } else {
    output.error("No matching entries found!");
  }
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
