import { OutputPublic } from "@/functions/output";

interface Seat {
  readonly row: number;
  readonly col: number;
  readonly id: number;
}

function findPosition(data: string, lowerChar: string, upperChar: string): number {
  const bin = data
    .split("")
    .map(char => (char === lowerChar ? "0" : (char === upperChar ? "1" : "X")))
    .join("");
  return +`0b${bin}`;
}

function findSeat(data: string): Seat | null {
  const row = findPosition(data.slice(0, 7), "F", "B");
  const col = findPosition(data.slice(7), "L", "R");
  if (!isNaN(row) && !isNaN(col)) {
    return {
      row,
      col,
      id: row * 8 + col
    };
  }
  return null;
}

function findSeats(input: string[]): Seat[] {
  return input.map(findSeat).filter((seat): seat is Seat => !!seat);
}

export function createHandler(output: OutputPublic) {
  return {
    runTest1(input: string[]) {
      output.system("Running test 1...");
      input.forEach((pass, i) => {
        output.print(`Seat #${i + 1}: `, true);
        const seat = findSeat(pass);
        if (seat) {
          output.print(`row ${seat.row}, column ${seat.col}, ID ${seat.id}`);
        } else {
          output.error("invalid pass");
        }
      });
      output.print();
    },
    runPuzzle1(input: string[]) {
      output.system("Running puzzle 1...");
      const seats = findSeats(input);
      const max = Math.max(...seats.map(seat => seat.id));
      output.print(`Highest seat ID: ${max}`);
      output.print();
    },
    runPuzzle2(input: string[]) {
      output.system("Running puzzle 2...");
      const ids = findSeats(input).map(seat => seat.id);
      ids.sort((a, b) => a - b);
      for (let i = 1; i < ids.length; ++i) {
        if (ids[i] - ids[i - 1] == 2) {
          output.print(`Seat ID: ${ids[i] - 1}`);
          output.print();
          return;
        }
      }
      output.error("Seat ID not found");
      output.print();
    }
  };
}
