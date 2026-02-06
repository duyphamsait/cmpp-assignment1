# Average Calculator -- Lexical Analyzer and Parser

## 1. Project Overview

This project implements a simple language processor that reads a list of
integers and computes:

-   Size of the list
-   Sum of all integers
-   Average value

The implementation follows a compiler-like structure:

Input → Lexical Analysis → Parsing → (AST) → Semantic Evaluation →
Output

------------------------------------------------------------------------

## 2. System Design

### 2.1 Lexical Analysis

The Lexer reads the input character by character and converts it into
tokens.

Supported token types:

-   NUMBER
-   LBRACK (`[`)
-   RBRACK (`]`)
-   COMMA (`,`)
-   EOF

The lexical analyzer: - Groups digits into integers - Ignores
whitespace - Detects invalid characters - Rejects floating-point values
(only integers are allowed)

### 2.2 Parsing (Recursive Descent Parser)

Grammar:

    List     → '[' Elements ']'
    Elements → Element (',' Element)*
    Element  → NUMBER | List

The parser validates the structure and reports syntax errors with
position information.

### 2.3 Abstract Syntax Tree (AST)

The program constructs an Abstract Syntax Tree (AST) using:

-   NumberNode
-   ListNode

The AST represents the hierarchical structure of the input list.

### 2.4 Semantic Evaluation

After parsing:

-   All integers are collected
-   The list is validated (must not be empty)
-   Size, sum, and average are calculated

------------------------------------------------------------------------

## 3. Debug Logs (Lexer / Parser Trace)

The project includes a debug mode that allows users to observe internal
processing steps.

When debug mode is enabled, the following logs are displayed in the
console:

### Example Input

    [5, 8, 12, 4, 10]

### Example Output Logs

    Lexical -> [ | 5 | , | 8 | , | 1 2 | , | 4 | , | 1 0 | ]
    Group   -> [ | 5 | , | 8 | , | 12 | , | 4 | , | 10 | ]
    Token   -> LBRACK NUMBER COMMA NUMBER COMMA NUMBER COMMA NUMBER COMMA NUMBER RBRACK

    parser.js:14 check syntax: expect LBRACK, got LBRACK '[' Position0
    parser.js:14 check syntax: expect NUMBER, got NUMBER '5' Position1
    parser.js:14 check syntax: expect COMMA, got COMMA ',' Position2
    ...

### Log Description

-   **Lexical**: Shows raw characters read by the lexer.
-   **Group**: Shows digits grouped into complete integers.
-   **Token**: Shows the final token sequence passed to the parser.
-   **check syntax**: Shows parser expectations and token validation
    steps.

Debug mode can be enabled as follows:

``` javascript
const DEBUG = true;
const tokens = new Lexer(code, DEBUG).getAllTokens();
const result = new Parser(tokens, DEBUG).parseList();
```

Logs are printed in the browser console.

------------------------------------------------------------------------

## 4. Error Handling

The program handles:

-   Invalid characters
-   Floating-point numbers
-   Missing brackets
-   Incorrect comma placement
-   Empty list (semantic error)

------------------------------------------------------------------------

## 5. References

1.  GeeksforGeeks. Introduction to Lexical Analysis.\
    https://www.geeksforgeeks.org/compiler-design/introduction-of-lexical-analysis/

2.  University of Toronto. Parsing -- Recursive Descent Parser Notes.\
    https://www.cs.utoronto.ca/\~trebla/CSCC24-latest/08-parsing.html

3.  McGill University. Abstract Syntax Trees (AST) -- CS520 Slides.\
    https://www.cs.mcgill.ca/\~cs520/2021/slides/7-ast.pdf
