import { gcd, lcm } from "./math";
import { OutputPublic } from "@/functions/output";

interface EarliestBus {
  id: number;
  timestamp: number;
}

interface DepartureOffset {
  id: number;
  offset: number;
}

function getBusIDs(data: string): number[] {
  return data.split(",").filter(id => id != "x").map(id => +id);
}

function getDepartureOffsets(data: string): DepartureOffset[] {
  const offsets: DepartureOffset[] = [];
  data.split(",").forEach((id, offset) => {
    if (id != "x") {
      offsets.push({ id: +id, offset });
    }
  });
  return offsets;
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

function findSyncTimestamp(offsets: DepartureOffset[]): number {
  const first = offsets[0];
  let timestamp = first.id;
  let step = timestamp;
  for (let i = 1; i < offsets.length; ++i) {
    const offset = offsets[i].offset - first.offset;
    const divider = gcd(step, offsets[i].id);
    if (offset % divider > 0 || (timestamp + step) % divider > 0) {
      throw RangeError("Periods will never be in sync");
    }

    do {
      timestamp += step;
    } while ((timestamp + offset) % offsets[i].id > 0);
    step = lcm(step, offsets[i].id);
  }
  return timestamp;
}

function runPuzzle1(input: string[], output: OutputPublic) {
  const timestamp = +input[0];
  const ids = getBusIDs(input[1]);
  const earliest = findEarliestAvailableBus(ids, timestamp);
  output.print(`Earliest available bus: ${earliest.id} at timestamp ${earliest.timestamp}`);
  output.print(`Result: ${earliest.id * (earliest.timestamp - timestamp)}`);
  output.print();
}

function runPuzzle2(input: string, output: OutputPublic) {
  const offsets = getDepartureOffsets(input);
  try {
    const timestamp = findSyncTimestamp(offsets);
    output.print(`Earliest timestamp: ${timestamp}`);
  } catch (err) {
    output.error(err.message);
  }
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
    },
    runTest2(input: string[]) {
      output.system("Running test 2...");
      input.forEach((line, i) => {
        output.print(`[Example #${i + 1}] `, true);
        runPuzzle2(line, output);
      });
      output.print();
    },
    runPuzzle2(input: string[]) {
      output.system("Running puzzle 2...");
      runPuzzle2(input[1], output);
      output.print();
    }
  };
}
