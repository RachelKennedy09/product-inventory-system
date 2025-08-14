import { expect } from "chai";
import { quickSort } from "../utils/quicksort.js";

describe("quickSort", () => {
  it("sorts strings case-insensitively (asc)", () => {
    const data = [
      { name: "banana" },
      { name: "Apple" },
      { name: "carrot" },
      { name: "apple" },
    ];
    const sorted = quickSort(data, "name", "asc");
    expect(sorted.map((x) => x.name)).to.deep.equal([
      "Apple",
      "apple",
      "banana",
      "carrot",
    ]);
  });

  it("sorts numbers (desc)", () => {
    const data = [{ price: 10 }, { price: 5 }, { price: 20 }, { price: 20 }];
    const sorted = quickSort(data, "price", "desc");
    expect(sorted.map((x) => x.price)).to.deep.equal([20, 20, 10, 5]);
  });

  it("does not mutate the input array", () => {
    const data = [{ price: 2 }, { price: 1 }];
    const copy = JSON.parse(JSON.stringify(data));
    quickSort(data, "price");
    expect(data).to.deep.equal(copy);
  });
});
