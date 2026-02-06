export class Token {
  constructor(type, lexeme, pos) {
    this.type = type;
    this.lexeme = lexeme;
    this.pos = pos;
  }

  toString() {
    return `Token(${this.type}, '${this.lexeme}', pos=${this.pos})`;
  }
}
