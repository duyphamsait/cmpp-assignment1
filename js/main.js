import { Lexer } from "./lexer.js";
import { Parser } from "./parser.js";
import { NumberNode, ListNode, DivisionNode, CountNode } from "./ast.js";
import { SemanticError } from "./errors.js";

function formatError(e) {
  if (e && e.pos !== undefined) return `${e.name}: ${e.message} (pos ${e.pos})`;
  return `${e?.name ?? "Error"}: ${e?.message ?? String(e)}`;
}

// Use recursion to scan the AST. Get integers from the AST.
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

  // right number
  if (node instanceof CountNode) {
    const list = evaluateAST(node.list);
    return getSize(list);
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
function calculateAverage(nums) {
  const size = getSize(nums);
  if (size === 0) throw new Error("List must not be empty.");
  const sum = getSum(nums);
  return sum / size;
}

function isListsEqual(listA, listB) {
  if (listA.length !== listB.length) {
    return false;
  }

  for (let i = 0; i < listA.length; i++) {
    if (listA[i] !== listB[i]) {
      return false;
    }
  }

  return true;
}

document.getElementById("runBtn").addEventListener("click", () => {
  const outputBox = document.getElementById("output");
  const code = document.getElementById("code").value.trim();

  try {

    const DEBUG = true;

    const tokens = new Lexer(code, DEBUG).getAllTokens();
    const ast = new Parser(tokens, DEBUG).parseList();

    const leftNumbers = evaluateAST(ast.left);        
    const rightNumbers = evaluateAST(ast.right.list); 

    if (!isListsEqual(leftNumbers, rightNumbers)) {
        throw new SemanticError("The list provided in count() must match the source list on the left.)");
        
    }

    const avg = calculateAverage(leftNumbers);

    outputBox.textContent = `Input: ${code}\nResult: ${avg}`;

    // outputBox.textContent =
    //   `Input: ${code}\n` +
    // //   `Size: ${getSize(nums)}\n` +
    // //   `Sum: ${getSum(nums)}\n` +
    //   `Average: ${avg}`;
  } catch (e) {
    outputBox.textContent = formatError(e);
  }
});
