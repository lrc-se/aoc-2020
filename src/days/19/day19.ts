import { OutputPublic } from "@/functions/output";

interface Rule {
  char?: string;
  rules: number[][];
}

interface Rules {
  [K: number]: Rule;
}

interface LoopDefinitions {
  [K: number]: {
    original: number[];
    pattern: number[];
  };
}

interface ParsedInput {
  rules: Rules;
  messages: string[];
}

const LOOPS: LoopDefinitions = {
  8: {
    original: [42],
    pattern: [42, 8]
  },
  11: {
    original: [42, 31],
    pattern: [42, 11, 31]
  }
};

function parseRules(input: string[]): Rules {
  const rules: Rules = {};
  input.forEach(line => {
    const rule: Rule = { rules: [] };
    const [number, definition] = line.split(/\s*:\s*/);
    const match = /^"(.)"$/.exec(definition);
    if (match) {
      rule.char = match[1];
    } else {
      rule.rules = definition.split(/\s*\|\s*/).map(rules => rules.split(/\s+/).map(x => +x));
    }
    rules[number as unknown as number] = rule;
  });
  return rules;
}

function parseInput(input: string[]): ParsedInput {
  const [rules, messages] = input.join("\n").split("\n\n").map(line => line.split("\n"));
  return {
    rules: parseRules(rules),
    messages
  };
}

function getRuleMatch(message: string, rules: Rules, ruleNumber: number): string {
  let match = "";
  const rule = rules[ruleNumber];
  if (rule) {
    if (rule.char) {
      if (message[0] === rule.char) {
        match = rule.char;
      }
    } else if (rule.rules.length) {
      for (let i = 0; i < rule.rules.length; ++i) {
        const matches: string[] = [];
        let msg = message;
        let hasMatch = true;
        for (let j = 0; j < rule.rules[i].length; ++j) {
          const ruleMatch = getRuleMatch(msg, rules, rule.rules[i][j]);
          if (!ruleMatch) {
            hasMatch = false;
            break;
          }
          matches.push(ruleMatch);
          msg = msg.substring(ruleMatch.length);
        }
        if (hasMatch) {
          match = matches.join("");
          break;
        }
      }
    } else {
      match = message;
    }
  }
  return match;
}

function isValidMessage(message: string, rules: Rules, ruleNumber: number): boolean {
  return (getRuleMatch(message, rules, ruleNumber) === message);
}

function getLoopedRules(ruleNumber: number, loopDefinitions: LoopDefinitions, iterations: number): number[] {
  const { original, pattern } = loopDefinitions[ruleNumber];
  const loopIndex = pattern.indexOf(ruleNumber);
  if (!~loopIndex) {
    return pattern.slice();
  }
  const rules: number[] = [];
  const firstPart = pattern.slice(0, loopIndex);
  const secondPart = pattern.slice(loopIndex + 1);
  for (let i = 0; i < iterations; ++i) {
    rules.push(...firstPart);
  }
  rules.push(...original);
  for (let i = 0; i < iterations; ++i) {
    rules.push(...secondPart);
  }
  return rules;
}

function isValidMessage2(message: string, rules: Rules, loopDefinitions: LoopDefinitions): boolean {
  const ruleCopy = { ...rules };
  ruleCopy[8].rules = rules[8].rules.map(r => r.slice());
  ruleCopy[11].rules = rules[11].rules.map(r => r.slice());
  let i = 0;
  while (true) {
    const loopedRules = getLoopedRules(8, loopDefinitions, i);
    if (loopedRules.length > message.length) {
      return false;
    }
    ruleCopy[8].rules[0] = loopedRules;
    const match = getRuleMatch(message, ruleCopy, 8);
    if (match) {
      let j = 0;
      while (true) {
        const loopedRules2 = getLoopedRules(11, loopDefinitions, j);
        if (loopedRules.length + loopedRules2.length > message.length) {
          break;
        }
        ruleCopy[11].rules[0] = loopedRules2;
        const match2 = getRuleMatch(message.substring(match.length), ruleCopy, 11);
        if (match2 && match + match2 === message) {
          return true;
        }
        ++j;
      }
    }
    ++i;
  }
}

export function createHandler(output: OutputPublic) {
  return {
    runTest1(input: string[]) {
      output.system("Running test 1...");
      const { rules, messages } = parseInput(input);
      messages.forEach(message => {
        const isValid = isValidMessage(message, rules, 0);
        output.print(`${message}: ${isValid ? "valid" : "invalid"}`);
      });
      output.print();
    },
    runPuzzle1(input: string[]) {
      output.system("Running puzzle 1...");
      const { rules, messages } = parseInput(input);
      const count = messages.filter(message => isValidMessage(message, rules, 0)).length;
      output.print(`Number of valid messages for rule 0: ${count}`);
      output.print();
    },
    runTest2(input: string[]) {
      output.system("Running test 2...");
      const { rules, messages } = parseInput(input);
      messages.forEach(message => {
        const isValid = isValidMessage2(message, rules, LOOPS);
        output.print(`${message}: ${isValid ? "valid" : "invalid"}`);
      });
      output.print();
    },
    runPuzzle2(input: string[]) {
      output.system("Running puzzle 2...");
      const { rules, messages } = parseInput(input);
      const count = messages.filter(message => isValidMessage2(message, rules, LOOPS)).length;
      output.print(`Number of valid messages for rule 0: ${count}`);
      output.print();
    }
  };
}
