declare global {
  interface Array<T> {
    myMap<U>(callback: (currentValue: T, index: number, array: T[]) => U): U[];
  }
}

export {};
