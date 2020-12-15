import { OutputPublic } from "@/functions/output";

function getNumbers(input: string): number[] {
  return input.split(",").map(num => +num);
}

function getNextNumber(numbers: number[]): number {
  const number = numbers[numbers.length - 1];
  for (let i = numbers.length - 2; i >= 0; --i) {
    if (numbers[i] === number) {
      return numbers.length - i - 1;
    }
  }
  return 0;
}

function playMemoryGame(startingNumbers: number[], turns: number): number[] {
  const numbers: number[] = startingNumbers.slice();
  for (let turn = startingNumbers.length + 1; turn <= turns; ++turn) {
    numbers.push(getNextNumber(numbers));
  }
  return numbers;
}

function runPuzzle(input: string, turns: number, output: OutputPublic) {
  const numbers = playMemoryGame(getNumbers(input), turns);
  output.print(`Number #${turns}: ${numbers[numbers.length - 1]}`);
}

export function createHandler(output: OutputPublic) {
  return {
    runTest1(input: string[]) {
      output.system("Running test 1...");
      input.forEach((line, i) => {
        output.print(`[Example #${i + 1}] `, true);
        runPuzzle(line, 2020, output);
      });
      output.print();
    },
    runPuzzle1(input: string[]) {
      output.system("Running puzzle 1...");
      runPuzzle(input[0], 2020, output);
      output.print();
    }
  };
}
