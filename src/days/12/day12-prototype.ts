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
  instructions: NavigationInstruction[];
  readonly hasArrived: boolean;
  navigate(): void;
}

interface DefaultShip extends Ship {
  direction: Direction;
  init(instructions: NavigationInstruction[], direction: Direction, origin?: Position): void;
  turn(steps: number): void;
}

interface WaypointShip extends Ship {
  waypoint: Position;
  init(instructions: NavigationInstruction[], waypoint: Position, origin?: Position): void;
  rotateWaypoint(steps: number): void;
}

const BaseShip = {
  origin: null as unknown as Position,
  position: null as unknown as Position,
  instructions: [] as NavigationInstruction[],

  get hasArrived() {
    return !this.instructions.length;
  },

  init(instructions: NavigationInstruction[], origin: Position) {
    Object.assign(this, {
      origin,
      position: { ...origin },
      instructions: instructions.slice()
    });
  }
};

const DefaultShip: DefaultShip = Object.create(BaseShip);
Object.assign(DefaultShip, {
  direction: null as unknown as Direction,

  init(instructions: NavigationInstruction[], direction: Direction, origin: Position = { east: 0, north: 0 }) {
    BaseShip.init.call(this, instructions, origin);
    this.direction = direction;
  },

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
  },

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
} as DefaultShip);

const WaypointShip: WaypointShip = Object.create(BaseShip);
Object.assign(WaypointShip, {
  waypoint: null as unknown as Position,

  init(instructions: NavigationInstruction[], waypoint: Position, origin: Position = { east: 0, north: 0 }) {
    BaseShip.init.call(this, instructions, origin);
    this.waypoint = waypoint;
  },

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
  },

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
} as WaypointShip);

function runPuzzle1(input: string[], showStatus: boolean, output: OutputPublic) {
  const ship: DefaultShip = Object.create(DefaultShip);
  ship.init(parseInstructions(input), Direction.East);
  do {
    if (showStatus) {
      output.print(`Position: ${getPositionString(ship.position)}; Direction: ${ship.direction}`);
    }
    ship.navigate();
  } while (!ship.hasArrived);
  output.print(`Final position: ${getPositionString(ship.position)}`);
  output.print(`Manhattan distance: ${getManhattanDistance(ship.position, ship.origin)}`);
  output.print();
}

function runPuzzle2(input: string[], showStatus: boolean, output: OutputPublic) {
  const ship: WaypointShip = Object.create(WaypointShip);
  ship.init(parseInstructions(input), { east: 10, north: 1 });
  do {
    if (showStatus) {
      output.print(`Position: ${getPositionString(ship.position)}; Waypoint: ${getPositionString(ship.waypoint)}`);
    }
    ship.navigate();
  } while (!ship.hasArrived);
  output.print(`Final position: ${getPositionString(ship.position)}`);
  output.print(`Manhattan distance: ${getManhattanDistance(ship.position, ship.origin)}`);
  output.print();
}

export function createHandler(output: OutputPublic) {
  return {
    runTest1(input: string[]) {
      output.system("Running test 1 using prototypes...");
      runPuzzle1(input, true, output);
    },
    runPuzzle1(input: string[]) {
      output.system("Running puzzle 1 using prototypes...");
      runPuzzle1(input, false, output);
    },
    runTest2(input: string[]) {
      output.system("Running test 2 using prototypes...");
      runPuzzle2(input, true, output);
    },
    runPuzzle2(input: string[]) {
      output.system("Running puzzle 2 using prototypes...");
      runPuzzle2(input, false, output);
    }
  };
}
