import { OutputPublic } from "@/functions/output";

interface Range {
  min: number;
  max: number;
}

interface FieldRule {
  field: string;
  ranges: Range[];
}

type TicketValues = number[];

interface TicketNotes {
  fieldRules: FieldRule[];
  myTicket: TicketValues;
  nearbyTickets: TicketValues[];
}

function parseRule(input: string): FieldRule {
  const [field, rangeInput] = input.split(/:\s+/);
  const ranges = rangeInput.split(/\s+or\s+/);
  return {
    field,
    ranges: ranges.map(range => {
      const [min, max] = range.split("-");
      return { min: +min, max: +max };
    })
  };
}

function parseTicketValues(input: string): TicketValues {
  return input.split(",").map(value => +value);
}

function parseNotes(input: string[]): TicketNotes {
  const [rulePart, myPart, nearbyPart] = input.join("\n").split("\n\n").map(line => line.split("\n"));
  return {
    fieldRules: rulePart.map(parseRule),
    myTicket: parseTicketValues(myPart.filter(line => line != "your ticket:")[0]),
    nearbyTickets: nearbyPart.filter(line => line != "nearby tickets:").map(parseTicketValues)
  };
}

function isValidValue(value: number, rule: FieldRule): boolean {
  for (let i = 0; i < rule.ranges.length; ++i) {
    if (value >= rule.ranges[i].min && value <= rule.ranges[i].max) {
      return true;
    }
  }
  return false;
}

function findInvalidValues(tickets: TicketValues[], rules: FieldRule[]): number[] {
  const invalid: number[] = [];
  tickets.forEach(ticket => {
    ticket.forEach(value => {
      for (let i = 0; i < rules.length; ++i) {
        if (isValidValue(value, rules[i])) {
          return;
        }
      }
      invalid.push(value);
    });
  });
  return invalid;
}

function runPuzzle1(input: string[], showInvalid: boolean, output: OutputPublic) {
  const notes = parseNotes(input);
  const invalid = findInvalidValues(notes.nearbyTickets, notes.fieldRules);
  if (showInvalid) {
    output.print(`Invalid values: ${invalid.join(", ")}`);
  }
  output.print(`Ticket scaninng error rate: ${invalid.reduce((prev, cur) => prev + cur)}`);
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
    }
  };
}
