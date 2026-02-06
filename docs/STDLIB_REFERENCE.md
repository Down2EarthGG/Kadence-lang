# Kadence Standard Library Reference

This document provides a comprehensive reference for all modules in the Kadence standard library.

---

## Table of Contents

1. [Array Operations](#array-operations-stdlibarraykade)
2. [Async Utilities](#async-utilities-stdlibasynckade)
3. [Type Checking](#type-checking-stdlibcheckkade)
4. [Color Utilities](#color-utilities-stdlibcolorkade)
5. [Console Output](#console-output-stdlibconsolekade)
6. [Cryptography](#cryptography-stdlibcryptokade)
7. [Date & Time](#date--time-stdlibdatetimekade)
8. [Encoding](#encoding-stdlibencodingkade)
9. [Environment](#environment-stdlibenvkade)
10. [File System](#file-system-stdlibfilekade)
11. [Formatting](#formatting-stdlibformatkade)
12. [HTML Generation](#html-generation-stdlibhtmlkade)
13. [JSON](#json-stdlibjsonkade)
14. [List Operations](#list-operations-stdliblistkade)
15. [Map/Dictionary](#mapdictionary-stdlibmapkade)
16. [Math](#math-stdlibmathkade)
17. [Network](#network-stdlibnetworkkade)
18. [Number Utilities](#number-utilities-stdlibnumberkade)
19. [Object Utilities](#object-utilities-stdlibobjectkade)
20. [Path Operations](#path-operations-stdlibpathkade)
21. [Process](#process-stdlibprocesskade)
22. [Promises](#promises-stdlibpromisekade)
23. [Random](#random-stdlibrandomkade)
24. [Regular Expressions](#regular-expressions-stdlibregexkade)
25. [Set Operations](#set-operations-stdlibsetkade)
26. [Stream](#stream-stdlibstreamkade)
27. [String Operations](#string-operations-stdlibstringkade)
28. [System Info](#system-info-stdlibsystemkade)
29. [Testing](#testing-stdlibtestkade)
30. [URL](#url-stdliburlkade)
31. [UUID](#uuid-stdlibuuidkade)
32. [Validation](#validation-stdlibvalidationkade)

---

## Array Operations (stdlib/array.kade)

Advanced array manipulation utilities written in pure Kadence.

### Functions

#### `flatten nestedArray`
Recursively flattens nested arrays into a single-level array.

```kadence
let nested = list (list 1 2) (list 3 4)
let flat = run array.flatten nested  // [1, 2, 3, 4]
```

#### `zip array1 array2`
Combines two arrays into an array of pairs.

```kadence
let names = list "Alice" "Bob"
let ages = list 25 30
let pairs = run array.zip names ages  // [["Alice", 25], ["Bob", 30]]
```

#### `chunk array chunkSize`
Splits an array into chunks of specified size.

```kadence
let numbers = list 1 2 3 4 5 6
let chunks = run array.chunk numbers 2  // [[1, 2], [3, 4], [5, 6]]
```

#### `partition array predicate`
Splits array into two arrays based on predicate: [truthy, falsy].

```kadence
let nums = list 1 2 3 4 5 6
let parts = run array.partition nums (x => x more than 3)  // [[4, 5, 6], [1, 2, 3]]
```

#### `take array count`
Returns the first N elements of an array.

```kadence
let first3 = run array.take (list 1 2 3 4 5) 3  // [1, 2, 3]
```

#### `drop array count`
Returns array with first N elements removed.

```kadence
let rest = run array.drop (list 1 2 3 4 5) 2  // [3, 4, 5]
```

#### `reverse array`
Returns a reversed copy of the array.

```kadence
let reversed = run array.reverse (list 1 2 3)  // [3, 2, 1]
```

#### `findIndex array predicate`
Returns the index of the first element matching the predicate, or -1.

```kadence
let index = run array.findIndex (list 1 2 3 4) (x => x equals 3)  // 2
```

---

## Async Utilities (stdlib/async.kade)

Powerful tools for managing asynchronous operations.

### Functions

#### `delay milliseconds`
Returns a promise that resolves after the specified delay.

```kadence
await run async.delay 1000  // Wait 1 second
```

#### `timeout promise milliseconds`
Wraps a promise with a timeout; rejects if not resolved in time.

```kadence
let result = await run async.timeout fetchData 5000  // 5 second timeout
```

#### `retry fn maxAttempts delayMs`
Retries a function up to maxAttempts times with delay between attempts.

```kadence
let result = await run async.retry fetchData 3 1000  // 3 attempts, 1s delay
```

#### `debounce fn delayMs`
Returns a debounced version of the function.

```kadence
let debouncedSearch = run async.debounce searchFunction 300
```

#### `throttle fn delayMs`
Returns a throttled version of the function.

```kadence
let throttledScroll = run async.throttle handleScroll 100
```

#### `parallel promises`
Runs multiple promises in parallel (alias for Promise.all).

```kadence
let results = await run async.parallel (list promise1 promise2 promise3)
```

#### `race promises`
Returns the result of the first promise to resolve (alias for Promise.race).

```kadence
let fastest = await run async.race (list promise1 promise2)
```

#### `sequential tasks`
Runs async tasks sequentially, returning array of results.

```kadence
let results = await run async.sequential (list task1 task2 task3)
```

#### `waterfall tasks initialValue`
Runs tasks sequentially, passing each result to the next task.

```kadence
let final = await run async.waterfall (list task1 task2 task3) initialValue
```

#### `batch items batchSize processFn`
Processes items in batches, calling processFn for each batch.

```kadence
let results = await run async.batch items 10 processBatch
```

---

## Formatting (stdlib/format.kade)

Text and number formatting utilities.

### Functions

#### `currency amount currencyCode`
Formats a number as currency.

```kadence
let price = run format.currency 1234.56 "USD"  // "$1,234.56"
```

#### `formatNumber num decimals`
Formats a number with specified decimal places.

```kadence
let formatted = run format.formatNumber 3.14159 2  // "3.14"
```

#### `percentage num decimals`
Formats a number as a percentage.

```kadence
let percent = run format.percentage 0.856 1  // "0.9%"
```

#### `fileSize bytes`
Formats bytes as human-readable file size (B, KB, MB, GB).

```kadence
let size = run format.fileSize 1536000  // "1.46 MB"
```

#### `ordinal num`
Converts a number to its ordinal form (1st, 2nd, 3rd, etc.).

```kadence
echo run format.ordinal 1   // "1st"
echo run format.ordinal 21  // "21st"
echo run format.ordinal 11  // "11th"
```

#### `plural count singular pluralForm`
Returns singular or plural form based on count.

```kadence
let word = run format.plural 1 "item" "items"  // "item"
let word2 = run format.plural 5 "item" "items"  // "items"
```

#### `truncate text maxLength suffix`
Truncates text to maxLength and appends suffix.

```kadence
let short = run format.truncate "Hello World" 8 "..."  // "Hello Wo..."
```

#### `ellipsis text maxLength`
Truncates text with "..." suffix.

```kadence
let ellipsed = run format.ellipsis "Long text here" 10  // "Long text ..."
```

#### `padNumber num width`
Pads a number with leading zeros to specified width.

```kadence
let padded = run format.padNumber 7 3  // "007"
```

#### `phoneNumber text`
Formats a phone number as (XXX) XXX-XXXX.

```kadence
let phone = run format.phoneNumber "1234567890"  // "(123) 456-7890"
```

#### `titleCase text`
Converts text to Title Case.

```kadence
let title = run format.titleCase "hello world"  // "Hello World"
```

#### `snakeCase text`
Converts text to snake_case.

```kadence
let snake = run format.snakeCase "Hello World"  // "hello_world"
```

#### `kebabCase text`
Converts text to kebab-case.

```kadence
let kebab = run format.kebabCase "Hello World"  // "hello-world"
```

---

## Map/Dictionary (stdlib/map.kade)

Utilities for working with objects as dictionaries.

### Functions

#### `keys obj`
Returns an array of object keys.

```kadence
let allKeys = run map.keys person  // ["name", "age", "city"]
```

#### `values obj`
Returns an array of object values.

```kadence
let allValues = run map.values person  // ["Alice", 30, "NYC"]
```

#### `entries obj`
Returns an array of [key, value] pairs.

```kadence
let pairs = run map.entries person  // [["name", "Alice"], ["age", 30]]
```

#### `hasKey obj key`
Checks if object has the specified key.

```kadence
let hasAge = run map.hasKey person "age"  // true
```

#### `merge obj1 obj2`
Merges two objects (obj2 properties override obj1).

```kadence
let merged = run map.merge person extra
```

#### `pick obj keysArray`
Creates new object with only specified keys.

```kadence
let subset = run map.pick person (list "name" "age")
```

#### `omit obj keysArray`
Creates new object without specified keys.

```kadence
let without = run map.omit person (list "city")
```

#### `mapValues obj fn`
Transforms all values using the provided function.

```kadence
let doubled = run map.mapValues (object { a: 1, b: 2 }) (x => x times 2)
```

#### `mapKeys obj fn`
Transforms all keys using the provided function.

```kadence
let prefixed = run map.mapKeys person (k => "user_" plus k)
```

#### `invert obj`
Swaps keys and values.

```kadence
let inverted = run map.invert (object { a: "x", b: "y" })  // { x: "a", y: "b" }
```

#### `deepClone obj`
Creates a deep copy of the object.

```kadence
let clone = run map.deepClone person
```

#### `getPath obj path`
Gets a nested property using dot notation.

```kadence
let value = run map.getPath person "address.city"
```

#### `defaults obj defs`
Fills in missing properties from defaults object.

```kadence
let withDefaults = run map.defaults person (object { country: "USA" })
```

#### `isEmpty obj`
Checks if object has no keys.

```kadence
let empty = run map.isEmpty (object {})  // true
```

#### `fromPairs pairsArray`
Creates an object from an array of [key, value] pairs.

```kadence
let obj = run map.fromPairs (list (list "a" 1) (list "b" 2))  // { a: 1, b: 2 }
```

---

## Set Operations (stdlib/set.kade)

Mathematical set operations on arrays.

### Functions

#### `union set1 set2`
Returns all unique elements from both sets.

```kadence
let combined = run set.union (list 1 2 3) (list 3 4 5)  // [1, 2, 3, 4, 5]
```

#### `intersection set1 set2`
Returns elements present in both sets.

```kadence
let common = run set.intersection (list 1 2 3) (list 2 3 4)  // [2, 3]
```

#### `difference set1 set2`
Returns elements in set1 but not in set2.

```kadence
let diff = run set.difference (list 1 2 3) (list 2 3 4)  // [1]
```

#### `symmetricDifference set1 set2`
Returns elements in either set but not in both.

```kadence
let symDiff = run set.symmetricDifference (list 1 2 3) (list 3 4 5)  // [1, 2, 4, 5]
```

#### `isSubset subset bigSet`
Checks if all elements of subset are in bigSet.

```kadence
let isSub = run set.isSubset (list 1 2) (list 1 2 3 4)  // true
```

#### `isSuperset bigSet subset`
Checks if bigSet contains all elements of subset.

```kadence
let isSuper = run set.isSuperset (list 1 2 3 4) (list 1 2)  // true
```

#### `areDisjoint set1 set2`
Checks if sets have no common elements.

```kadence
let disjoint = run set.areDisjoint (list 1 2) (list 5 6)  // true
```

#### `cartesianProduct set1 set2`
Returns all possible pairs from both sets.

```kadence
let product = run set.cartesianProduct (list 1 2) (list "a" "b")
// [[1, "a"], [1, "b"], [2, "a"], [2, "b"]]
```

---

## Validation (stdlib/validation.kade)

Comprehensive input validation functions.

### Functions

#### `isEmail text`
Validates email format.

```kadence
let valid = run validation.isEmail "user@example.com"  // true
```

#### `isUrl text`
Validates URL format.

```kadence
let validUrl = run validation.isUrl "https://example.com"  // true
```

#### `isNumeric text`
Checks if string contains only digits.

```kadence
let isNum = run validation.isNumeric "12345"  // true
```

#### `isAlpha text`
Checks if string contains only letters.

```kadence
let isAlpha = run validation.isAlpha "Hello"  // true
```

#### `isAlphanumeric text`
Checks if string contains only letters and digits.

```kadence
let isAlphaNum = run validation.isAlphanumeric "Hello123"  // true
```

#### `isInteger text`
Checks if string represents an integer.

```kadence
let isInt = run validation.isInteger "42"  // true
```

#### `isPositive num`
Checks if number is greater than 0.

```kadence
let positive = run validation.isPositive 5  // true
```

#### `isNegative num`
Checks if number is less than 0.

```kadence
let negative = run validation.isNegative (0 - 3)  // true
```

#### `isInRange num min max`
Checks if number is within range (inclusive).

```kadence
let inRange = run validation.isInRange 5 1 10  // true
```

#### `isLength text minLen maxLen`
Checks if string length is within range (inclusive).

```kadence
let validLen = run validation.isLength "hello" 3 10  // true
```

#### `isBlank text`
Checks if string is empty or only whitespace.

```kadence
let blank = run validation.isBlank "   "  // true
```

#### `isNotEmpty text`
Checks if string has non-whitespace content.

```kadence
let notEmpty = run validation.isNotEmpty "text"  // true
```

#### `isHexColor text`
Validates hex color format (#RGB or #RRGGBB).

```kadence
let hexColor = run validation.isHexColor "#FF5733"  // true
```

#### `isIpAddress text`
Validates IPv4 address format.

```kadence
let ipAddr = run validation.isIpAddress "192.168.1.1"  // true
```

#### `isPhoneNumber text`
Validates phone number format (various formats accepted).

```kadence
let phone = run validation.isPhoneNumber "555-123-4567"  // true
```

#### `isCreditCard text`
Validates credit card number using Luhn algorithm.

```kadence
let creditCard = run validation.isCreditCard "4532015112830366"  // true
```

#### `isStrongPassword text`
Checks if password meets strength requirements (8+ chars, uppercase, lowercase, digit, special char).

```kadence
let strongPass = run validation.isStrongPassword "MyP@ssw0rd123"  // true
```

---

## Notes

- **Performance**: Set operations in `stdlib/set.kade` use O(n²) algorithms suitable for small sets. For large datasets, consider using JavaScript Set objects directly.
- **Async Patterns**: The `async` module provides both functional utilities (debounce, throttle) and control flow patterns (sequential, waterfall, batch).
- **Validation**: The `validation` module uses regex patterns and algorithms (like Luhn for credit cards) to validate common formats.
- **Formatting**: The `format` module handles edge cases like ordinal numbers (11th, 12th, 13th vs 1st, 2nd, 3rd).

---

## See Also

- [User Guide](USER_GUIDE.md) - Complete language guide
- [Examples](EXAMPLES.md) - Code examples
- [Language Reference](LANGUAGE_REFERENCE.md) - Syntax reference
