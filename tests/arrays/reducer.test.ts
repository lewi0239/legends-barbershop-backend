import "../../src/api/arrays/reducer";

describe("Array.prototype.myReduce", () => {
  describe("Basic functionality with initial value", () => {
    it("should sum an array of numbers with initial value 0", () => {
      const result = [1, 2, 3].myReduce((acc, val) => acc + val, 0);
      expect(result).toBe(6);
    });

    it("should sum an array of numbers with initial value 4", () => {
      const result = [1, 2, 3].myReduce((acc, val) => acc + val, 4);
      expect(result).toBe(10);
    });

    it("should concatenate strings with initial value", () => {
      const result = ["a", "b", "c"].myReduce((acc, val) => acc + val, "");
      expect(result).toBe("abc");
    });

    it("should build an object from array with initial value", () => {
      const result = [
        { key: "a", value: 1 },
        { key: "b", value: 2 },
      ].myReduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {} as Record<string, number>);
      expect(result).toEqual({ a: 1, b: 2 });
    });

    it("should return initial value for empty array", () => {
      const result = [].myReduce((acc, val) => acc + val, 5);
      expect(result).toBe(5);
    });

    it("should work with complex accumulator types", () => {
      const numbers = [1, 2, 3, 4];
      const result = numbers.myReduce(
        (acc, val) => {
          acc.sum += val;
          acc.count++;
          return acc;
        },
        { sum: 0, count: 0 }
      );
      expect(result).toEqual({ sum: 10, count: 4 });
    });
  });

  describe("Basic functionality without initial value", () => {
    it("should sum an array of numbers without initial value", () => {
      const result = [1, 2, 3].myReduce((acc, val) => acc + val);
      expect(result).toBe(6);
    });

    it("should return single element for single-element array", () => {
      const result = [1].myReduce((acc, val) => acc + val);
      expect(result).toBe(1);
    });

    it("should use first element as accumulator", () => {
      const result = [5, 10, 15].myReduce((acc, val) => acc - val);
      expect(result).toBe(-20); // 5 - 10 - 15 = -20
    });

    it("should concatenate strings without initial value", () => {
      const result = ["hello", " ", "world"].myReduce((acc, val) => acc + val);
      expect(result).toBe("hello world");
    });
  });

  describe("Callback parameters", () => {
    it("should pass correct parameters to callback", () => {
      const arr = [10, 20, 30];
      const params: any[] = [];

      arr.myReduce((acc, currentValue, index, array) => {
        params.push({ acc, currentValue, index, array });
        return acc + currentValue;
      }, 0);

      expect(params).toEqual([
        { acc: 0, currentValue: 10, index: 0, array: arr },
        { acc: 10, currentValue: 20, index: 1, array: arr },
        { acc: 30, currentValue: 30, index: 2, array: arr },
      ]);
    });

    it("should pass correct parameters when no initial value", () => {
      const arr = [10, 20, 30];
      const params: any[] = [];

      arr.myReduce((acc, currentValue, index, array) => {
        params.push({ acc, currentValue, index, array });
        return acc + currentValue;
      });

      expect(params).toEqual([
        { acc: 10, currentValue: 20, index: 1, array: arr },
        { acc: 30, currentValue: 30, index: 2, array: arr },
      ]);
    });
  });

  describe("Sparse arrays", () => {
    it("should skip holes in sparse arrays with initial value", () => {
      const sparseArray = [1, , 3, , 5] as number[]; // has holes at index 1 and 3
      const result = sparseArray.myReduce((acc, val) => acc + val, 0);
      expect(result).toBe(9); // 1 + 3 + 5 = 9
    });

    it("should skip holes in sparse arrays without initial value", () => {
      const sparseArray = [1, , 3, , 5] as number[]; // has holes at index 1 and 3
      const result = sparseArray.myReduce((acc, val) => acc + val);
      expect(result).toBe(9); // 1 + 3 + 5 = 9
    });

    it("should handle sparse array where first elements are holes", () => {
      const sparseArray: number[] = [];
      sparseArray[3] = 10;
      sparseArray[5] = 20;
      const result = sparseArray.myReduce((acc, val) => acc + val);
      expect(result).toBe(30); // 10 + 20 = 30
    });
  });

  describe("Error handling", () => {
    it("should throw TypeError when callback is not a function", () => {
      expect(() => {
        [1, 2, 3].myReduce("not a function" as any, 0);
      }).toThrow(TypeError);
      expect(() => {
        [1, 2, 3].myReduce("not a function" as any, 0);
      }).toThrow("not a function is not a function");
    });

    it("should throw TypeError for empty array with no initial value", () => {
      const emptyArray: number[] = [];
      expect(() => {
        emptyArray.myReduce((acc, val) => acc + val);
      }).toThrow(TypeError);
      expect(() => {
        emptyArray.myReduce((acc, val) => acc + val);
      }).toThrow("Reduce of empty array with no initial value");
    });

    it("should throw TypeError for sparse array with all holes and no initial value", () => {
      const sparseArray: number[] = [];
      sparseArray.length = 5; // all holes
      expect(() => {
        sparseArray.myReduce((acc, val) => acc + val);
      }).toThrow(TypeError);
      expect(() => {
        sparseArray.myReduce((acc, val) => acc + val);
      }).toThrow("Reduce of empty array with no initial value");
    });
  });

  describe("Different data types", () => {
    it("should work with array of objects", () => {
      const users = [
        { name: "Alice", age: 25 },
        { name: "Bob", age: 30 },
        { name: "Charlie", age: 35 },
      ];
      const totalAge = users.myReduce((acc, user) => acc + user.age, 0);
      expect(totalAge).toBe(90);
    });

    it("should work with array of arrays (flatten)", () => {
      const nested = [[1, 2], [3, 4], [5]];
      const flattened = nested.myReduce<number[]>((acc, arr) => acc.concat(arr), []);
      expect(flattened).toEqual([1, 2, 3, 4, 5]);
    });

    it("should work with boolean accumulator", () => {
      const numbers = [2, 4, 6, 8];
      const allEven = numbers.myReduce(
        (acc, num) => acc && num % 2 === 0,
        true
      );
      expect(allEven).toBe(true);
    });
  });

  describe("Comparison with native reduce", () => {
    it("should match native reduce behavior with initial value", () => {
      const arr = [1, 2, 3, 4, 5];
      const nativeResult = arr.reduce((acc, val) => acc * val, 1);
      const myResult = arr.myReduce((acc, val) => acc * val, 1);
      expect(myResult).toBe(nativeResult);
    });

    it("should match native reduce behavior without initial value", () => {
      const arr = [1, 2, 3, 4, 5];
      const nativeResult = arr.reduce((acc, val) => acc * val);
      const myResult = arr.myReduce((acc, val) => acc * val);
      expect(myResult).toBe(nativeResult);
    });

    it("should match native reduce with sparse arrays", () => {
      const sparseArray = [1, , 2, , 3] as number[];
      const nativeResult = sparseArray.reduce((acc, val) => acc + val, 0);
      const myResult = sparseArray.myReduce((acc, val) => acc + val, 0);
      expect(myResult).toBe(nativeResult);
    });
  });
});
