export enum NavigationAction {
  MoveNorth = "N",
  MoveSouth = "S",
  MoveEast = "E",
  MoveWest = "W",
  MoveForward = "F",
  TurnLeft = "L",
  TurnRight = "R"
}

export interface NavigationInstruction {
  action: NavigationAction;
  value: number;
}

export interface Position {
  east: number;
  north: number;
}

export enum Direction {
  East = "E",
  South = "S",
  West = "W",
  North = "N"
}

export function parseInstructions(input: string[]): NavigationInstruction[] {
  return input.map(line => ({
    action: line[0] as NavigationAction,
    value: +line.substring(1)
  }));
}

export function getManhattanDistance(position: Position, origin: Position): number {
  return Math.abs(position.east - origin.east) + Math.abs(position.north - origin.north);
}

export function getPositionString(position: Position): string {
  const eastOrWest = `${Math.abs(position.east)}${position.east >= 0 ? "E" : "W"}`;
  const northOrSouth = `${Math.abs(position.north)}${position.north >= 0 ? "N" : "S"}`;
  return `${eastOrWest}, ${northOrSouth}`;
}
