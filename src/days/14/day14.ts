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

function getMemoryAddresses(address: number, mask: string): number[] {
  const addresses: number[] = [];
  const floating: number[] = [];
  const binary = address.toString(2).padStart(mask.length, "0").split("");
  for (let i = 0; i < mask.length; ++i) {
    if (mask[i] == "1") {
      binary[i] = "1";
    } else if (mask[i] == "X") {
      floating.push(i);
    }
  }

  const floatingSize = 2 ** floating.length;
  for (let i = 0; i < floatingSize; ++i) {
    const bits = i.toString(2).padStart(floating.length, "0").split("");
    const floatingBinary = binary.slice();
    for (let j = 0; j < floating.length; ++j) {
      floatingBinary[floating[j]] = bits[j];
    }
    addresses.push(parseInt(floatingBinary.join(""), 2));
  }

  return addresses;
}

function writeToMemory(memory: Memory, address: number, value: number) {
  if (address < 0 || address > MEMORY_SIZE - 1) {
    throw RangeError(`Invalid memory position: ${address}`);
  }
  memory[address] = value;
}

function runProgram(input: string[], version = 1): Memory {
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
        const address = +match[1];
        const value = +argument;
        if (version == 1) {
          writeToMemory(memory, address, applyBitmask(value, mask));
        } else if (version == 2) {
          const addresses = getMemoryAddresses(address, mask);
          addresses.forEach(addr => {
            writeToMemory(memory, addr, value);
          });
        }
      }
    }
  });

  return memory;
}

function sumMemory(memory: Memory): number {
  return Object.values(memory).reduce((prev, cur) => prev + cur);
}

function runPuzzle(input: string[], version: number, output: OutputPublic) {
  try {
    const memory = runProgram(input, version);
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
      runPuzzle(input, 1, output);
    },
    runPuzzle1(input: string[]) {
      output.system("Running puzzle 1...");
      runPuzzle(input, 1, output);
    },
    runTest2(input: string[]) {
      output.system("Running test 2...");
      runPuzzle(input, 2, output);
    },
    runPuzzle2(input: string[]) {
      output.system("Running puzzle 2...");
      runPuzzle(input, 2, output);
    }
  };
}
