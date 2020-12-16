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

interface FieldPositionMatches {
  [K: string]: number[];
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

function isInvalidTicket(ticket: TicketValues, rules: FieldRule[]): boolean {
  return ticket.some(value => rules.every(rule => !isValidValue(value, rule)));
}

function getFields(tickets: TicketValues[], rules: FieldRule[]): string[] {
  const matches: FieldPositionMatches = {};
  for (let i = 0; i < rules.length; ++i) {
    matches[rules[i].field] = [];
  }
  for (let i = 0; i < rules.length; ++i) {
    const values = tickets.map(ticket => ticket[i]);
    for (let j = 0; j < rules.length; ++j) {
      if (values.every(value => isValidValue(value, rules[j]))) {
        matches[rules[j].field].push(i);
      }
    }
  }

  const fields: string[] = new Array(rules.length);
  let finished: boolean;
  do {
    finished = true;
    for (const field in matches) {
      const positions = matches[field];
      if (positions.length == 1) {
        fields[positions[0]] = field;
        delete matches[field];
        for (const field2 in matches) {
          matches[field2] = matches[field2].filter(pos => pos !== positions[0]);
        }
        finished = false;
        break;
      }
    }
  } while (!finished);

  return fields;
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

function getPuzzle2Fields(notes: TicketNotes): string[] {
  const tickets = notes.nearbyTickets.filter(ticket => !isInvalidTicket(ticket, notes.fieldRules));
  return getFields(tickets, notes.fieldRules);
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
      const notes = parseNotes(input);
      const fields = getPuzzle2Fields(notes);
      output.print(`Field order: ${fields.join(", ")}`);
      output.print();
    },
    runPuzzle2(input: string[]) {
      output.system("Running puzzle 2...");
      const notes = parseNotes(input);
      const fields = getPuzzle2Fields(notes);
      const departureFieldValues = notes.myTicket.filter((_, i) => fields[i]?.startsWith("departure"));
      output.print(`Departure field values: ${departureFieldValues.join(", ")}`);
      output.print(`Result: ${departureFieldValues.reduce((prev, cur) => prev * cur)}`);
      output.print();
    }
  };
}
