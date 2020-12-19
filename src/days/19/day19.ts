import { OutputPublic } from "@/functions/output";

interface Rule {
  char?: string;
  rules?: number[][];
}

interface Rules {
  [K: number]: Rule;
}

interface ParsedInput {
  rules: Rules;
  messages: string[];
}

function parseRules(input: string[]): Rules {
  const rules: Rules = {};
  input.forEach(line => {
    const rule: Rule = {};
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
    } else if (rule.rules) {
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
    }
  };
}
