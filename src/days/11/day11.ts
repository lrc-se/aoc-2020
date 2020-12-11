export enum PositionType {
  Floor = ".",
  EmptySeat = "L",
  OccupiedSeat = "#"
}

export type Layout = PositionType[][];

interface Coordinate {
  y: number;
  x: number;
}

const STEPS: Coordinate[] = [
  { y: -1, x: -1 },
  { y: -1, x: 0 },
  { y: -1, x: 1 },
  { y: 0, x: -1 },
  { y: 0, x: 1 },
  { y: 1, x: -1 },
  { y: 1, x: 0 },
  { y: 1, x: 1 }
];

export function getLayout(input: string[]): Layout {
  return input.map<PositionType[]>(line => line.split("") as PositionType[]);
}

function countVisibleOccupiedSeats(layout: Layout, pos: Coordinate, maxSteps = Infinity): number {
  let count = 0;
  for (const step of STEPS) {
    let numSteps = 0;
    const curPos = { ...pos };
    while (numSteps < maxSteps) {
      curPos.x += step.x;
      curPos.y += step.y;
      if (!layout[curPos.y]) {
        break;
      }
      const position = layout[curPos.y][curPos.x];
      if (position === PositionType.OccupiedSeat) {
        ++count;
        break;
      } else if (position !== PositionType.Floor) {
        break;
      }
      ++numSteps;
    }
  }
  return count;
}

export function applyRules(layout: Layout, occupiedThreshold: number, maxSteps = Infinity): boolean {
  const tempLayout = layout.map(row => row.slice());
  let updated = false;
  for (let y = 0; y < layout.length; ++y) {
    for (let x = 0; x < layout[y].length; ++x) {
      switch (layout[y][x]) {
        case PositionType.EmptySeat:
          if (countVisibleOccupiedSeats(tempLayout, { y, x }, maxSteps) == 0) {
            layout[y][x] = PositionType.OccupiedSeat;
            updated = true;
          }
          break;
        case PositionType.OccupiedSeat:
          if (countVisibleOccupiedSeats(tempLayout, { y, x }, maxSteps) >= occupiedThreshold) {
            layout[y][x] = PositionType.EmptySeat;
            updated = true;
          }
          break;
      }
    }
  }
  return updated;
}

export function countOccupiedSeats(layout: Layout): number {
  return layout.reduce(
    (count, row) => count + row.filter(position => position === PositionType.OccupiedSeat).length,
    0
  );
}
