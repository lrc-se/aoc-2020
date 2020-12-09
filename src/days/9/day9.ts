import { OutputPublic } from "@/functions/output";

function getNumbers(input: string[]): number[] {
  return input.map(line => +line);
}

function getSums(numbers: number[]): Set<number> {
  const sums = new Set<number>();
  for (let i = 0, len = numbers.length - 1; i < len; ++i) {
    for (let j = i + 1; j < numbers.length; ++j) {
      if (numbers[i] != numbers[j]) {
        sums.add(numbers[i] + numbers[j]);
      }
    }
  }
  return sums;
}

function findFirstInvalidNumberIndex(data: number[], preambleSize: number): number {
  if (preambleSize < data.length) {
    for (let i = preambleSize; i < data.length; ++i) {
      const sums = getSums(data.slice(i - preambleSize, i));
      if (!sums.has(data[i])) {
        return i;
      }
    }
  }

  return -1;
}

function getInvalidSumRange(data: number[], preambleSize: number): number[] {
  const invalidIndex = findFirstInvalidNumberIndex(data, preambleSize);
  if (~invalidIndex) {
    const invalidNumber = data[invalidIndex];
    for (let i = 0, len = data.length - 1; i < len; ++i) {
      let sum = data[i];
      for (let j = i + 1; j < data.length; ++j) {
        sum += data[j];
        if (sum == invalidNumber) {
          return data.slice(i, j + 1);
        } else if (sum > invalidNumber) {
          break;
        }
      }
    }
  }

  return [];
}

function runPuzzle1(input: string[], preambleSize: number, output: OutputPublic) {
  const numbers = getNumbers(input);
  const invalidIndex = findFirstInvalidNumberIndex(numbers, preambleSize);
  if (~invalidIndex) {
    output.print(`First invalid number: ${numbers[invalidIndex]}`);
  } else {
    output.error("No invalid number found");
  }
  output.print();
}

function runPuzzle2(input: string[], preambleSize: number, showRange: boolean, output: OutputPublic) {
  const numbers = getNumbers(input);
  const range = getInvalidSumRange(numbers, preambleSize);
  if (range.length) {
    const min = Math.min(...range);
    const max = Math.max(...range);
    if (showRange) {
      output.print(`Range found: ${range.join(", ")}`);
      output.print(`Range limits: ${min}–${max}`);
    }
    output.print(`Result: ${min + max}`);
  } else {
    output.error("No range found");
  }
  output.print();
}

export function createHandler(output: OutputPublic) {
  return {
    runTest1(input: string[]) {
      output.system("Running test 1...");
      runPuzzle1(input, 5, output);
    },
    runPuzzle1(input: string[]) {
      output.system("Running puzzle 1...");
      runPuzzle1(input, 25, output);
    },
    runTest2(input: string[]) {
      output.system("Running test 2...");
      runPuzzle2(input, 5, true, output);
    },
    runPuzzle2(input: string[]) {
      output.system("Running puzzle 2...");
      runPuzzle2(input, 25, false, output);
    }
  };
}
