# Average Calculator -- Lexical Analyzer and Parser

## 1. Project Overview

This project implements a small language processor that evaluates
expressions of the form:

    [1,2,3] / count(1,2,3)

The program computes:

-   Size of the list
-   Sum of all integers
-   Average value

The implementation follows a compiler-style architecture:

Input → Lexical Analysis → Parsing → AST Construction → Semantic
Analysis → Evaluation → Output

------------------------------------------------------------------------

## 2. Language Grammar

The supported grammar is:

    Expr      → ListExpr "/" "count" "(" ListItems? ")"
    ListExpr  → "[" ListItems? "]"
    ListItems → Element ("," Element)*
    Element   → NUMBER | ListExpr

Example valid input:

    [5,10,15] / count([5,10,15])

------------------------------------------------------------------------

## 3. System Design

### 3.1 Lexical Analysis

The Lexer reads the input character-by-character and converts it into
tokens.

Supported token types:

-   NUMBER
-   LBRACK (`[`)
-   RBRACK (`]`)
-   COMMA (`,`)
-   SLASH (`/`)
-   LPAREN (`(`)
-   RPAREN (`)`)
-   COUNT (keyword)
-   EOF

The lexical analyzer:

-   Groups digits into integers
-   Ignores whitespace
-   Detects invalid characters
-   Rejects floating-point numbers (only integers allowed)

------------------------------------------------------------------------

### 3.2 Parsing (Recursive Descent Parser)

The parser is implemented using recursive descent.

It:

-   Validates syntax
-   Reports syntax errors with position information
-   Builds an Abstract Syntax Tree (AST)
-   Uses recursion to traverse the AST

------------------------------------------------------------------------

### 3.3 Abstract Syntax Tree (AST)

The program constructs an AST using:

-   `NumberNode`
-   `ListNode`
-   `DivideByCountNode`

The AST clearly separates:

-   The left list (`[ ... ]`)
-   The list inside `count(...)`

This ensures correct semantic validation and evaluation.

------------------------------------------------------------------------

### 3.4 Semantic Analysis

After parsing:

1.  All integers from both lists are collected using recursion.
2.  The program verifies that:
    -   The list is not empty.
    -   The list inside `count(...)` matches the left list.
3.  If validation passes:
    -   Size is computed.
    -   Sum is computed.
    -   Average = Sum / Size.

------------------------------------------------------------------------

## 4. Debug Mode

Debug mode prints internal processing steps in the browser console.

Example logs:

    Lexical -> [ | 5 | , | 1 0 | , | 1 5 | ] | / | c o u n t | ( | [ | 5 | , | 1 0 | , | 1 5 | ] | )
    Group   -> [ | 5 | , | 10 | , | 15 | ] | / | count | ( | [ | 5 | , | 10 | , | 15 | ] | )
    Token   -> LBRACK NUMBER COMMA NUMBER COMMA NUMBER RBRACK SLASH COUNT LPAREN LBRACK NUMBER COMMA NUMBER COMMA NUMBER RBRACK RPAREN

    check syntax: expect LBRACK, got LBRACK '[' Position0
    ...

To enable debug mode:

``` javascript
const DEBUG = true;
const tokens = new Lexer(code, DEBUG).getAllTokens();
const result = new Parser(tokens, DEBUG).parse();
```

------------------------------------------------------------------------

## 5. Error Handling

The program handles:

Lexical Errors: invalid characters, unknown identifiers, floating-point numbers.

Syntax Errors: missing brackets, missing parentheses, incorrect commas, invalid token order, missing count keyword.

Semantic Errors: empty list, mismatch between the left list and count(...).

------------------------------------------------------------------------

## 6. References

1.  GeeksforGeeks. Introduction to Lexical Analysis.\
    https://www.geeksforgeeks.org/compiler-design/introduction-of-lexical-analysis/

2.  University of Toronto. Parsing -- Recursive Descent Parser Notes.\
    https://www.cs.utoronto.ca/\~trebla/CSCC24-latest/08-parsing.html

3.  McGill University. Abstract Syntax Trees (AST) -- CS520 Slides.\
    https://www.cs.mcgill.ca/\~cs520/2021/slides/7-ast.pdf
