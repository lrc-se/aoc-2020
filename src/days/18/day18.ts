import { OutputPublic } from "@/functions/output";

const OPERATORS = ["+", "*"];

interface OperatorPrecedence {
  [K: string]: number;
}

function parseToRPN(expression: string, operatorPrecedence: OperatorPrecedence | null = null): string[] {
  const output: string[] = [];
  const operators: string[] = [];
  const tokens = expression.replace(/((?<![\d)])-\d+|[^\s\d])/g, " $1 ").trim().split(/\s+/);
  let token;
  while ((token = tokens.shift())) {
    if (!isNaN(+token)) {
      output.push(token);
    } else if (OPERATORS.includes(token)) {
      while (operators.length) {
        const operator = operators[operators.length - 1];
        if (operator == "(") {
          break;
        }
        if (operatorPrecedence) {
          const stackPrecedence = operatorPrecedence[operator] || 0;
          const tokenPrecedence = operatorPrecedence[token] || 0;
          if (stackPrecedence < tokenPrecedence) {
            break;
          }
        }
        output.push(operator);
        operators.pop();
      }
      operators.push(token);
    } else if (token == "(") {
      operators.push(token);
    } else if (token == ")") {
      while (true) {
        const operator = operators.pop();
        if (!operator) {
          throw SyntaxError("Mismatched parentheses");
        } else if (operator == "(") {
          break;
        }
        output.push(operator);
      }
    } else {
      throw SyntaxError(`Invalid token: ${token}`);
    }
  }

  let operator;
  while ((operator = operators.pop())) {
    if (operator == "(" || operator == ")") {
      throw SyntaxError("Mismatched parentheses");
    }
    output.push(operator);
  }

  return output;
}

function evaluateRPN(tokens: string[]): number {
  const stack: number[] = [];
  tokens.forEach(token => {
    let value: number;
    if (OPERATORS.includes(token)) {
      const operand1 = stack.pop();
      const operand2 = stack.pop();
      if (typeof operand1 == "undefined" || typeof operand2 == "undefined") {
        throw SyntaxError("Invalid expression");
      }
      switch (token) {
        case "+":
          value = operand1 + operand2;
          break;
        case "*":
          value = operand1 * operand2;
          break;
        default:
          throw SyntaxError(`Invalid operator: ${token}`);
      }
    } else {
      value = +token;
      if (isNaN(value)) {
        throw SyntaxError(`Invalid value: ${token}`);
      }
    }
    stack.push(value);
  });

  if (stack.length != 1) {
    throw SyntaxError("Invalid expression");
  }
  return stack[0];
}

function runTest(input: string[], operatorPrecedence: OperatorPrecedence | null, output: OutputPublic) {
  input.forEach((expression, i) => {
    try {
      output.print(`[Example #${i + 1}] RPN: `, true);
      const rpn = parseToRPN(expression, operatorPrecedence);
      output.print(`${rpn.join(" ")} = `, true);
      output.print(evaluateRPN(rpn).toString());
    } catch (err) {
      output.error(err.message);
    }
  });
  output.print();
}

function runPuzzle(input: string[], operatorPrecedence: OperatorPrecedence | null, output: OutputPublic) {
  let result = 0;
  try {
    input.forEach(expression => {
      const rpn = parseToRPN(expression, operatorPrecedence);
      result += evaluateRPN(rpn);
    });
    output.print(`Result: ${result}`);
  } catch (err) {
    output.error(err.message);
  }
  output.print();
}

export function createHandler(output: OutputPublic) {
  return {
    runTest1(input: string[]) {
      output.system("Running test 1...");
      runTest(input, null, output);
    },
    runPuzzle1(input: string[]) {
      output.system("Running puzzle 1...");
      runPuzzle(input, null, output);
    },
    runTest2(input: string[]) {
      output.system("Running test 2...");
      runTest(input, { "+": 2, "*": 1 }, output);
    },
    runPuzzle2(input: string[]) {
      output.system("Running puzzle 2...");
      runPuzzle(input, { "+": 2, "*": 1 }, output);
    }
  };
}
