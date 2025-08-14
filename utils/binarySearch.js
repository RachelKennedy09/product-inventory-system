/**
 * Binary Search
 * ------------------------------------------------------
 * Purpose:
 *   Efficiently find ONE item in a list by repeatedly halving the search space.
 *
 * IMPORTANT PRECONDITION:
 *   The array MUST be sorted (ascending) by the SAME KEY you're searching on.
 *   - If you sort by "price", you must search by "price".
 *   - If you sort by "name", you must search by "name".
 *
 * Why Binary Search:
 *   - Time complexity: O(log n)  (VERY fast for large arrays)
 *   - But only works correctly on a sorted array
 *
 * Exact-match only:
 *   This implementation finds exact matches only (=== after normalization).
 *   If you need "contains" or "starts with" behavior for strings,
 *   use a different approach (filter/regex) or do a range search on indices.
 */

import { compareByKey } from "./compareByKey.js";

/**
 * @param {Array<object>} arr        - Array already sorted ASC by `key`.
 * @param {string} key               - Field to search by, e.g., "name" or "price".
 * @param {string|number} value      - The exact value to look for.
 * @returns {object|null}            - The found item, or null if not found.
 */
export function binarySearch(arr, key, value) {
  // Pointers define the current "window" we are searching inside
  let left = 0;
  let right = arr.length - 1;

  // To reuse our comparator, create a "probe" object that contains the target value under the same key.
  const probe = { [key]: value };

  while (left <= right) {
    // 1) Pick the middle index
    const mid = Math.floor((left + right) / 2);

    // 2) Compare the middle item with our target
    const cmp = compareByKey(arr[mid], probe, key);

    if (cmp === 0) {
      // Found exact match — return the object
      return arr[mid];
    }

    if (cmp < 0) {
      // arr[mid] is "smaller" than target -> discard LEFT half (including mid)
      left = mid + 1;
    } else {
      // arr[mid] is "greater" than target -> discard RIGHT half (including mid)
      right = mid - 1;
    }
  }

  // If we exit the loop, the item doesn’t exist in the array
  return null;
}
