import { Lexer } from "./lexer.js";
import { Parser } from "./parser.js";
import { NumberNode, ListNode } from "./ast.js";

function formatError(e) {
  if (e && e.pos !== undefined) return `${e.name}: ${e.message} (pos ${e.pos})`;
  return `${e?.name ?? "Error"}: ${e?.message ?? String(e)}`;
}

// get integers from the AST.
function collectIntegers(node) {
  if (node instanceof NumberNode) return [node.value];

  if (node instanceof ListNode) {
    const all = [];
    for (const child of node.elements) {
      all.push(...collectIntegers(child));
    }
    return all;
  }

  throw new Error("Input must contain integers only.");
}

/*
  getSize, getSum and calculateAverage functions follow the pseudocode
*/

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

document.getElementById("runBtn").addEventListener("click", () => {
  const outputBox = document.getElementById("output");
  const code = document.getElementById("code").value.trim();

  try {

    const DEBUG = true;

    const tokens = new Lexer(code, DEBUG).getAllTokens();
    const expr = new Parser(tokens, DEBUG).parseList();

    const nums = collectIntegers(expr);
    const avg = calculateAverage(nums);

    outputBox.textContent =
      `Input: ${code}\n` +
      `Size: ${getSize(nums)}\n` +
      `Sum: ${getSum(nums)}\n` +
      `Average: ${avg}`;
  } catch (e) {
    outputBox.textContent = formatError(e);
  }
});
