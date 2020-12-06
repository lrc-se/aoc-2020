import { OutputPublic } from "@/functions/output";

type AnswerFinder = (groupAnswers: string[]) => Set<string>;

function getGroupAnswers(input: string[]): string[][] {
  return input.join("\n").split("\n\n").map(group => group.split("\n"));
}

function getUniqueAnswers(groupAnswers: string[]): Set<string> {
  return new Set<string>(
    ([] as string[]).concat(...groupAnswers.map(groupAnswer => groupAnswer.split("")))
  );
}

function getCommonAnswers(groupAnswers: string[]): Set<string> {
  const uniqueAnswers = getUniqueAnswers(groupAnswers);
  return new Set(
    Array.from(uniqueAnswers)
      .filter(answer => groupAnswers.every(groupAnswer => groupAnswer.includes(answer)))
  );
}

function runPuzzle(input: string[], finder: AnswerFinder, showAnswers: boolean, output: OutputPublic) {
  const groupAnswers = getGroupAnswers(input);
  const answers = groupAnswers.map(finder);
  if (showAnswers) {
    answers.forEach((answer, i) => {
      output.print(`Group #${i + 1}: ${answer.size} yes answers`);
    });
  }
  const count = answers.map(answer => answer.size).reduce((prev, cur) => prev + cur);
  output.print(`Total number of yes answers: ${count}`);
  output.print();
}

export function createHandler(output: OutputPublic) {
  return {
    runTest1(input: string[]) {
      output.system("Running test 1...");
      runPuzzle(input, getUniqueAnswers, true, output);
    },
    runPuzzle1(input: string[]) {
      output.system("Running puzzle 1...");
      runPuzzle(input, getUniqueAnswers, false, output);
    },
    runTest2(input: string[]) {
      output.system("Running test 2...");
      runPuzzle(input, getCommonAnswers, true, output);
    },
    runPuzzle2(input: string[]) {
      output.system("Running puzzle 2...");
      runPuzzle(input, getCommonAnswers, false, output);
    }
  };
}
