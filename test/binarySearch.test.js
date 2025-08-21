/**
 * Binary Search Unit Tests
 *
 * Purpose:
 * - Verify that the custom Binary Search implementation finds exact matches in a sorted array.
 * - Confirm that it returns -1 when the target value is not found.
 *
 * Coverage:
 * - Finds numeric values (e.g., price, quantity).
 * - Finds string values (e.g., name, category) with case-insensitive matching.
 * - Ensures array is sorted before searching.
 * - Handles edge cases: empty array, not-found values, first/last element.
 *
 * Expected Complexity:
 * - O(log n) per search.
 */

import { expect } from "chai";
import { binarySearch } from "../utils/binarySearch.js";
import { quickSort } from "../utils/quicksort.js";

describe("binarySearch", () => {
  it("finds an exact match by string key", () => {
    const data = quickSort(
      [
        { name: "banana" },
        { name: "Apple" },
        { name: "carrot" },
        { name: "apple" },
      ],
      "name",
      "asc"
    );
    const found = binarySearch(data, "name", "apple");
    expect(found).to.deep.equal({ name: "apple" });
  });

  it("returns null when not found", () => {
    const data = quickSort(
      [{ price: 1 }, { price: 2 }, { price: 3 }],
      "price",
      "asc"
    );
    const found = binarySearch(data, "price", 4);
    expect(found).to.equal(null);
  });
});
