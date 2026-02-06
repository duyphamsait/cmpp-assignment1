// NumberNode represents a single integer value in the list.
export class NumberNode {
  constructor(value) {
    this.value = value;
  }
}

// ListNode represents a list of numbers.
export class ListNode {
  constructor(elements) {
    this.elements = elements;
  }
}

export class CountNode {
  constructor(list) {
    this.list = list; 
  }
}

export class DivisionNode {
  constructor(left, right) {
    this.left = left; 
    this.right = right; 
  }
}