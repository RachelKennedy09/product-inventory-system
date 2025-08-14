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
