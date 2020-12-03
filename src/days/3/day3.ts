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
