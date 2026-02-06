import { TokenType } from "./constants.js";
import { DELIMITERS } from "./constants.js";
import { SyntaxError } from "./errors.js";
import { NumberNode, ListNode, CountNode, DivisionNode } from "./ast.js";

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
    // Parse the primary list (Dividend). Like parsing [2,3,4]
    const leftList = this.parseListExpr();

    // Expect the division operator '/'
    this.expectToken(TokenType.SLASH, "Expected '/'");

    // Expect 'count' keyword
    this.expectToken(TokenType.COUNT, "Expected 'count'");

    // Expect opening parenthesis '('
    this.expectToken(TokenType.LPAREN, "Expected '('");

    // Parse the list inside count function (Divisor).Like parsing [2,3,4]
    const countList = this.parseListExpr();
    
    // Expect closing parenthesis ')'
    this.expectToken(TokenType.RPAREN, "Expected ')'");

    // CountNode for the AST
    const rightList = new CountNode(countList);

    // Create AST tree
    return new DivisionNode(leftList, rightList);
  }
  
  // check syntax [2,3,4]
  parseListExpr() {
    // Start parsing with the opening bracket '['
    this.expectToken(TokenType.LBRACK, "Expected '['");

    const elements = [];

    // Handle empty list: []
    if (this.peek().type === TokenType.RBRACK) {
      this.expectToken(TokenType.RBRACK, "Expected ']'");
      return new ListNode(elements);
    }

    // Parse element and add it to the elements
    elements.push(this.parseElement());

    // Continue parsing when meeting commas ','
    while (this.peek().type === TokenType.COMMA) {
      this.expectToken(TokenType.COMMA, "Expected ','");
      elements.push(this.parseElement());
    }

    // Complete parsing with the closing bracket ']'
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
