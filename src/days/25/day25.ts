import { OutputPublic } from "@/functions/output";

interface Keys {
  card: number;
  door: number;
}

interface KeyCache {
  [K: number]: number;
}

function getKeys(input: string[]): Keys {
  const keys = input.map(num => +num);
  return {
    card: keys[0],
    door: keys[1]
  };
}

function transform(subject: number, loops: number, cache: KeyCache = {}): number {
  let value = 1;
  let start = 1;
  let existing = loops;
  while (existing) {
    if (cache[existing]) {
      value = cache[existing];
      start = existing + 1;
      break;
    }
    --existing;
  }

  for (let i = start; i <= loops; ++i) {
    value = (value * subject) % 20201227;
  }
  cache[loops] = value;
  return value;
}

export function runPuzzle(input: string[], output: OutputPublic) {
  const keys = getKeys(input);
  let loops = 0;
  let key;
  const cache: KeyCache = {};
  do {
    key = transform(7, ++loops, cache);
  } while (key != keys.card);
  output.print(`Card loop size: ${loops}`);
  const encKey = transform(keys.door, loops);
  output.print(`Encryption key: ${encKey}`);
  output.print();
}
