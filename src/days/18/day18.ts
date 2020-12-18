import { OutputPublic } from "@/functions/output";

const OPERATORS = ["+", "*"];

function parseToRPN(expression: string): string[] {
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

export function createHandler(output: OutputPublic) {
  return {
    runTest1(input: string[]) {
      output.system("Running test 1...");
      input.forEach((expression, i) => {
        try {
          output.print(`[Example #${i + 1}] RPN: `, true);
          const rpn = parseToRPN(expression);
          output.print(`${rpn.join(" ")} = `, true);
          output.print(evaluateRPN(rpn).toString());
        } catch (err) {
          output.error(err.message);
        }
      });
      output.print();
    },
    runPuzzle1(input: string[]) {
      output.system("Running puzzle 1...");
      let result = 0;
      try {
        input.forEach(expression => {
          const rpn = parseToRPN(expression);
          result += evaluateRPN(rpn);
        });
        output.print(`Result: ${result}`);
      } catch (err) {
        output.error(err.message);
      }
      output.print();
    }
  };
}
