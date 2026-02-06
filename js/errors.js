// SemanticError
export class SemanticError extends Error {
  constructor(message, pos) {
    super(message);
    this.name = "Semantic Error";
    this.pos = pos;
  }
}

// Syntax
export class SyntaxError extends Error {
  constructor(message, pos) {
    super(message);
    this.name = "Syntax Error";
    this.pos = pos;
  }
}
