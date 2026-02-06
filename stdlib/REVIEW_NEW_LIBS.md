# Review: New stdlib Libraries

Summary of the new/untracked stdlib modules and fixes applied.

---

## 1. **array.kade** ✓

Pure Kadence array utilities: `flatten`, `zip`, `chunk`, `partition`, `take`, `drop`, `reverse`, `findIndex`.

- **Style**: Uses `list`, `add … to result`, `size of`, `increment`/`decrement` consistently.
- **Note**: `flatten` treats any `elem` with `typeof "object"` and `elem.length` as nested array; that matches array-like values. Consider documenting that only one level of “array-like” is assumed if you want to avoid surprises with non-Array objects.

---

## 2. **async.kade** + **async-helpers.js** ✓

Kadence wrapper over JS helpers: `delay`, `timeout`, `retry`, `debounce`, `throttle`, `parallel`, `race`, `sequential`, `waterfall`, `batch`.

- **Pattern**: Same as other `.kade` + `-helpers.js` pairs: Kadence exports call `run require "./async-helpers.js"` and `run mod.<name> …`.
- **async-helpers.js**: Clear, no extra dependencies; `batch` expects `processFn(batchItems)` to return an array of results.
- **async.js**: Generated output; contains leftover `__kadence_*` and `fs` at the top. Prefer regenerating from `async.kade` or trimming the stub so only the actual exports remain.

---

## 3. **format.kade** + **format-helpers.js** ✓ (ordinal fixed)

Formatting: `currency`, `formatNumber`, `percentage`, `fileSize`, `ordinal`, `plural`, `truncate`, `ellipsis`, `padNumber`, `phoneNumber`, `titleCase`, `snakeCase`, `kebabCase`.

- **ordinal**: Logic was wrong for both remainder and 11/12/13. Updated to use `floor` for integer-like behavior and to treat 11–13 correctly (e.g. 11th, 12th, 13th, 21st, 22nd).
- **format-helpers.js**: Only `currency` and `phoneNumber`; used via `require`. Fine as-is.
- **titleCase**: Uses `split`/`join`/`uppercase`/`lowercase`; consistent with language reference.

---

## 4. **map.kade** + **map.js** + **object-helpers.js** ✓

Map/object utilities: `keys`, `values`, `entries`, `hasKey`, `merge`, `pick`, `omit`, `mapValues`, `mapKeys`, `invert`, `isEmpty`, `fromPairs`.

- **map.kade**: Delegates to `object-helpers.js` for everything except `isEmpty` (uses `Object.keys`) and `fromPairs` (inline loop). Good split.
- **object-helpers.js**: Provides `pick`, `omit`, `deepClone`, `get`, `defaults`, plus key/values/entries/hasKey/merge/mapValues/mapKeys/invert. `map.kade` does not yet expose `deepClone`, `get`, or `defaults`; add wrappers in `map.kade` if you want them in the public API.
- **fromPairs**: Uses `let result = {}` and `result[pair[0]] = pair[1]`. For consistency with LANGUAGE_REFERENCE (“Object: object { key: val }”), you could use `object {}` and `set … of result to …` if the compiler supports empty `object {}` and property set.

---

## 5. **set.kade** ✓

Set operations on lists (no native Set): `union`, `intersection`, `difference`, `symmetricDifference`, `isSubset`, `isSuperset`, `areDisjoint`, `cartesianProduct`.

- **Style**: Pure Kadence, no JS helpers; uses nested `for each` and equality. Readable.
- **Cost**: O(n²) in many places (e.g. membership via linear search). Acceptable for small sets; for large sets consider a JS helper backed by `Set` and call it from a thin `.kade` wrapper (like async/format).

---

## 6. **validation.kade** ✓ (comparisons fixed)

Validators: `isEmail`, `isUrl`, `isNumeric`, `isAlpha`, `isAlphanumeric`, `isInteger`, `isPositive`, `isNegative`, `isInRange`, `isLength`, `isEmpty`/`isNotEmpty`, `isHexColor`, `isIpAddress`, `isPhoneNumber`, `isCreditCard` (Luhn), `isStrongPassword`.

- **Comparisons**: The compiler only supports `at least` / `at most` for ≥/≤ (see `CompareOp` in grammar). Replaced “more than or equals” / “less than or equals” with “at least” / “at most” in `isInRange`, `isLength`, `isPhoneNumber`, and the Luhn loop.
- **Name clash**: Resolved by renaming string “blank” check from `isEmpty` to `isBlank`; `isNotEmpty` now calls `isBlank`.
- **Luhn**: Logic for `isCreditCard` is correct; `(sum / 10) * 10 equals sum` is a valid way to express “sum divisible by 10” without a mod operator.

---

## 7. **object-helpers.js** (modified)

Shared implementation for object/map operations. Used by **map.kade**; no issues found. Exports are consistent with what **map.kade** calls.

---

## 8. **.object.kade.js**

Appears to be compiled output (e.g. from a file like `object.kade`). Typically such files are generated; consider adding them to `.gitignore` or generating them in a build step so they aren’t committed as source.

---

## Summary of changes made

| File             | Change                                                                 |
|------------------|------------------------------------------------------------------------|
| **validation.kade** | Replaced “more than or equals” / “less than or equals” with “at least” / “at most” in four places so the code parses and runs. |
| **format.kade**     | Reworked `ordinal` to use `floor` for tens/remainder and to handle 11–13 correctly (e.g. 11th, 21st). |

---

## Recommendations (implemented)

1. **Consistency**: Use “at least” / “at most” everywhere; **validation.kade** and **test-reverse.kade** were updated.
2. **validation.kade** `isEmpty`: Renamed to `isBlank`; `isNotEmpty` now calls `isBlank`.
3. **map.kade**: Exposes `deepClone`, `get`, and `defaults` from **object-helpers.js**; **map.js** updated to match.
4. **async.js / map.js**: Removed `__kadence_*` and `fs` stubs so the emitted JS is minimal.
5. **.object.kade.js**: Added `stdlib/.object.kade.js` to **.gitignore** so generated output is not committed.
