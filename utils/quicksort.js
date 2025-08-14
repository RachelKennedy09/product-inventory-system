/**
 * QuickSort (non-mutating)
 * ------------------------------------------------------
 * Purpose:
 *   Sort an array of product objects by a chosen key ("name", "category", "price", "quantity").
 *   This function RETURNS A NEW ARRAY (does not mutate the original), which is a safer default.
 *
 * Why QuickSort:
 *   - Average time complexity: O(n log n)  (fast in practice)
 *   - Worst-case time complexity: O(n^2)   (rare, but happens on bad pivots)
 *   - Easy to read and implement for learning purposes
 *
 * Stability:
 *   - QuickSort is NOT guaranteed stable (equal values may swap relative order).
 *   - For use-case (inventory), stability is usually fine to ignore.
 *   - Merge sort would be more stable, but learning quicksort for this project
 */

import { compareByKey } from "./compareByKey.js";

/**
 * @param {Array<object>} arr    - The array of products to sort.
 * @param {string} key           - The field to sort by (e.g., "price").
 * @param {"asc"|"desc"} order   - Sort direction ("asc" default).
 * @returns {Array<object>}      - A new, sorted array (original is unchanged).
 */
export function quickSort(arr, key, order = "asc") {
  // Safety checks: handle bad inputs gracefully
  if (!Array.isArray(arr)) return [];
  const n = arr.length;

  // Base case: arrays with 0 or 1 element are already sorted
  if (n <= 1) return arr.slice(); // return a shallow copy

  // 1) Choose a pivot
  //    I pick the last element as the pivot to keep the code simple.
  //  
  const pivot = arr[n - 1];

  // 2) Partition the array into two sub-arrays relative to the pivot:
  //    - `left`  holds items that should come BEFORE the pivot
  //    - `right` holds items that should come AFTER the pivot
  const left = [];
  const right = [];

  for (let i = 0; i < n - 1; i++) {
    // Compare current item with pivot on the chosen key
    const cmp = compareByKey(arr[i], pivot, key);

    // Order handling:
    //  - ascending: send "smaller OR equal" to left to better balance duplicates
    //  - descending: invert the logic
    const goesLeft = order === "asc" ? cmp <= 0 : cmp >= 0;
    if (goesLeft) left.push(arr[i]);
    else right.push(arr[i]);
  }

  // 3) Recursively sort each side, then rebuild the final array:
  //    (sorted left) + [pivot] + (sorted right)
  //    "divide and conquer" strategy.
  return [...quickSort(left, key, order), pivot, ...quickSort(right, key, order)];
}
