import { Floor, Direction } from "./floor";
import { OutputPublic } from "@/functions/output";

function parseTileList(list: string): Direction[] {
  const tileList: Direction[] = [];
  const longDirections = [Direction.SouthEast, Direction.SouthWest, Direction.NorthWest, Direction.NorthEast];
  let pos = 0;
  while (pos < list.length) {
    const index = longDirections.indexOf(list.substring(pos, pos + 2) as Direction);
    if (~index) {
      tileList.push(longDirections[index]);
      pos += 2;
    } else {
      tileList.push(list[pos] as Direction);
      ++pos;
    }
  }
  return tileList;
}

function prepareFloor(input: string[]): Floor {
  const tileLists = input.map(parseTileList);
  const floor = new Floor();
  tileLists.forEach(list => {
    floor.flipTile(list);
  });
  return floor;
}

function runPuzzle1(input: string[], output: OutputPublic) {
  const floor = prepareFloor(input);
  output.print(`Number of black tiles: ${floor.countBlackTiles()}`);
  output.print();
}

function runPuzzle2(input: string[], days: number, output: OutputPublic) {
  const floor = prepareFloor(input);
  for (let i = 0; i < days; ++i) {
    floor.flipTiles();
  }
  const count = floor.countBlackTiles();
  output.print(`Number of black tiles after ${days == 1 ? "1 day" : `${days} days`}: ${count}`);
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
      runPuzzle2(input, 100, output);
    },
    runPuzzle2(input: string[]) {
      runPuzzle2(input, 100, output);
    }
  };
}
