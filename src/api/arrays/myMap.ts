import "../../types/arrayMapInterface";

Array.prototype.myMap = function <T, U>(
  this: T[],
  callback: (currentValue: T, index: number, array: T[]) => U
): U[] {
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  const arr = this;
  const len = arr.length;
  const result: U[] = new Array(len);

  for (let i = 0; i < len; i++) {
    if (i in arr) {
      result[i] = callback(arr[i], i, arr);
    }
  }

  return result;
};

export {};

// console.log([1, 2, 3].myMap((x) => x * 2)); // ✅ [2, 4, 6]
// console.log([1, 2, 3].myMap((x) => String(x))); // ✅ ['1', '2', '3']
// console.log([].myMap((x) => x * 2)); // ✅ []
// console.log([1, , 3].myMap((x) => x * 2)); // ✅ [2, <empty>, 6] (sparse array)
// console.log([1, 2, 3].myMap(1 as any)); // ❌ throws TypeError (correct!)
