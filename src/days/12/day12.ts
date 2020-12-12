import { OutputPublic } from "@/functions/output";

enum NavigationAction {
  MoveNorth = "N",
  MoveSouth = "S",
  MoveEast = "E",
  MoveWest = "W",
  MoveForward = "F",
  TurnLeft = "L",
  TurnRight = "R"
}

interface NavigationInstruction {
  action: NavigationAction;
  value: number;
}

interface Position {
  east: number;
  north: number;
}

enum Direction {
  East = "E",
  South = "S",
  West = "W",
  North = "N"
}

interface BaseShip {
  origin: Position;
  position: Position;
  instructions: NavigationInstruction[];
}

interface Ship extends BaseShip {
  direction: Direction;
}

interface WaypointShip extends BaseShip {
  waypoint: Position;
}

function parseInstructions(input: string[]): NavigationInstruction[] {
  return input.map(line => ({
    action: line[0] as NavigationAction,
    value: +line.substring(1)
  }));
}

function createShip(
  instructions: NavigationInstruction[],
  direction: Direction,
  origin: Position = { east: 0, north: 0 }
): Ship {
  return {
    origin,
    position: { ...origin },
    direction,
    instructions
  };
}

function createWaypointShip(
  instructions: NavigationInstruction[],
  waypoint: Position,
  origin: Position = { east: 0, north: 0 }
): WaypointShip {
  return {
    origin,
    position: { ...origin },
    waypoint,
    instructions
  };
}

function turn(ship: Ship, steps: number) {
  const directions = Object.values(Direction);
  let index = directions.indexOf(ship.direction);
  if (~index) {
    index = (index + steps) % directions.length;
    if (index < 0) {
      index += directions.length;
    }
    ship.direction = directions[index];
  }
}

function rotateWaypoint(waypoint: Position, steps: number) {
  let east = waypoint.east;
  let north = waypoint.north;
  switch (steps % 4) {
    case 1:
    case -3:
      east = waypoint.north;
      north = -waypoint.east;
      break;
    case 2:
    case -2:
      east = -waypoint.east;
      north = -waypoint.north;
      break;
    case 3:
    case -1:
      east = -waypoint.north;
      north = waypoint.east;
      break;
  }
  waypoint.east = east;
  waypoint.north = north;
}

function navigate(ship: Ship) {
  const instruction = ship.instructions.shift();
  if (instruction) {
    let direction: Direction;
    switch (instruction.action) {
      case NavigationAction.MoveNorth:
        direction = Direction.North;
        break;
      case NavigationAction.MoveSouth:
        direction = Direction.South;
        break;
      case NavigationAction.MoveEast:
        direction = Direction.East;
        break;
      case NavigationAction.MoveWest:
        direction = Direction.West;
        break;
      case NavigationAction.MoveForward:
        direction = ship.direction;
        break;
      case NavigationAction.TurnLeft:
        turn(ship, -instruction.value / 90);
        return;
      case NavigationAction.TurnRight:
        turn(ship, instruction.value / 90);
        return;
    }

    switch (direction) {
      case Direction.East:
        ship.position.east += instruction.value;
        break;
      case Direction.South:
        ship.position.north -= instruction.value;
        break;
      case Direction.West:
        ship.position.east -= instruction.value;
        break;
      case Direction.North:
        ship.position.north += instruction.value;
        break;
    }
  }
}

function navigateWithWaypoint(ship: WaypointShip) {
  const instruction = ship.instructions.shift();
  if (instruction) {
    switch (instruction.action) {
      case NavigationAction.MoveNorth:
        ship.waypoint.north += instruction.value;
        break;
      case NavigationAction.MoveSouth:
        ship.waypoint.north -= instruction.value;
        break;
      case NavigationAction.MoveEast:
        ship.waypoint.east += instruction.value;
        break;
      case NavigationAction.MoveWest:
        ship.waypoint.east -= instruction.value;
        break;
      case NavigationAction.MoveForward:
        ship.position.east += ship.waypoint.east * instruction.value;
        ship.position.north += ship.waypoint.north * instruction.value;
        break;
      case NavigationAction.TurnLeft: {
        rotateWaypoint(ship.waypoint, -instruction.value / 90);
        break;
      }
      case NavigationAction.TurnRight: {
        rotateWaypoint(ship.waypoint, instruction.value / 90);
        break;
      }
    }
  }
}

function getManhattanDistance(position: Position, origin: Position): number {
  return Math.abs(position.east - origin.east) + Math.abs(position.north - origin.north);
}

function getPositionString(position: Position): string {
  const eastOrWest = `${Math.abs(position.east)}${position.east >= 0 ? "E" : "W"}`;
  const northOrSouth = `${Math.abs(position.north)}${position.north >= 0 ? "N" : "S"}`;
  return `${eastOrWest}, ${northOrSouth}`;
}

function runPuzzle1(input: string[], showStatus: boolean, output: OutputPublic) {
  const ship = createShip(parseInstructions(input), Direction.East);
  while (ship.instructions.length) {
    if (showStatus) {
      output.print(`Position: ${getPositionString(ship.position)}; Direction: ${ship.direction}`);
    }
    navigate(ship);
  }
  output.print(`Final position: ${getPositionString(ship.position)}`);
  output.print(`Manhattan distance: ${getManhattanDistance(ship.position, ship.origin)}`);
  output.print();
}

function runPuzzle2(input: string[], showStatus: boolean, output: OutputPublic) {
  const ship = createWaypointShip(parseInstructions(input), { east: 10, north: 1 });
  while (ship.instructions.length) {
    if (showStatus) {
      output.print(`Position: ${getPositionString(ship.position)}; Waypoint: ${getPositionString(ship.waypoint)}`);
    }
    navigateWithWaypoint(ship);
  }
  output.print(`Final position: ${getPositionString(ship.position)}`);
  output.print(`Manhattan distance: ${getManhattanDistance(ship.position, ship.origin)}`);
  output.print();
}

export function createHandler(output: OutputPublic) {
  return {
    runTest1(input: string[]) {
      output.system("Running test 1...");
      runPuzzle1(input, true, output);
    },
    runPuzzle1(input: string[]) {
      output.system("Running puzzle 1...");
      runPuzzle1(input, false, output);
    },
    runTest2(input: string[]) {
      output.system("Running test 2...");
      runPuzzle2(input, true, output);
    },
    runPuzzle2(input: string[]) {
      output.system("Running puzzle 2...");
      runPuzzle2(input, false, output);
    }
  };
}
