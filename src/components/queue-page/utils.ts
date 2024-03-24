type TQueue<T> = {
  enqueue: (item: T) => void;
  dequeue: () => void;
  clear: () => void;
  peak: () => T | null;
  getElements: () => Array<T | null>;
  isEmpty: () => boolean;
  getHead: () => number;
  getTail: () => number;
};

export class Queue<T> implements TQueue<T> {
  private container: (T | null)[] = [];
  private head = 0;
  private tail = 0;
  private readonly size: number = 0;
  private length: number = 0;

  constructor(size: number) {
    this.size = size;
    this.container = Array(size);
  }

  enqueue = (item: T) => {
    if (this.length >= this.size) {
      throw new Error("Превышена максимальная длина очереди");
    } else {
      this.container[this.tail % this.size] = item;
      this.tail++;
      this.length++;
    }
  }

  dequeue = () => {
    if (this.isEmpty()) {
      throw new Error("Очередь пустая");
    } else {
      this.container[this.head % this.size] = null;
      this.length--;
      this.head++;
    }
  };

  getElements = () => this.container.filter(element => element !== null);

  getTail = () => this.tail

  getHead = () => this.head

  peak = (): T | null => {
    if (this.isEmpty()) {
      throw new Error("Очередь пустая");
    }
    return this.container[this.head % this.size]
  };

  clear = () => {
    this.length = 0
    this.head = 0;
    this.tail = 0;
  }
  isEmpty = () => this.length === 0;
}
