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

function runPuzzle1(input: string[], bagType: string, showBags: boolean, output: OutputPublic) {
  const bagRules = getBagRules(input);
  const bags = Object.keys(bagRules).filter(type => canContainBagType(bagRules, type, bagType));
  if (showBags) {
    output.print(`Bags containing "${bagType}" bag: ${bags.join(", ")}`);
  }
  output.print(`Number of bags containing "${bagType}" bag: ${bags.length}`);
  output.print();
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
    }
  };
}
