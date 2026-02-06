// Define all token types used in the syntax.
// The language supports numbers and list delimiters.

export const TokenType = Object.freeze({
  NUMBER: "NUMBER", // Interger only
  LBRACK: "LBRACK", // [
  RBRACK: "RBRACK", // ]
  COMMA: "COMMA",   // ,
  EOF: "EOF",       // end of line
});

export const DELIMITERS = Object.freeze({
  "[": TokenType.LBRACK,
  "]": TokenType.RBRACK,
  ",": TokenType.COMMA,
});
