import { OutputPublic } from "@/functions/output";

interface EarliestBus {
  id: number;
  timestamp: number;
}

function getBusIDs(data: string): number[] {
  return data.split(",").filter(id => id != "x").map(id => +id);
}

function findEarliestAvailableBus(ids: number[], earliestTimestamp: number): EarliestBus {
  let timestamp = earliestTimestamp;
  while (true) {
    for (let i = 0; i < ids.length; ++i) {
      if (timestamp % ids[i] == 0) {
        return {
          id: ids[i],
          timestamp
        };
      }
    }
    ++timestamp;
  }
}

function runPuzzle1(input: string[], output: OutputPublic) {
  const timestamp = +input[0];
  const ids = getBusIDs(input[1]);
  const earliest = findEarliestAvailableBus(ids, timestamp);
  output.print(`Earliest available bus: ${earliest.id} at timestamp ${earliest.timestamp}`);
  output.print(`Result: ${earliest.id * (earliest.timestamp - timestamp)}`);
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
