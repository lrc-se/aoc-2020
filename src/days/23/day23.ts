import { OutputPublic } from "@/functions/output";

interface CupLinks {
  [K: number]: number;
}

interface CupGame {
  links: CupLinks;
  current: number;
  count: number;
}

function getCups(input: string): number[] {
  return input.split("").map(num => +num);
}

function createCupGame(cups: number[], totalCount = 0): CupGame {
  if (cups.length < totalCount) {
    cups = cups.slice();
    for (let i = cups.length + 1; i <= totalCount; ++i) {
      cups.push(i);
    }
  }
  const links: CupLinks = {};
  for (let i = 0; i < cups.length - 1; ++i) {
    links[cups[i]] = cups[i + 1];
  }
  links[cups[cups.length - 1]] = cups[0];
  return {
    links,
    current: cups[0],
    count: cups.length
  };
}

function getCupList(cupGame: CupGame, startCup: number, count: number): number[] {
  const cups: number[] = [];
  let cup = startCup;
  for (let i = 0; i < count; ++i) {
    cups.push(cup);
    cup = cupGame.links[cup];
  }
  return cups;
}

function moveCups(cupGame: CupGame) {
  const pickedUp = getCupList(cupGame, cupGame.links[cupGame.current], 3);
  let destinationCup = (cupGame.current > 1 ? cupGame.current - 1 : cupGame.count);
  while (pickedUp.includes(destinationCup)) {
    destinationCup = (destinationCup > 1 ? destinationCup - 1 : cupGame.count);
  }

  cupGame.links[cupGame.current] = cupGame.links[pickedUp[2]];
  cupGame.links[pickedUp[2]] = cupGame.links[destinationCup];
  cupGame.links[destinationCup] = pickedUp[0];
  cupGame.current = cupGame.links[cupGame.current];
}

function runPuzzle1(input: string, output: OutputPublic) {
  const cupGame = createCupGame(getCups(input));
  for (let i = 0; i < 100; ++i) {
    moveCups(cupGame);
  }
  const cups = getCupList(cupGame, cupGame.links[1], 8);
  output.print(`Result: ${cups.join("")}`);
  output.print();
}

function runPuzzle2(input: string, output: OutputPublic) {
  const cupGame = createCupGame(getCups(input), 1e6);
  for (let i = 0; i < 10e6; ++i) {
    moveCups(cupGame);
  }
  const cups = getCupList(cupGame, 1, 3);
  output.print(`Star cups: ${cups[1]}, ${cups[2]}`);
  output.print(`Result: ${cups[1] * cups[2]}`);
  output.print();
}

export function createHandler(output: OutputPublic) {
  return {
    runTest1(input: string[]) {
      output.system("Running test 1...");
      runPuzzle1(input[0], output);
    },
    runPuzzle1(input: string[]) {
      output.system("Running puzzle 1...");
      runPuzzle1(input[0], output);
    },
    runTest2(input: string[]) {
      runPuzzle2(input[0], output);
    },
    runPuzzle2(input: string[]) {
      runPuzzle2(input[0], output);
    }
  };
}
