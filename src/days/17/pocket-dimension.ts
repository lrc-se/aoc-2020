enum CubeState {
  Active = "#",
  Inactive = "."
}

interface Grid {
  [K: string]: {
    [K: string]: {
      [K: string]: CubeState;
    };
  };
}

interface Coordinate {
  x: number;
  y: number;
  z: number;
}

export class PocketDimension {
  grid: Grid = {};
  min: Coordinate = { x: 0, y: 0, z: 0 };
  max: Coordinate = { x: 0, y: 0, z: 0 };

  constructor(plane: string[] | null = null) {
    if (plane) {
      for (let y = 0; y < plane.length; ++y) {
        for (let x = 0; x < plane[y].length; ++x) {
          this.setCubeState(x, y, 0, plane[y][x] as CubeState);
        }
      }
    }
  }

  getCubeState(x: number, y: number, z: number): CubeState {
    if (this.grid[z] && this.grid[z][y]) {
      return this.grid[z][y][x] || CubeState.Inactive;
    }
    return CubeState.Inactive;
  }

  setCubeState(x: number, y: number, z: number, state: CubeState) {
    if (!this.grid[z]) {
      this.grid[z] = {};
    }
    if (!this.grid[z][y]) {
      this.grid[z][y] = {};
    }
    this.grid[z][y][x] = state;
    if (state == CubeState.Active) {
      this.min = {
        x: Math.min(this.min.x, x),
        y: Math.min(this.min.y, y),
        z: Math.min(this.min.z, z)
      };
      this.max = {
        x: Math.max(this.max.x, x),
        y: Math.max(this.max.y, y),
        z: Math.max(this.max.z, z)
      };
    }
  }

  executeCycle() {
    const temp = new PocketDimension();
    for (let z = this.min.z - 1; z <= this.max.z + 1; ++z) {
      for (let y = this.min.y - 1; y <= this.max.y + 1; ++y) {
        for (let x = this.min.x - 1; x <= this.max.x + 1; ++x) {
          const state = this.getCubeState(x, y, z);
          const count = this.countActiveNeighbors(x, y, z);
          switch (state) {
            case CubeState.Active:
              temp.setCubeState(x, y, z, (count == 2 || count == 3 ? CubeState.Active : CubeState.Inactive));
              break;
            case CubeState.Inactive:
              temp.setCubeState(x, y, z, (count == 3 ? CubeState.Active : CubeState.Inactive));
              break;
          }
        }
      }
    }
    this.grid = temp.grid;
    this.min = temp.min;
    this.max = temp.max;
  }

  countActiveCubes(): number {
    return Object.values(this.grid).reduce(
      (zCount, zPlane) => zCount + Object.values(zPlane).reduce(
        (yCount, yPlane) => yCount + Object.values(yPlane).filter(cube => cube == CubeState.Active).length,
        0
      ),
      0
    );
  }

  private countActiveNeighbors(x: number, y: number, z: number): number {
    let count = 0;
    for (let z2 = z - 1; z2 <= z + 1; ++z2) {
      for (let y2 = y - 1; y2 <= y + 1; ++y2) {
        for (let x2 = x - 1; x2 <= x + 1; ++x2) {
          if (this.getCubeState(x2, y2, z2) == CubeState.Active) {
            ++count;
          }
        }
      }
    }
    return (this.getCubeState(x, y, z) == CubeState.Active ? count - 1 : count);
  }
}
