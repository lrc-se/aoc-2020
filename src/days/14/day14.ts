import { OutputPublic } from "@/functions/output";

const MEMORY_SIZE = 2 ** 36;

interface Memory {
  [K: number]: number;
}

function applyBitmask(value: number, mask: string): number {
  const binary = value.toString(2).padStart(mask.length, "0").split("");
  for (let i = 0; i < mask.length; ++i) {
    if (mask[i] != "X") {
      binary[i] = mask[i];
    }
  }
  return parseInt(binary.join(""), 2);
}

function runProgram(input: string[]): Memory {
  const memory: Memory = {};
  const memRegExp = /^mem\[(\d+)\]$/;
  let mask = "X".repeat(36);

  input.forEach(instruction => {
    const [operation, argument] = instruction.split(/\s=\s/);
    if (operation == "mask") {
      mask = argument;
    } else {
      const match = memRegExp.exec(operation);
      if (match) {
        const memPos = +match[1];
        if (memPos < 0 || memPos > MEMORY_SIZE - 1) {
          throw RangeError(`Invalid memory position: ${memPos}`);
        }
        memory[memPos] = applyBitmask(+argument, mask);
      }
    }
  });

  return memory;
}

function sumMemory(memory: Memory): number {
  return Object.values(memory).reduce((prev, cur) => prev + cur);
}

function runPuzzle1(input: string[], output: OutputPublic) {
  try {
    const memory = runProgram(input);
    output.print(`Sum of nonzero values in memory: ${sumMemory(memory)}`);
  } catch (err) {
    output.error(err.message);
  }
  output.print();
}

export function createHandler(output: OutputPublic) {
  return {
    runTest1(input: string[]) {
      output.system("Running test 1...");
      runPuzzle1(input, output);
    },
    runPuzzle1(input: string[]) {
      output.system("Running puzzle 1...");
      runPuzzle1(input, output);
    }
  };
}
