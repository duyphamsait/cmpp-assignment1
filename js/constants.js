// Define all token types used in the syntax.
// The language supports numbers and list delimiters.

export const TokenType = Object.freeze({
  NUMBER: "NUMBER", // Interger only
  LBRACK: "LBRACK", // [
  RBRACK: "RBRACK", // ]
  COMMA: "COMMA",   // ,
  LPAREN: "LPAREN",   // (
  RPAREN: "RPAREN",   // )
  SLASH: "SLASH",
  
  // Keywords
  COUNT: "COUNT",

  EOF: "EOF",       // end of line
});

export const DELIMITERS = Object.freeze({
  "[": TokenType.LBRACK,
  "]": TokenType.RBRACK,
  ",": TokenType.COMMA,
  "(": TokenType.LPAREN,
  ")": TokenType.RPAREN,
  "/": TokenType.SLASH,
});

export const KEYWORDS = Object.freeze({
  count: TokenType.COUNT,
});
