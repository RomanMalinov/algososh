
type TLinkedList<T> = {
  append: (element: T) => void;
  prepend: (element: T) => void;
  addByIndex: (element: T, index: number) => void;
  toArray: () => Node<T>[]
  deleteHead: () => void;
  deleteTail: () => void;
  delByIndex: (index: number) => void;
};

class Node<T> {
  value: T
  next: Node<T> | null
  constructor(value: T, next?: Node<T> | null) {
    this.value = value;
    this.next = (next === undefined ? null : next);
  }
};

export class LinkedList<T> implements TLinkedList<T> {
  private head: Node<T> | null;
  private tail: Node<T> | null;
  private size: number;
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  };

  prepend(element: T) {
    const node = new Node(element);
    if (this.head === null || this.tail === null) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
    this.size++;
  };

  append(element: T) {
    let node = new Node(element);
    if (this.head === null) {
      this.head = node;
      this.tail = node;
    } else {
      node.next = this.head;
      this.head = node;
    }
    this.size++;
  };

  addByIndex(element: T, index: number) {
    if (index < 0 || index > this.size) {
      return;
    }
    if (index === 0) {
      this.prepend(element);
    } else if (index === this.size) {
      this.append(element);
    } else {
      const node = new Node(element);
      let curr = this.head;
      let prev = null;
      let currIndex = 0;
      while (currIndex < index && curr !== null) {
        prev = curr;
        curr = curr.next;
        currIndex++;
      }
      if (prev !== null) {
        prev.next = node;
      }
      node.next = curr;
      this.size++;
    }
  };


  deleteHead() {
    if (this.head === null || this.tail === null) {
      return;
    } else {
      if (this.head === this.tail) {
        this.head = null;
        this.tail = null;
      } else {
        this.head = this.head.next;
      }
    }
    this.size--;
  };

  deleteTail() {
    if (this.head === null || this.tail === null) {
      return;
    } else {
      if (this.head === this.tail) {
        this.head = null;
        this.tail = null;
      } else {
        let curr = this.head;
        let prev = this.head;
        while (curr !== null && curr.next != null) {
          prev = curr;
          curr = curr.next;
        }
        this.tail = prev;
        this.tail.next = null;
      }
    }
    this.size--;
  };

  delByIndex(index: number) {
    if (index < 0 || index > this.size) {
      return;
    } else {
      if (index === 0) {
        this.deleteHead();
      } else if (index === this.size - 1) {
        this.deleteTail();
      } else {
        let curr = this.head;
        let prev = null;
        let currIndex = 0;
        while (currIndex < index && curr != null) {
          prev = curr;
          curr = curr.next;
          currIndex++;
        }
        if (prev != null && curr != null) {
          prev.next = curr.next;
        }
      }
    }
    this.size--;
  };

  toArray() {
    const elements = [];
    let curr = this.head;
    while (curr) {
      elements.push(curr);
      curr = curr.next;
    }
    return elements;
  };

  getLength() {
    return this.size;
  };

  toString() {
    let curr = this.head;
    let res = '';
    while (curr) {
      res += `${curr.value} `;
      curr = curr.next;
    }
    return res;
  };
};
