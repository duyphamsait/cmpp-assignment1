import { TokenType } from "./constants.js";
import { SyntaxError } from "./errors.js";
import { NumberNode, ListNode } from "./ast.js";

// The Parser checks if the token sequence follows the grammar rules.
export class Parser {
  constructor(tokens, debug = false) {
    this.tokens = tokens;
    this.index = 0;
    this.debug = debug;
  }

  log(msg) {
    if (this.debug) console.log(msg);
  }

  // get current token with index
  peek() {
    return this.tokens[this.index];
  }

  expectToken(type, message) {
    const token = this.peek();

    if (this.debug) 
      this.log(`check syntax: expect ${type}, got ${token.type} '${token.lexeme}' Position${token.pos}`);

    if (token.type !== type) {
      throw new SyntaxError(
        `${message}. Found ${token.type} '${token.lexeme}'`,
        token.pos
      );
    }
    this.index += 1;
    return token;
  }

  // Entry point
  parseList() {
    const listNode = this.parseListExpr();
    this.expectToken(TokenType.EOF, "Expected end of input");
    return listNode;
  }

  // check syntax
  parseListExpr() {
    // start with [
    this.expectToken(TokenType.LBRACK, "Expected '['");

    const elements = [];

    if (this.peek().type === TokenType.RBRACK) {
      // end parse sub list
      this.expectToken(TokenType.RBRACK, "Expected ']'");
      return new ListNode(elements);
    }

    // parse and check number, then instert to elements array
    elements.push(this.parseElement());

    while (this.peek().type === TokenType.COMMA) {
      this.expectToken(TokenType.COMMA, "Expected ','");
      elements.push(this.parseElement());
    }

        // end with ]
    this.expectToken(TokenType.RBRACK, "Expected ']'");
    return new ListNode(elements);
  }

  parseElement() {
    const token = this.peek();
    // parse and check number
    if (token.type === TokenType.NUMBER) {
      const t = this.expectToken(TokenType.NUMBER, "Expected integer");
      return new NumberNode(Number(t.lexeme));
    }

    // begin parse sublist
    if (token.type === TokenType.LBRACK) {
      return this.parseListExpr();
    }

    throw new SyntaxError("Expected an integer or '['", token.pos);
  }
}
