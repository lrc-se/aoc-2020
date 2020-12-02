import { OutputPublic } from "@/functions/output";

const policyRegExp = /(\d+)-(\d+)\s(\w)/;

function isPasswordValid(pwd: string, policy: string): boolean {
  const match = policyRegExp.exec(policy);
  if (match) {
    const [min, max] = match.slice(1, 3).map(x => +x);
    const count = pwd.split("").filter(letter => letter === match[3]).length;
    return (count >= min && count <= max);
  }
  return true;
}

export function createHandler(output: OutputPublic) {
  return {
    runTest1(input: string[]) {
      output.system("Running test 1...");
      input.forEach(line => {
        const [policy, pwd] = line.split(/:\s/);
        output.print(`${pwd} (${policy}): ${isPasswordValid(pwd, policy) ? "valid" : "invalid"}`);
      });
      output.print();
    },
    runPuzzle1(input: string[]) {
      output.system("Running puzzle 1...");
      const validPasswords = input
        .map(line => line.split(/:\s/))
        .filter(([policy, pwd]) => isPasswordValid(pwd, policy));
      output.print(`Valid password count: ${validPasswords.length}`);
      output.print();
    }
  };
}
