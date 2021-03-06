export const days: Day[] = [
  {
    number: 1,
    title: "Report Repair",
    puzzles: [
      { number: 1, hasTest: true, hasSolution: true },
      { number: 2, hasTest: true, testInput: 1, hasSolution: true }
    ]
  },
  {
    number: 2,
    title: "Password Philosophy",
    puzzles: [
      { number: 1, hasTest: true, hasSolution: true },
      { number: 2, hasTest: true, testInput: 1, hasSolution: true }
    ]
  },
  {
    number: 3,
    title: "Toboggan Trajectory",
    puzzles: [
      { number: 1, hasTest: true, hasSolution: true },
      { number: 2, hasTest: true, testInput: 1, hasSolution: true }
    ]
  },
  {
    number: 4,
    title: "Passport Processing",
    puzzles: [
      { number: 1, hasTest: true, hasSolution: true },
      { number: 2, hasTest: true, hasSolution: true }
    ]
  },
  {
    number: 5,
    title: "Binary Boarding",
    puzzles: [
      { number: 1, hasTest: true, hasSolution: true },
      { number: 2, hasSolution: true }
    ]
  },
  {
    number: 6,
    title: "Custom Customs",
    puzzles: [
      { number: 1, hasTest: true, hasSolution: true },
      { number: 2, hasTest: true, testInput: 1, hasSolution: true }
    ]
  },
  {
    number: 7,
    title: "Handy Haversacks",
    puzzles: [
      { number: 1, hasTest: true, hasSolution: true },
      { number: 2, hasTest: true, hasSolution: true }
    ]
  },
  {
    number: 8,
    title: "Handheld Halting",
    puzzles: [
      { number: 1, hasTest: true, hasSolution: true },
      { number: 2, hasTest: true, testInput: 1, hasSolution: true }
    ]
  },
  {
    number: 9,
    title: "Encoding Error",
    puzzles: [
      { number: 1, hasTest: true, hasSolution: true },
      { number: 2, hasTest: true, testInput: 1, hasSolution: true }
    ]
  },
  {
    number: 10,
    title: "Adapter Array",
    puzzles: [
      { number: 1, hasTest: true, hasSolution: true },
      { number: 2, hasTest: true, testInput: 1, hasSolution: true }
    ]
  },
  {
    number: 11,
    title: "Seating System",
    puzzles: [
      { number: 1, hasTest: true, hasSolution: true },
      { number: 2, hasTest: true, testInput: 1, hasSolution: true }
    ]
  },
  {
    number: 12,
    title: "Rain Risk",
    puzzles: [
      { number: 1, hasTest: true, hasSolution: true },
      { number: 2, hasTest: true, testInput: 1, hasSolution: true }
    ]
  },
  {
    number: 13,
    title: "Shuttle Search",
    puzzles: [
      { number: 1, hasTest: true, hasSolution: true },
      { number: 2, hasTest: true, hasSolution: true }
    ]
  },
  {
    number: 14,
    title: "Docking Data",
    puzzles: [
      { number: 1, hasTest: true, hasSolution: true },
      { number: 2, hasTest: true, hasSolution: true }
    ]
  },
  {
    number: 15,
    title: "Rambunctious Recitation",
    puzzles: [
      { number: 1, hasTest: true, hasSolution: true },
      { number: 2, hasTest: true, testInput: 1, hasSolution: true }
    ]
  },
  {
    number: 16,
    title: "Ticket Translation",
    puzzles: [
      { number: 1, hasTest: true, hasSolution: true },
      { number: 2, hasTest: true, hasSolution: true }
    ]
  },
  {
    number: 17,
    title: "Conway Cubes",
    puzzles: [
      { number: 1, hasTest: true, hasSolution: true },
      { number: 2, hasTest: true, testInput: 1, hasSolution: true }
    ]
  },
  {
    number: 18,
    title: "Operation Order",
    puzzles: [
      { number: 1, hasTest: true, hasSolution: true },
      { number: 2, hasTest: true, testInput: 1, hasSolution: true }
    ]
  },
  {
    number: 19,
    title: "Monster Messages",
    puzzles: [
      { number: 1, hasTest: true, hasSolution: true },
      { number: 2, hasTest: true, hasSolution: true }
    ]
  },
  {
    number: 20,
    title: "Jurassic Jigsaw",
    puzzles: [
      { number: 1, hasTest: true, hasSolution: true },
      { number: 2, hasTest: true, testInput: 1, hasSolution: true }
    ]
  },
  {
    number: 21,
    title: "Allergen Assessment",
    puzzles: [
      { number: 1, hasTest: true, hasSolution: true },
      { number: 2, hasTest: true, testInput: 1, hasSolution: true }
    ]
  },
  {
    number: 22,
    title: "Crab Combat",
    puzzles: [
      { number: 1, hasTest: true, hasSolution: true },
      { number: 2, hasTest: true, testInput: 1, hasSolution: true }
    ]
  },
  {
    number: 23,
    title: "Crab Cups",
    puzzles: [
      { number: 1, hasTest: true, hasSolution: true },
      { number: 2, hasTest: true, testInput: 1, hasSolution: true }
    ]
  },
  {
    number: 24,
    title: "Lobby Layout",
    puzzles: [
      { number: 1, hasTest: true, hasSolution: true },
      { number: 2, hasTest: true, testInput: 1, hasSolution: true }
    ]
  },
  {
    number: 25,
    title: "Combo Breaker",
    puzzles: [
      { number: 1, hasTest: true, hasSolution: true }
    ]
  }
];

export interface Puzzle {
  number: number;
  hasTest?: boolean;
  testInput?: number;
  hasSolution?: boolean;
}

export interface Day {
  number: number;
  title?: string;
  puzzles: Puzzle[];
}

export function findDay(number: number): Day | undefined {
  return days.find(day => day.number === number);
}
