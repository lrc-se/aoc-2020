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
