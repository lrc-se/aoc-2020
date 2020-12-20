type Image = string[][];

export interface Tile {
  id: number;
  image: Image;
}

interface VariantCache {
  [K: number]: Image[];
}

enum Direction {
  Left,
  Up,
  Right,
  Down
}

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

function getImageCopy(image: Image): Image {
  return image.map(line => line.slice());
}

function flipImageHoriz(image: Image): Image {
  const copy = getImageCopy(image);
  for (let i = 0; i < copy.length; ++i) {
    copy[i].reverse();
  }
  return copy;
}

function flipImageVert(image: Image): Image {
  const copy = getImageCopy(image);
  copy.reverse();
  return copy;
}

function rotateImage(image: Image): Image {
  const copy = getImageCopy(image);
  for (let i = 0; i < image.length; ++i) {
    for (let j = 0; j < image.length; ++j) {
      copy[i][image.length - j - 1] = image[j][i];
    }
  }
  return copy;
}

function matchesBorder(source: Image, target: Image, direction: Direction): boolean {
  let sourceBorder: string[];
  let targetBorder: string[];
  switch (direction) {
    case Direction.Left:
      sourceBorder = source.map(line => line[0]);
      targetBorder = target.map(line => line[target.length - 1]);
      break;
    case Direction.Up:
      sourceBorder = source[0];
      targetBorder = target[target.length - 1];
      break;
    case Direction.Right:
      sourceBorder = source.map(line => line[source.length - 1]);
      targetBorder = target.map(line => line[0]);
      break;
    case Direction.Down:
      sourceBorder = source[source.length - 1];
      targetBorder = target[0];
      break;
  }
  return (sourceBorder.join("") == targetBorder.join(""));
}

function getImageVariants(image: Image): Image[] {
  const mirrored = flipImageHoriz(image);
  const rotated = rotateImage(image);
  const rotatedMirrored = flipImageHoriz(rotated);
  return [
    getImageCopy(image),
    mirrored,
    flipImageVert(image),
    flipImageVert(mirrored),
    rotated,
    rotatedMirrored,
    flipImageVert(rotated),
    flipImageVert(rotatedMirrored)
  ];
}

const CameraArrayProto = {
  _tiles: [] as Tile[],
  _size: 0,
  _variantCache: {} as VariantCache,

  getVariants(tile: Tile): Image[] {
    if (!this._variantCache[tile.id]) {
      this._variantCache[tile.id] = getImageVariants(tile.image);
    }
    return this._variantCache[tile.id];
  },

  findMatchingTile(image: Image, tiles: Tile[], direction: Direction): Tile | null {
    for (let i = 0; i < tiles.length; ++i) {
      const variants = this.getVariants(tiles[i]);
      for (let j = 0; j < variants.length; ++j) {
        if (matchesBorder(image, variants[j], direction)) {
          return {
            id: tiles[i].id,
            image: variants[j]
          };
        }
      }
    }
    return null;
  },

  findTopLeftCorners(): Tile[] {
    const corners: Tile[] = [];
    for (let i = 0; i < this._tiles.length; ++i) {
      const otherTiles = this._tiles.filter(tile => tile !== this._tiles[i]);
      const variants = this.getVariants(this._tiles[i]);
      for (let j = 0; j < variants.length; ++j) {
        let hasOutboundMatch = false;
        if (this.findMatchingTile(variants[j], otherTiles, Direction.Up)) {
          hasOutboundMatch = true;
        } else if (this.findMatchingTile(variants[j], otherTiles, Direction.Left)) {
          hasOutboundMatch = true;
        }

        if (!hasOutboundMatch) {
          for (let j = 0; j < variants.length; ++j) {
            if (this.findMatchingTile(variants[j], otherTiles, Direction.Right)) {
              if (this.findMatchingTile(variants[j], otherTiles, Direction.Down)) {
                corners.push({
                  id: this._tiles[i].id,
                  image: variants[j]
                });
              }
            }
          }
        }
      }
    }
    return corners;
  },

  assembleTileGrid(topLeftCorner: Tile): Tile[][] {
    const grid: Tile[][] = [[topLeftCorner]];
    let tileList = this._tiles.filter(tile => tile.id !== topLeftCorner.id);
    for (let y = 0; y < this._size; ++y) {
      for (let x = 0; x < this._size; ++x) {
        const curTile = grid[y][x];
        if (!curTile) {
          throw RangeError("Image cannot be assembled from provided tiles");
        }

        if (x < this._size - 1) {
          let tileListCopy = tileList.slice();
          while (true) {
            const rightMatch = this.findMatchingTile(curTile.image, tileListCopy, Direction.Right);
            if (!rightMatch) {
              throw RangeError("Image cannot be assembled from provided tiles");
            }

            let hasError: boolean;
            if (y == 0) {
              hasError = !!this.findMatchingTile(rightMatch.image, tileList.filter(tile => tile.id !== rightMatch.id), Direction.Up);
            } else {
              hasError = !matchesBorder(rightMatch.image, grid[y - 1][x + 1].image, Direction.Up);
            }
            if (!hasError) {
              grid[y].push(rightMatch);
              tileList = tileList.filter(tile => tile.id !== rightMatch.id);
              break;
            }

            tileListCopy = tileListCopy.filter(tile => tile.id !== rightMatch.id);
            if (!tileListCopy.length) {
              throw RangeError("Image cannot be assembled from provided tiles");
            }
          }
        } else if (y < this._size - 1) {
          const downMatch = this.findMatchingTile(grid[y][0].image, tileList, Direction.Down);
          if (!downMatch) {
            throw RangeError("Image cannot be assembled from provided tiles");
          }
          tileList = tileList.filter(tile => tile.id !== downMatch.id);
          grid.push([downMatch]);
        }
      }
    }
    return grid;
  },

  getAssembledTileGrid(): Tile[][] {
    const corners = this.findTopLeftCorners();
    if (corners.length) {
      for (let i = 0; i < corners.length; ++i) {
        try {
          return this.assembleTileGrid(corners[i]);
        } catch (err) {}
      }
    } else {
      throw RangeError("Unable to find top left corner");
    }
    throw RangeError("Unable to assemble image");
  }
};

export interface CameraArray {
  getAssembledTileGrid(): Tile[][];
}

export function createCameraArray(input: string[]): CameraArray {
  const tiles = getTiles(input);
  const size = Math.sqrt(tiles.length);
  if (tiles.length % size > 0) {
    throw RangeError("Tiles cannot form a square grid");
  }
  const cameraArray: typeof CameraArrayProto = Object.create(CameraArrayProto);
  cameraArray._tiles = tiles;
  cameraArray._size = size;
  cameraArray._variantCache = {};
  return cameraArray;
}
