type TStack<T> = {
  push: (item: T) => void;
  pop: () => void;
  clear: () => void;
  peak: () => T | null;
  getElements: () => T[];
  head: (element: T) => boolean; 
};

export class Stack<T> implements TStack<T> {
  private container: T[] = [];

  push = (element: T): void => {
    this.container.push(element);
  }

  pop = (): void => {
    if (this.container.length !== 0) {
      this.container.pop();
    }
  }

  clear = (): void => {
    this.container = [];
  }

  peak = (): T => {
    return this.container[this.container.length - 1];
  }

  getElements = () => this.container;

  head = (element: T): boolean => {
    return element === this.peak();
  }
}
