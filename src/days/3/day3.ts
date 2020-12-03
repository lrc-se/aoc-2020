import { OutputPublic } from "@/functions/output";

const TREE = "#";

interface Coordinate {
  x: number;
  y: number;
}

function traverseMapAndCountTrees(map: string[], start: Coordinate, step: Coordinate): number {
  if (!map.length || step.y <= 0) {
    return 0;
  }

  let count = 0;
  const width = map[0].length;
  const pos: Coordinate = { ...start };
  while (pos.y < map.length) {
    if (map[pos.y][pos.x] === TREE) {
      ++count;
    }
    pos.x = (pos.x + step.x) % width;
    pos.y += step.y;
  }

  return count;
}

function runPuzzle1(input: string[], output: OutputPublic) {
  const count = traverseMapAndCountTrees(input, { x: 0, y: 0 }, { x: 3, y: 1 });
  output.print(`Tree count: ${count}`);
  output.print();
}

function runPuzzle2(input: string[], output: OutputPublic) {
  const start: Coordinate = { x: 0, y: 0 };
  const steps: Coordinate[] = [
    { x: 1, y: 1 },
    { x: 3, y: 1 },
    { x: 5, y: 1 },
    { x: 7, y: 1 },
    { x: 1, y: 2 }
  ];
  const counts: number[] = [];
  steps.forEach(step => {
    counts.push(traverseMapAndCountTrees(input, start, step));
  });
  output.print(`Tree counts: ${counts.join(", ")}`);
  output.print(`Result: ${counts.reduce((cur, prev) => cur * prev, 1)}`);
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
      runPuzzle2(input, output);
    },
    runPuzzle2(input: string[]) {
      output.system("Running puzzle 2...");
      runPuzzle2(input, output);
    }
  };
}
