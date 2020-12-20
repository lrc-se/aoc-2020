import { createCameraArray, Tile } from "./camera-array";
import { OutputPublic } from "@/functions/output";

function getCornerProduct(grid: Tile[][]): number {
  const max = grid.length - 1;
  if (max < 0) {
    return 0;
  }
  return grid[0][0].id * grid[0][max].id * grid[max][0].id * grid[max][max].id;
}

function runPuzzle1(input: string[], output: OutputPublic) {
  const cameraArray = createCameraArray(input);
  try {
    const grid = cameraArray.getAssembledTileGrid();
    output.print(`Result: ${getCornerProduct(grid)}`);
  } catch (err) {
    output.error(err.message);
  }
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
