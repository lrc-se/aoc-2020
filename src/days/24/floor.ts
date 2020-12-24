export enum Direction {
  East = "e",
  SouthEast = "se",
  SouthWest = "sw",
  West = "w",
  NorthWest = "nw",
  NorthEast = "ne"
}

interface Coordinate {
  x: number;
  y: number;
}

interface TileGrid {
  [K: string]: boolean;
}

type Neighbors = {
  [K in Direction]: Coordinate;
};

const NEIGHBORS: Neighbors = Object.freeze({
  [Direction.East]: { x: 1, y: 0 },
  [Direction.SouthEast]: { x: 1, y: 1 },
  [Direction.SouthWest]: { x: 0, y: 1 },
  [Direction.West]: { x: -1, y: 0 },
  [Direction.NorthWest]: { x: -1, y: -1 },
  [Direction.NorthEast]: { x: 0, y: -1 }
});

function getCoordinateString(coord: Coordinate): string {
  return `${coord.x},${coord.y}`;
}

export class Floor {
  tiles: TileGrid = {};
  min: Coordinate = { x: 0, y: 0 };
  max: Coordinate = { x: 0, y: 0 };

  isTileBlack(coord: Coordinate): boolean {
    return !!this.tiles[getCoordinateString(coord)];
  }

  setTileState(coord: Coordinate, isBlack: boolean) {
    this.tiles[getCoordinateString(coord)] = isBlack;
    this.min.x = Math.min(this.min.x, coord.x);
    this.min.y = Math.min(this.min.y, coord.y);
    this.max.x = Math.max(this.max.x, coord.x);
    this.max.y = Math.max(this.max.y, coord.y);
  }

  flipTile(stepsFromCenter: Direction[]) {
    const pos: Coordinate = { x: 0, y: 0 };
    stepsFromCenter.forEach(step => {
      pos.x += NEIGHBORS[step].x;
      pos.y += NEIGHBORS[step].y;
    });
    this.setTileState(pos, !this.isTileBlack(pos));
  }

  flipTiles() {
    const changedTiles = new Map<Coordinate, boolean>();
    for (let y = this.min.y - 1; y <= this.max.y + 1; ++y) {
      for (let x = this.min.x - 1; x <= this.max.x + 1; ++x) {
        const pos: Coordinate = { x, y };
        const isBlack = this.isTileBlack(pos);
        const count = this.countBlackNeighbors(pos);
        if (isBlack && (count == 0 || count > 2)) {
          changedTiles.set(pos, false);
        } else if (!isBlack && count == 2) {
          changedTiles.set(pos, true);
        }
      }
    }
    for (const [key, value] of changedTiles.entries()) {
      this.setTileState(key, value);
    }
  }

  countBlackNeighbors(coord: Coordinate): number {
    return Object.values(NEIGHBORS).reduce(
      (count, step) => count + +this.isTileBlack({ x: coord.x + step.x, y: coord.y + step.y }),
      0
    );
  }

  countBlackTiles(): number {
    return Object.values(this.tiles).filter(tile => tile).length;
  }
}
