// Define all token types used in the syntax.
// The language supports numbers and list delimiters.

export const TokenType = Object.freeze({
  NUMBER: "NUMBER", // number
  COMMA: "COMMA",   // ,
  LPAREN: "LPAREN",   // (
  RPAREN: "RPAREN",   // )
  SLASH: "SLASH",
  
  EOF: "EOF",       // end of line
});

export const DELIMITERS = Object.freeze({
  ",": TokenType.COMMA,
  "(": TokenType.LPAREN,
  ")": TokenType.RPAREN,
  "/": TokenType.SLASH,
});

export const KEYWORDS = Object.freeze({
  count: TokenType.COUNT,
});
