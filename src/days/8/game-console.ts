export enum Operation {
  Accumulator = "acc",
  Jump = "jmp",
  NoOperation = "nop"
}

export interface Instruction {
  operation: Operation;
  argument: number;
  executed?: boolean;
}

const GameConsoleProto = {
  program: [] as Instruction[],
  pointer: 0,
  accumulator: 0,

  setProgram(lines: string[], reset = false) {
    this.program = lines.map<Instruction>((line, i) => {
      const [operation, argument] = line.trim().split(/\s+/);
      const argVal = +argument;
      if (isNaN(argVal)) {
        throw TypeError(`Invalid argument on line ${i + 1}: ${argument}`);
      }
      return {
        operation: operation as Operation,
        argument: argVal
      };
    });
    if (reset) {
      this.reset();
    }
  },

  reset() {
    this.pointer = 0;
    this.accumulator = 0;
  },

  run() {
    while (this.pointer !== this.program.length) {
      const instruction = this.program[this.pointer];
      if (!instruction) {
        throw RangeError(`Invalid instruction pointer: ${this.pointer}`);
      }
      if (instruction.executed) {
        throw Error(`Infinite loop detected at position ${this.pointer}`);
      }

      instruction.executed = true;
      switch (instruction.operation) {
        case Operation.Accumulator:
          this.accumulator += instruction.argument;
          break;
        case Operation.Jump:
          this.pointer += instruction.argument;
          continue;
        case Operation.NoOperation:
          break;
        default:
          throw SyntaxError(`Unknown operation '${instruction.operation}' at position ${this.pointer}`);
      }

      ++this.pointer;
    }
  }
};

export type GameConsole = typeof GameConsoleProto;

export function createConsole(program?: string[]): GameConsole {
  const con: GameConsole = Object.create(GameConsoleProto);
  con.setProgram(program || [], true);
  return con;
}
