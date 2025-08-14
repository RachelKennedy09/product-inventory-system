/**
 * compareByKey(a, b, key)
 * --------------------------------------------
 * Purpose:
 *   A tiny, reusable comparator that lets us compare two product objects by a given field (key).
 *   It supports both numbers (price, quantity) and strings (name, category).
 *
 * Why this matters:
 *   - Our QuickSort and Binary Search need a consistent way to compare items.
 *   - For strings, we compare case-insensitively so "Apple" and "apple" line up predictably.
 *
 * Returns:
 *   -1 if a[key] <  b[key]
 *    0 if a[key] === b[key]
 *   +1 if a[key] >  b[key]
 *
 */

export function compareByKey(a, b, key) {
  // Safely read values (handles undefined/null fields without crashing)
  const va = a?.[key];
  const vb = b?.[key];

  // If both values are numbers, compare arithmetically (fast + correct)
  if (typeof va === "number" && typeof vb === "number") {
    if (va < vb) return -1;
    if (va > vb) return 1;
    return 0;
  }

  // Otherwise, compare as lowercase strings (so case doesn't matter)
  const sa = String(va ?? "").toLowerCase();
  const sb = String(vb ?? "").toLowerCase();

  if (sa < sb) return -1;
  if (sa > sb) return 1;
  return 0;
}
