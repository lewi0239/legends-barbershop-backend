import "../../types/arrayReducerInterface.js";

Array.prototype.myReduce = function <T, U>(
  this: T[],
  callback: (
    accumulator: U | T,
    currentValue: T,
    index: number,
    array: T[]
  ) => U | T,
  initialValue?: U
): U | T {
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  const arr = this;

  const len = arr.length;

  const hasInitialValue = arguments.length > 1;
  let accumulator: any = hasInitialValue ? initialValue : undefined;
  let startIndex = 0;

  if (!hasInitialValue) {
    while (startIndex < len && !(startIndex in arr)) {
      startIndex++;
    }

    if (startIndex >= len) {
      throw new TypeError("Reduce of empty array with no initial value");
    }

    accumulator = arr[startIndex++];
  }

  for (let i = startIndex; i < len; i++) {
    if (i in arr) {
      accumulator = callback(accumulator, arr[i], i, arr);
    }
  }

  return accumulator;
};

export {};

//Tests:
// console.log([1, 2, 3].myReduce((a, b) => a + b, 0)); // ✅ 6
// console.log([1, 2, 3].myReduce((a, b) => a + b, 4)); // ✅ 10
// console.log([1].myReduce((a, b) => a + b)); // ✅ 1
// console.log([].myReduce((a, b) => a + b, 5)); // ✅ 5
// console.log([].myReduce((a, b) => a + b)); // ❌ throws (correct!)
