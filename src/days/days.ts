export const days: Day[] = [
  {
    number: 1,
    puzzles: [
      { number: 1, hasTest: true }
    ]
  }
];

export interface Puzzle {
  number: number;
  hasTest?: boolean;
}

export interface Day {
  number: number;
  puzzles: Puzzle[];
}

export function findDay(number: number): Day | undefined {
  return days.find(day => day.number === number);
}
