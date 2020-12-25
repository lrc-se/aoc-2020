import { OutputPublic } from "@/functions/output";

interface Keys {
  card: number;
  door: number;
}

function getKeys(input: string[]): Keys {
  const keys = input.map(num => +num);
  return {
    card: keys[0],
    door: keys[1]
  };
}

function transform(subject: number, loops: number, startValue = 1): number {
  let value = startValue;
  for (let i = 1; i <= loops; ++i) {
    value = (value * subject) % 20201227;
  }
  return value;
}

export function runPuzzle(input: string[], output: OutputPublic) {
  const keys = getKeys(input);
  let loops = 0;
  let key = 1;
  do {
    key = transform(7, 1, key);
    ++loops;
  } while (key != keys.card);
  output.print(`Card key: ${key}`);
  output.print(`Card loop size: ${loops}`);
  const encKey = transform(keys.door, loops);
  output.print(`Encryption key: ${encKey}`);
  output.print();
}
