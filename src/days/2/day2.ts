import { OutputPublic } from "@/functions/output";

const policyRegExp = /(\d+)-(\d+)\s(\w)/;

function isPasswordValid1(pwd: string, policy: string): boolean {
  const match = policyRegExp.exec(policy);
  if (match) {
    const [min, max] = match.slice(1, 3).map(x => +x);
    const count = pwd.split("").filter(letter => letter === match[3]).length;
    return (count >= min && count <= max);
  }
  return true;
}

function isPasswordValid2(pwd: string, policy: string): boolean {
  const match = policyRegExp.exec(policy);
  if (match) {
    const [pos1, pos2] = match.slice(1, 3).map(x => +x);
    return ((pwd[pos1 - 1] === match[3]) != (pwd[pos2 - 1] === match[3]));
  }
  return true;
}

function runTest(input: string[], validator: (pwd: string, policy: string) => boolean, output: OutputPublic) {
  input.forEach(line => {
    const [policy, pwd] = line.split(/:\s/);
    output.print(`${pwd} (${policy}): ${validator(pwd, policy) ? "valid" : "invalid"}`);
  });
  output.print();
}

function runPuzzle(input: string[], validator: (pwd: string, policy: string) => boolean, output: OutputPublic) {
  const validPasswords = input
    .map(line => line.split(/:\s/))
    .filter(([policy, pwd]) => validator(pwd, policy));
  output.print(`Valid password count: ${validPasswords.length}`);
  output.print();
}

export function createHandler(output: OutputPublic) {
  return {
    runTest1(input: string[]) {
      output.system("Running test 1...");
      runTest(input, isPasswordValid1, output);
    },
    runPuzzle1(input: string[]) {
      output.system("Running puzzle 1...");
      runPuzzle(input, isPasswordValid1, output);
    },
    runTest2(input: string[]) {
      output.system("Running test 2...");
      runTest(input, isPasswordValid2, output);
    },
    runPuzzle2(input: string[]) {
      output.system("Running puzzle 2...");
      runPuzzle(input, isPasswordValid2, output);
    }
  };
}
