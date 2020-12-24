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

function runPuzzle1(input: string[], output: OutputPublic) {
  const tileLists = input.map(parseTileList);
  const floor = new Floor();
  tileLists.forEach(list => {
    floor.flipTile(list);
  });
  output.print(`Number of black tiles: ${floor.countBlackTiles()}`);
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
