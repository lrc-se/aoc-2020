import { createCameraArray, Tile, Image, Pixel } from "./camera-array";
import { OutputPublic } from "@/functions/output";

function getTiles(input: string[]): Tile[] {
  const re = /^Tile\s+(\d+)\s*:$/;
  return input.join("\n").split("\n\n").map(line => line.split("\n")).map(data => {
    const idMatch = re.exec(data[0]);
    const id = (idMatch ? +idMatch[1] : 0);
    return {
      id,
      image: data.slice(1).map(line => line.split("")).filter(line => line.length)
    };
  });
}

function getCornerProduct(grid: Tile[][]): number {
  const max = grid.length - 1;
  if (max < 0) {
    return 0;
  }
  return grid[0][0].id * grid[0][max].id * grid[max][0].id * grid[max][max].id;
}

function getWaterRoughness(image: Image): number {
  return image.reduce((prev, cur) => prev + cur.filter(pixel => pixel == Pixel.MonochromeOn).length, 0);
}

function runPuzzle1(input: string[], output: OutputPublic) {
  const tiles = getTiles(input);
  const cameraArray = createCameraArray(tiles);
  try {
    const grid = cameraArray.getAssembledTileGrid();
    output.print(`Result: ${getCornerProduct(grid)}`);
  } catch (err) {
    output.error(err.message);
  }
  output.print();
}

function runPuzzle2(input: string[], output: OutputPublic): Image | null {
  let image: Image | null = null;
  const tiles = getTiles(input);
  const cameraArray = createCameraArray(tiles);
  try {
    const result = cameraArray.getSeaMonsterResult();
    if (result.count) {
      image = result.image;
      output.print(`${result.count == 1 ? "1 sea monster" : `${result.count} sea monsters`} found`);
      output.print(`Water roughness: ${getWaterRoughness(result.image)}`);
    } else {
      output.error("No sea monsters found");
    }
  } catch (err) {
    output.error(err.message);
  }
  output.print();
  return image;
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
    runTest2(input: string[]): Image | null {
      output.system("Running test 2...");
      return runPuzzle2(input, output);
    },
    runPuzzle2(input: string[]): Image | null {
      output.system("Running puzzle 2...");
      return runPuzzle2(input, output);
    }
  };
}
