import { Lexer } from "./lexer.js";
import { Parser } from "./parser.js";
import { NumberNode, ListNode, DivisionNode } from "./ast.js";
import { SemanticError } from "./errors.js";

function formatError(e) {
  if (e && e.pos !== undefined) return `${e.name}: ${e.message} (pos ${e.pos})`;
  return `${e?.name ?? "Error"}: ${e?.message ?? String(e)}`;
}

// Use recursion to scan the AST. Get numbers from the AST.
function evaluateAST(node) {
if (node instanceof NumberNode) {
    return node.value;
  }

  if (node instanceof ListNode) {
    const result = [];
    for (let i = 0; i < node.elements.length; i++) {
      result.push(evaluateAST(node.elements[i]));
    }
    return result;
  }

  if (node instanceof DivisionNode) {
    return { left: node.left, right: node.right };
  }
  return node;
}

// NOTE: getSize, getSum and calculateAverage functions follow the pseudocode
// Size(given_numbers)
function getSize(nums) {
  let count = 0;
  for (const _ of nums) count += 1;
  return count;
}

// Sum(given_numbers)
function getSum(nums) {
  let sum = 0;
  for (const n of nums) sum += n;
  return sum;
}

// Average_Calculator(given_numbers)
function calculateAverage(leftNumbers, rightNumber) {
  const size = getSize(leftNumbers);

  if (size === 0) throw new SemanticError("List must not be empty.");
  if (size !== rightNumber)
    throw new SemanticError(`Denominator must equal the number of elements (${size})`);

  const sum = getSum(leftNumbers);
  return sum / size;
}

document.getElementById("runBtn").addEventListener("click", () => {
  const outputBox = document.getElementById("output");
  const code = document.getElementById("code").value.trim();

  try {

    const DEBUG = true;

    const tokens = new Lexer(code, DEBUG).getAllTokens();
    const ast = new Parser(tokens, DEBUG).parseList();

    const leftNumbers = evaluateAST(ast.left);        
    const rightValue  = evaluateAST(ast.right);

    const avg = calculateAverage(leftNumbers, rightValue);

    outputBox.textContent = `Input: ${code}\nResult: ${avg}`;

  } catch (e) {
    outputBox.textContent = formatError(e);
  }
});
