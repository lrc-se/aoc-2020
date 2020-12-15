import { OutputPublic } from "@/functions/output";

function getNumbers(input: string): number[] {
  return input.split(",").map(num => +num);
}

function playMemoryGame(startingNumbers: number[], turns: number): number[] {
  const numbers: number[] = [];
  const lookup = new Map<number, number>();
  startingNumbers.forEach((number, i) => {
    numbers.push(number);
    lookup.set(number, i);
  });

  for (let i = startingNumbers.length - 1, len = turns - 1; i < len; ++i) {
    if (lookup.has(numbers[i])) {
      numbers.push(i - lookup.get(numbers[i])!); // eslint-disable-line
    } else {
      numbers.push(0);
    }
    lookup.set(numbers[i], i);
  }

  return numbers;
}

export function runPuzzle(input: string, turns: number, output: OutputPublic) {
  const numbers = playMemoryGame(getNumbers(input), turns);
  output.print(`Number #${turns}: ${numbers[numbers.length - 1]}`);
}
