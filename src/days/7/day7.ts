import { OutputPublic } from "@/functions/output";

interface BagRule {
  type: string;
  count: number;
}

interface BagRules {
  [K: string]: BagRule[];
}

function getBagRules(input: string[]): BagRules {
  const bagRules: BagRules = {};
  const lineRegExp = /^(.+)\sbags\scontain\s(.+).$/;
  const bagRegExp = /^(\d+)\s(.+)\sbags?$/;
  input.forEach(line => {
    const lineMatch = lineRegExp.exec(line);
    if (lineMatch) {
      const [, type, bags] = lineMatch;
      const rules: BagRule[] = [];
      if (bags != "no other bags") {
        bags.split(/,\s?/).forEach(bag => {
          const bagMatch = bagRegExp.exec(bag);
          if (bagMatch) {
            const [, count, bagType] = bagMatch;
            rules.push({
              type: bagType,
              count: +count
            });
          }
        });
      }
      bagRules[type] = rules;
    }
  });
  return bagRules;
}

function canContainBagType(bagRules: BagRules, containerType: string, containeeType: string): boolean {
  const rules = bagRules[containerType];
  if (rules?.length) {
    if (rules.some(rule => rule.type === containeeType)) {
      return true;
    }
    return rules.some(rule => canContainBagType(bagRules, rule.type, containeeType));
  }
  return false;
}

function countContainedBags(bagRules: BagRules, type: string): number {
  const rules = bagRules[type];
  if (rules?.length) {
    return rules
      .map(rule => rule.count + rule.count * countContainedBags(bagRules, rule.type))
      .reduce((cur, prev) => cur + prev);
  }
  return 0;
}

function runPuzzle1(input: string[], bagType: string, showBags: boolean, output: OutputPublic) {
  const bagRules = getBagRules(input);
  const bags = Object.keys(bagRules).filter(type => canContainBagType(bagRules, type, bagType));
  if (showBags) {
    output.print(`Bags containing "${bagType}" bag: ${bags.join(", ")}`);
  }
  output.print(`Number of bags containing "${bagType}" bag: ${bags.length}`);
  output.print();
}

function runPuzzle2(input: string[], bagType: string, output: OutputPublic) {
  const rules = getBagRules(input);
  const count = countContainedBags(rules, bagType);
  output.print(`Number of bags contained in "${bagType}" bag: ${count}`);
}

export function createHandler(output: OutputPublic) {
  return {
    runTest1(input: string[]) {
      output.system("Running test 1...");
      runPuzzle1(input, "shiny gold", true, output);
    },
    runPuzzle1(input: string[]) {
      output.system("Running puzzle 1...");
      runPuzzle1(input, "shiny gold", false, output);
    },
    runTest2(input: string[]) {
      output.system("Running test 2...");
      output.print("[Example #1] ", true);
      runPuzzle2(input.slice(0, 9), "shiny gold", output);
      output.print("[Example #2] ", true);
      runPuzzle2(input.slice(10), "shiny gold", output);
      output.print();
    },
    runPuzzle2(input: string[]) {
      output.system("Running puzzle 2...");
      runPuzzle2(input, "shiny gold", output);
      output.print();
    }
  };
}
