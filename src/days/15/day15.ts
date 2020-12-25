import { OutputPublic } from "@/functions/output";

function getNumbers(input: string): number[] {
  return input.split(",").map(num => +num);
}

function playMemoryGame(startingNumbers: number[], turns: number): number[] {
  const numbers: number[] = [];
  const lookup = new Uint32Array(turns);
  startingNumbers.forEach((number, i) => {
    numbers.push(number);
    lookup[number] = i + 1;
  });

  for (let i = startingNumbers.length - 1, len = turns - 1; i < len; ++i) {
    if (lookup[numbers[i]]) {
      numbers.push(i - lookup[numbers[i]] + 1);
    } else {
      numbers.push(0);
    }
    lookup[numbers[i]] = i + 1;
  }

  return numbers;
}

export function runPuzzle(input: string, turns: number, output: OutputPublic) {
  const numbers = playMemoryGame(getNumbers(input), turns);
  output.print(`Number #${turns}: ${numbers[numbers.length - 1]}`);
}
