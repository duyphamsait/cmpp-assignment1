/*
  This lexer implementation is based on concepts from:
  - GeeksforGeeks: Introduction to Lexical Analysis
  - CSCC24 Recursive Descent Parsing (University of Toronto)
*/

import { Token } from "./token.js";
import { TokenType, DELIMITERS } from "./constants.js";
import { SemanticError } from "./errors.js";

// The Lexer reads each character from input string and groups them into token.

export class Lexer {
  constructor(sourceText,  debug = false) {
    this.sourceText = sourceText;
    this.position = 0;
    this.debug = debug;

    this.lexicalCharacterArray = [];
    this.lexicalGroupArray = [];
  }

  log(msg) {
    if (this.debug) console.log(msg);
  }

  isDigit(ch) {
    return ch >= "0" && ch <= "9";
  }

  isSpace(ch) {
    return ch === " " || ch === "\t" || ch === "\n" || ch === "\r";
  }

  currentCharacter() {
    if (this.position >= this.sourceText.length) return "\0";
    return this.sourceText[this.position];
  }

  nextCharacter() {
    const ch = this.currentCharacter();
    this.position += 1;
    return ch;
  }

  skipSpaces() {
    while (this.isSpace(this.currentCharacter())) {
      this.nextCharacter();
    }
  }

  // Only integers are allowed (no float values).
  readInteger(startIndex) {
    let text = "";
    let digitCount = 0;

    const digitsArray = [];

    while (this.isDigit(this.currentCharacter())) {

      const digit = this.nextCharacter();
      digitsArray.push(digit);
      text += digit;
      digitCount += 1;
    }

    if (digitCount === 0) {
      throw new SemanticError("Invalid integer format", startIndex);
    }

    let tokenArray = new Token(TokenType.NUMBER, text, startIndex);

    if (this.debug) {
        this.lexicalCharacterArray.push(digitsArray.join(" "));
        this.lexicalGroupArray.push(text);
    }

    return tokenArray;
  }

  // Get the next token from the input.
  getNextToken() {
    this.skipSpaces();

    const startIndex = this.position;
    const ch = this.currentCharacter();

    if (ch === "\0") return new Token(TokenType.EOF, "", this.position);

    // delimiters: [ ] ,
    if (DELIMITERS[ch] !== undefined) {
      this.nextCharacter();

      if (this.debug) {
        this.lexicalCharacterArray.push(ch);
        this.lexicalGroupArray.push(ch);
      }
      
      return new Token(DELIMITERS[ch], ch, startIndex);
    }

    // number (integer only)
    if (ch >= "0" && ch <= "9") {
      return this.readInteger(startIndex);
    }

    // reject float dot explicitly (nice message)
    if (ch === ".") {
      throw new SemanticError("Float is not allowed (integer only)", startIndex);
    }

    throw new SemanticError(`Unexpected character '${ch}'`, startIndex);
  }

  // Convert entire input into a list of tokens.
  getAllTokens() {
    const tokens = [];
    while (true) {
      const tok = this.getNextToken();
      tokens.push(tok);
      if (tok.type === TokenType.EOF) break;
    }

    if (this.debug) {
      let tokenStr = "Token   -> ";

      for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].type !== TokenType.EOF) {
          tokenStr += tokens[i].type + " ";
        }
      }

      this.log(`Lexical -> ${this.lexicalCharacterArray.join(" | ")}`);
      this.log(`Group   -> ${this.lexicalGroupArray.join(" | ")}`);
      this.log(tokenStr);
    }

    return tokens;
  }
}
