import { CubeState, PocketDimension, BasePocketDimension } from "./pocket-dimension";

interface Coordinate {
  x: number;
  y: number;
  z: number;
  w: number;
}

export class HyperPocketDimension extends BasePocketDimension implements PocketDimension {
  min: Coordinate = { x: 0, y: 0, z: 0, w: 0 };
  max: Coordinate = { x: 0, y: 0, z: 0, w: 0 };

  constructor(plane: string[] | null = null) {
    super();
    if (plane) {
      for (let y = 0; y < plane.length; ++y) {
        for (let x = 0; x < plane[y].length; ++x) {
          this.setCubeState(x, y, 0, 0, plane[y][x] as CubeState);
        }
      }
    }
  }

  getCubeState(x: number, y: number, z: number, w: number): CubeState {
    return this.grid[`${x},${y},${z},${w}`] ?? CubeState.Inactive;
  }

  setCubeState(x: number, y: number, z: number, w: number, state: CubeState) {
    this.grid[`${x},${y},${z},${w}`] = state;
    if (state == CubeState.Active) {
      this.min = {
        x: Math.min(this.min.x, x),
        y: Math.min(this.min.y, y),
        z: Math.min(this.min.z, z),
        w: Math.min(this.min.w, w)
      };
      this.max = {
        x: Math.max(this.max.x, x),
        y: Math.max(this.max.y, y),
        z: Math.max(this.max.z, z),
        w: Math.max(this.max.w, w)
      };
    }
  }

  executeCycle() {
    const temp = new HyperPocketDimension();
    for (let w = this.min.w - 1; w <= this.max.w + 1; ++w) {
      for (let z = this.min.z - 1; z <= this.max.z + 1; ++z) {
        for (let y = this.min.y - 1; y <= this.max.y + 1; ++y) {
          for (let x = this.min.x - 1; x <= this.max.x + 1; ++x) {
            const state = this.getCubeState(x, y, z, w);
            const count = this.countActiveNeighbors(x, y, z, w);
            switch (state) {
              case CubeState.Active:
                temp.setCubeState(x, y, z, w, (count == 2 || count == 3 ? CubeState.Active : CubeState.Inactive));
                break;
              case CubeState.Inactive:
                temp.setCubeState(x, y, z, w, (count == 3 ? CubeState.Active : CubeState.Inactive));
                break;
            }
          }
        }
      }
    }
    this.grid = temp.grid;
    this.min = temp.min;
    this.max = temp.max;
  }

  private countActiveNeighbors(x: number, y: number, z: number, w: number): number {
    let count = 0;
    for (let w2 = w - 1; w2 <= w + 1; ++w2) {
      for (let z2 = z - 1; z2 <= z + 1; ++z2) {
        for (let y2 = y - 1; y2 <= y + 1; ++y2) {
          for (let x2 = x - 1; x2 <= x + 1; ++x2) {
            if (this.getCubeState(x2, y2, z2, w2) == CubeState.Active) {
              ++count;
            }
          }
        }
      }
    }
    return (this.getCubeState(x, y, z, w) == CubeState.Active ? count - 1 : count);
  }
}
