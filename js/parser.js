import { TokenType } from "./constants.js";
import { DELIMITERS } from "./constants.js";
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
    // const listNode = this.parseListExpr();
    const listNode = this.parseListDivideByCount();
    this.expectToken(TokenType.EOF, "Expected end of input");
    return listNode;
  }

  // check syntax [2,3,4]/count(2,3,4)
  parseListDivideByCount() {
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

    // check division operator
    this.expectToken(TokenType.SLASH, "Expected '/'");

    // check keyword count
    this.expectToken(TokenType.COUNT, "Expected 'count'");
  
    // start with (
    this.expectToken(TokenType.LPAREN, "Expected '('");

    // parse and check number, then instert to elements array
    elements.push(this.parseElement());

    while (this.peek().type === TokenType.COMMA) {
      this.expectToken(TokenType.COMMA, "Expected ','");
      elements.push(this.parseElement());
    }

    // end with )
    this.expectToken(TokenType.RPAREN, "Expected ')'");

    return new ListNode(elements);
  }
  
  // check syntax [2,3,4]
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
