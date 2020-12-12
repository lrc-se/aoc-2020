import {
  NavigationAction,
  NavigationInstruction,
  Position,
  Direction,
  parseInstructions,
  getPositionString,
  getManhattanDistance
} from "./common";
import { OutputPublic } from "@/functions/output";

interface Ship {
  origin: Position;
  position: Position;
  hasArrived(): boolean;
  navigate(): void;
}

abstract class BaseShip implements Ship {
  origin: Position;
  position: Position;
  protected instructions: NavigationInstruction[];

  constructor(instructions: NavigationInstruction[], origin: Position) {
    this.origin = origin;
    this.position = { ...origin };
    this.instructions = instructions.slice();
  }

  hasArrived() {
    return !this.instructions.length;
  }

  abstract navigate(): void;
}

class DefaultShip extends BaseShip {
  direction: Direction;

  constructor(instructions: NavigationInstruction[], direction: Direction, origin: Position = { east: 0, north: 0 }) {
    super(instructions, origin);
    this.direction = direction;
  }

  navigate() {
    const instruction = this.instructions.shift();
    if (!instruction) {
      return;
    }

    let direction: Direction | undefined;
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
        direction = this.direction;
        break;
      case NavigationAction.TurnLeft:
        this.turn(-instruction.value / 90);
        break;
      case NavigationAction.TurnRight:
        this.turn(instruction.value / 90);
        break;
    }

    switch (direction) {
      case Direction.East:
        this.position.east += instruction.value;
        break;
      case Direction.South:
        this.position.north -= instruction.value;
        break;
      case Direction.West:
        this.position.east -= instruction.value;
        break;
      case Direction.North:
        this.position.north += instruction.value;
        break;
    }
  }

  turn(steps: number) {
    const directions = Object.values(Direction);
    let index = directions.indexOf(this.direction);
    if (~index) {
      index = (index + steps) % directions.length;
      if (index < 0) {
        index += directions.length;
      }
      this.direction = directions[index];
    }
  }
}

class WaypointShip extends BaseShip {
  waypoint: Position;

  constructor(instructions: NavigationInstruction[], waypoint: Position, origin: Position = { east: 0, north: 0 }) {
    super(instructions, origin);
    this.waypoint = waypoint;
  }

  navigate() {
    const instruction = this.instructions.shift();
    if (!instruction) {
      return;
    }

    switch (instruction.action) {
      case NavigationAction.MoveNorth:
        this.waypoint.north += instruction.value;
        break;
      case NavigationAction.MoveSouth:
        this.waypoint.north -= instruction.value;
        break;
      case NavigationAction.MoveEast:
        this.waypoint.east += instruction.value;
        break;
      case NavigationAction.MoveWest:
        this.waypoint.east -= instruction.value;
        break;
      case NavigationAction.MoveForward:
        this.position.east += this.waypoint.east * instruction.value;
        this.position.north += this.waypoint.north * instruction.value;
        break;
      case NavigationAction.TurnLeft: {
        this.rotateWaypoint(-instruction.value / 90);
        break;
      }
      case NavigationAction.TurnRight: {
        this.rotateWaypoint(instruction.value / 90);
        break;
      }
    }
  }

  rotateWaypoint(steps: number) {
    let east = this.waypoint.east;
    let north = this.waypoint.north;
    switch (steps % 4) {
      case 1:
      case -3:
        east = this.waypoint.north;
        north = -this.waypoint.east;
        break;
      case 2:
      case -2:
        east = -this.waypoint.east;
        north = -this.waypoint.north;
        break;
      case 3:
      case -1:
        east = -this.waypoint.north;
        north = this.waypoint.east;
        break;
    }
    this.waypoint.east = east;
    this.waypoint.north = north;
  }
}

function runPuzzle1(input: string[], showStatus: boolean, output: OutputPublic) {
  const ship = new DefaultShip(parseInstructions(input), Direction.East);
  do {
    if (showStatus) {
      output.print(`Position: ${getPositionString(ship.position)}; Direction: ${ship.direction}`);
    }
    ship.navigate();
  } while (!ship.hasArrived());
  output.print(`Final position: ${getPositionString(ship.position)}`);
  output.print(`Manhattan distance: ${getManhattanDistance(ship.position, ship.origin)}`);
  output.print();
}

function runPuzzle2(input: string[], showStatus: boolean, output: OutputPublic) {
  const ship = new WaypointShip(parseInstructions(input), { east: 10, north: 1 });
  do {
    if (showStatus) {
      output.print(`Position: ${getPositionString(ship.position)}; Waypoint: ${getPositionString(ship.waypoint)}`);
    }
    ship.navigate();
  } while (!ship.hasArrived());
  output.print(`Final position: ${getPositionString(ship.position)}`);
  output.print(`Manhattan distance: ${getManhattanDistance(ship.position, ship.origin)}`);
  output.print();
}

export function createHandler(output: OutputPublic) {
  return {
    runTest1(input: string[]) {
      output.system("Running test 1 using classes...");
      runPuzzle1(input, true, output);
    },
    runPuzzle1(input: string[]) {
      output.system("Running puzzle 1 using classes...");
      runPuzzle1(input, false, output);
    },
    runTest2(input: string[]) {
      output.system("Running test 2 using classes...");
      runPuzzle2(input, true, output);
    },
    runPuzzle2(input: string[]) {
      output.system("Running puzzle 2 using classes...");
      runPuzzle2(input, false, output);
    }
  };
}
