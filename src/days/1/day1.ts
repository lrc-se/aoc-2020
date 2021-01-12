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

function findSumTriple(terms: number[], sum: number): number[] {
  for (let i = 0, len1 = terms.length - 2; i < len1; ++i) {
    for (let j = i + 1, len2 = terms.length - 1; j < len2; ++j) {
      for (let k = j + 1; k < terms.length; ++k) {
        if (terms[i] + terms[j] + terms[k] == sum) {
          return [terms[i], terms[j], terms[k]];
        }
      }
    }
  }
  return [];
}

function printResult(result: number[], output: OutputPublic) {
  if (result.length) {
    output.print(`Found entries: ${result.join(", ")}`);
    output.print(`Result: ${result.reduce((prev, cur) => prev * cur, 1)}`);
  } else {
    output.error("No matching entries found!");
  }
  output.print();
}

function runPuzzle1(input: string[], output: OutputPublic) {
  const result = findSumTuple(getEntries(input), SUM);
  printResult(result, output);
}

function runPuzzle2(input: string[], output: OutputPublic) {
  const result = findSumTriple(getEntries(input), SUM);
  printResult(result, output);
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
      runPuzzle2(input, output);
    },
    runPuzzle2(input: string[]) {
      output.system("Running puzzle 2...");
      runPuzzle2(input, output);
    }
  };
}
