declare global {
  interface Array<T> {
    myReduce<U>(
      callback: (
        accumulator: U,
        currentValue: T,
        index: number,
        array: T[]
      ) => U,
      initialValue: U
    ): U;
    myReduce(
      callback: (
        accumulator: T,
        currentValue: T,
        index: number,
        array: T[]
      ) => T
    ): T;
  }
}

export {};
