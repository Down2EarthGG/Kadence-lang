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

## Type Checking (stdlib/check.kade)

Utilities for checking value types.

### Functions

#### `isNumber val`
Checks if the value is a number.

```kadence
let isNum = run check.isNumber 42  // true
```

#### `isString val`
Checks if the value is a string.

```kadence
let isStr = run check.isString "hello"  // true
```

#### `isEmail text`
Checks if the string matches an email format.

```kadence
let valid = run check.isEmail "user@example.com"  // true
```

#### `between val min max`
Checks if a number is between min and max (inclusive).

```kadence
let inRange = run check.between 5 1 10  // true
```

#### `coalesce a b`
Returns `a` if it is not null or undefined, otherwise returns `b`.

```kadence
let val = run check.coalesce null "default"  // "default"
```

---

## Color Utilities (stdlib/color.kade)

Utilities for working with colors.

### Functions

#### `rgb r g b`
Creates an RGB color string.

```kadence
let color = run color.rgb 255 0 0  // "rgb(255,0,0)"
```

#### `rgba r g b a`
Creates an RGBA color string.

```kadence
let color = run color.rgba 255 0 0 0.5  // "rgba(255,0,0,0.5)"
```

#### `hex hexStr`
Converts a hex string to an RGB object/string (implementation depends on helper).

```kadence
let rgbVal = run color.hex "#FF0000"
```

#### `randomHex`
Generates a random hex color string.

```kadence
let randColor = run color.randomHex  // e.g. "#a3f2b1"
```

---

## Console Output (stdlib/console.kade)

Utilities for console logging and styling.

### Functions

#### `log message`
Prints a message to stdout.

```kadence
run console.log "Hello World"
```

#### `error message`
Prints a message to stderr.

```kadence
run console.error "Something went wrong"
```

#### `red text`
Wraps text in ANSI red codes.

```kadence
echo run console.red "Error!"
```

#### `green text`
Wraps text in ANSI green codes.

```kadence
echo run console.green "Success!"
```

#### `bold text`
Wraps text in ANSI bold codes.

```kadence
echo run console.bold "Important"
```

---

## Cryptography (stdlib/crypto.kade)

Cryptographic utilities.

### Functions

#### `hash str`
Creates a hash of the string (defaults to sha256 usually).

```kadence
let hashed = run crypto.hash "password"
```

#### `randomBytes n`
Generates `n` cryptographically strong pseudo-random bytes.

```kadence
let bytes = run crypto.randomBytes 16
```

---

---

## Date & Time (stdlib/datetime.kade)

Utilities for working with dates and times.

### Functions

#### `currentTime`
Returns the current date and time as a Date object.

```kadence
let now = run datetime.currentTime
```

#### `today`
Returns the current date as a Date object (same as currentTime).

```kadence
let d = run datetime.today
```

#### `year d`
Returns the year from a Date object.

```kadence
let y = run datetime.year now  // 2026
```

#### `month d`
Returns the month (1-12) from a Date object.

```kadence
let m = run datetime.month now  // 2
```

#### `day d`
Returns the day of the month (1-31).

```kadence
let d = run datetime.day now  // 5
```

#### `toIso d`
Returns the date as an ISO string.

```kadence
let iso = run datetime.toIso now  // "2026-02-05T..."
```

#### `addDays d n`
Returns a new Date object with `n` days added.

```kadence
let nextWeek = run datetime.addDays now 7
```

---

## Encoding (stdlib/encoding.kade)

Utilities for string encoding and decoding.

### Functions

#### `base64Encode str`
Encodes a string to Base64.

```kadence
let encoded = run encoding.base64Encode "hello"
```

#### `base64Decode str`
Decodes a Base64 string.

```kadence
let decoded = run encoding.base64Decode encoded
```

#### `urlEncode str`
Encodes a string for use in a URL.

```kadence
let safe = run encoding.urlEncode "hello world"  // "hello%20world"
```

#### `urlDecode str`
Decodes a URL-encoded string.

```kadence
let original = run encoding.urlDecode safe
```

---

## Environment (stdlib/env.kade)

Utilities for accessing environment variables.

### Functions

#### `getEnv name`
Returns the value of an environment variable.

```kadence
let path = run env.getEnv "PATH"
```

#### `hasEnv name`
Checks if an environment variable exists.

```kadence
let hasPath = run env.hasEnv "PATH"  // true
```

---

## File System (stdlib/file.kade)

Utilities for file system operations.

### Functions

#### `listDir path`
Returns a list of files and directories in the path.

```kadence
let files = run file.listDir "."
```

#### `exists path`
Checks if a file or directory exists.

```kadence
let exists = run file.exists "README.md"  // true
```

#### `mkdir path`
Creates a directory.

```kadence
run file.mkdir "new-folder"
```

#### `append path content`
Appends content to a file.

```kadence
run file.append "log.txt" "New entry\n"
```

#### `unlink path`
Deletes a file.

```kadence
run file.unlink "temp.txt"
```

#### `readFile path`
Reads the content of a file as a string.

```kadence
let content = run file.readFile "README.md"
```

#### `writeFile path content`
Writes content to a file (overwriting it).

```kadence
run file.writeFile "output.txt" "Hello"
```

#### `copyFile src dest`
Copies a file from src to dest.

```kadence
run file.copyFile "source.txt" "dest.txt"
```

#### `removeDir path`
Removes a directory and its contents recursively.

```kadence
run file.removeDir "temp-folder"
```

#### `copyDir src dest`
Copies a directory and its contents recursively.

```kadence
run file.copyDir "src" "dist"
```

#### `stat path`
Returns file statistics (size, modification time, etc.).

```kadence
let stats = run file.stat "file.txt"
```

#### `isDirectory path`
Checks if the path is a directory.

```kadence
let isDir = run file.isDirectory "src"
```

#### `isFile path`
Checks if the path is a file.

```kadence
let isFile = run file.isFile "README.md"
```

---

## HTML Generation (stdlib/html.kade)

Utilities for generating HTML strings.

### Functions

#### `tag name content`
Creates an HTML tag with the given name and content.

```kadence
let html = run html.tag "strong" "Bold Text"  // "<strong>Bold Text</strong>"
```

#### `div content`
Creates a `div` tag.

```kadence
let div = run html.div "Content"
```

#### `span content`
Creates a `span` tag.

```kadence
let span = run html.span "Content"
```

#### `p content`
Creates a `p` tag.

```kadence
let p = run html.p "Paragraph"
```

#### `h1 content`
Creates an `h1` tag.

```kadence
let h1 = run html.h1 "Title"
```

#### `link content`
Creates an `a` (anchor) tag (note: currently just wrapping content in `<a>`, useful when combined with manual attributes or simple links).

```kadence
let link = run html.link "Click me"
```

#### `img content`
Creates an `img` tag (wrap the src in the content currently).

```kadence
let img = run html.img "src='image.png'"
```

---

## JSON (stdlib/json.kade)

Utilities for working with JSON files and data.

### Functions

#### `readJson path`
Reads and parses a JSON file.

```kadence
let config = run json.readJson "config.json"
```

#### `writeJson path data`
Writes data to a JSON file.

```kadence
run json.writeJson "data.json" (object { key: "value" })
```

#### `format data`
Returns a formatted JSON string (pretty print).

```kadence
let str = run json.format data
```

#### `parseSafe text`
Safely parses a JSON string, returning null on error.

```kadence
let data = run json.parseSafe "{ invalid json }"  // null
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

---

## List Operations (stdlib/list.kade)

Utilities for working with lists.

### Functions

#### `sort array`
Sorts an array in ascending order.

```kadence
let sorted = run list.sort (list 3 1 2)  // [1, 2, 3]
```

#### `sortBy array keyFn`
Sorts an array based on the value returned by the key function.

```kadence
let sorted = run list.sortBy people (p => p.age)
```

#### `first array`
Returns the first element of the array.

```kadence
let item = run list.first (list 1 2 3)  // 1
```

#### `lastOf array`
Returns the last element of the array.

```kadence
let item = run list.lastOf (list 1 2 3)  // 3
```

#### `isEmpty array`
Checks if the array is empty.

```kadence
let empty = run list.isEmpty (list)  // true
```

#### `length array`
Returns the length of the array.

```kadence
let len = run list.length (list 1 2 3)  // 3
```

#### `contains array item`
Checks if the array contains the specified item.

```kadence
let hasTwo = run list.contains (list 1 2 3) 2  // true
```

#### `unique array`
Returns a new array with duplicate elements removed.

```kadence
let uniq = run list.unique (list 1 2 2 3)  // [1, 2, 3]
```

#### `shuffle array`
Randomly shuffles the elements of the array.

```kadence
let mixed = run list.shuffle (list 1 2 3 4)
```

#### `makeRange start end`
Creates an array of numbers from start to end (inclusive).

```kadence
let nums = run list.makeRange 1 5  // [1, 2, 3, 4, 5]
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

---

## Math (stdlib/math.kade)

Mathematical utilities.

### Functions

#### `hypotenuse a b`
Calculates the hypotenuse of a right-angled triangle.

```kadence
let h = run math.hypotenuse 3 4  // 5
```

#### `areaOfCircle radius`
Calculates the area of a circle.

```kadence
let area = run math.areaOfCircle 10
```

#### `isEven n`
Checks if a number is even.

```kadence
let even = run math.isEven 4  // true
```

#### `clamp val min max`
Restricts a value to be within a range.

```kadence
let val = run math.clamp 15 0 10  // 10
```

#### `randomFloat min max`
Returns a random floating-point number between min and max.

```kadence
let r = run math.randomFloat 0.0 1.0
```

#### `toRadians deg`
Converts degrees to radians.

```kadence
let rad = run math.toRadians 180  // 3.14159...
```

#### `toDegrees rad`
Converts radians to degrees.

```kadence
let deg = run math.toDegrees 3.14159  // 180
```

---

## Network (stdlib/network.kade)

Network utilities including a simple HTTP server.

### Functions

#### `serve port handler`
Starts a simple HTTP server.

```kadence
run network.serve 3000 (req, res) => {
    run res.send "Hello World"
}
```

#### `fetchJson url`
Fetches a JSON response from a URL.

```kadence
let data = await run network.fetchJson "https://api.example.com/data"
```

---

## Number Utilities (stdlib/number.kade)

Utilities for working with numbers.

### Functions

#### `parseNumber str`
Parses a string into a number.

```kadence
let n = run number.parseNumber "42.5"
```

#### `formatNumber num decimals`
Formats a number with a fixed number of decimal places.

```kadence
let s = run number.formatNumber 3.14159 2  // "3.14"
```

#### `isNaNVal val`
Checks if the value is NaN.

```kadence
let isNan = run number.isNaNVal (0 / 0)  // true
```

#### `isFiniteVal val`
Checks if the value is a finite number.

```kadence
let isFin = run number.isFiniteVal 100  // true
```

---

## Object Utilities (stdlib/object.kade)

Utilities for object manipulation.

### Functions

#### `hasKey obj key`
Checks if the object has the specified key.

```kadence
let has = run object.hasKey person "name"
```

#### `getKeys obj`
Returns an array of the object's keys.

```kadence
let keys = run object.getKeys person
```

#### `getValues obj`
Returns an array of the object's values.

```kadence
let values = run object.getValues person
```

#### `mergeObjects a b`
Merges two objects into a new object.

```kadence
let merged = run object.mergeObjects obj1 obj2
```

---

## Path Operations (stdlib/path.kade)

Utilities for handling file paths.

### Functions

#### `joinPaths a b`
Joins two path segments.

```kadence
let p = run path.joinPaths "src" "main.kade"
```

#### `resolve path`
Resolves a path to an absolute path.

```kadence
let abs = run path.resolve "./src"
```

#### `dirname path`
Returns the directory name of a path.

```kadence
let dir = run path.dirname "/path/to/file.txt"  // "/path/to"
```

#### `basename path`
Returns the last portion of a path.

```kadence
let base = run path.basename "/path/to/file.txt"  // "file.txt"
```

#### `extension path`
Returns the extension of the path.

```kadence
let ext = run path.extension "file.txt"  // ".txt"
```

---

## Process (stdlib/process.kade)

Utilities for interacting with the current process.

### Functions

#### `exit code`
Exits the process with the specified code (default 0).

```kadence
run process.exit 1
```

#### `args`
Returns the command-line arguments passed to the script.

```kadence
let args = run process.args
```

#### `cwd`
Returns the current working directory.

```kadence
let dir = run process.cwd
```

---

## Promises (stdlib/promise.kade)

Utilities for working with Promises.

### Functions

#### `promiseAll promises`
Waits for all promises to resolve.

```kadence
let results = await run promise.promiseAll (list p1 p2)
```

#### `promiseRace promises`
Returns a promise that resolves or rejects as soon as one of the promises settles.

```kadence
let first = await run promise.promiseRace (list p1 p2)
```

#### `delay ms`
Returns a promise that resolves after `ms` milliseconds.

```kadence
await run promise.delay 1000
```

#### `retry fn maxRetries`
Retries an async function up to `maxRetries` times.

```kadence
let result = await run promise.retry fetchData 3
```

---

## Random (stdlib/random.kade)

Random number and item generation.

### Functions

#### `float min max`
Returns a random floating-point number between min and max.

```kadence
let f = run random.float 0 10
```

#### `integer min max`
Returns a random integer between min and max (inclusive).

```kadence
let i = run random.integer 1 100
```

#### `choice items`
Returns a random item from the array.

```kadence
let item = run random.choice (list "a" "b" "c")
```

#### `shuffle items`
Returns a new array with the items shuffled.

```kadence
let shuffled = run random.shuffle cards
```

#### `hex`
Generates a random 6-digit hex color string (prefixed with #).

```kadence
let color = run random.hex  // e.g. "#a1b2c3"
```

---

## Regular Expressions (stdlib/regex.kade)

Regex utilities.

### Functions

#### `test pattern str`
Tests if the string matches the pattern.

```kadence
let matches = run regex.test "^[0-9]+$" "123"  // true
```

#### `replaceAll pattern str replacement`
Replaces all occurrences of the pattern in the string.

```kadence
let clean = run regex.replaceAll "\\s+" "hello world" "-"
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

---

## Stream (stdlib/stream.kade)

Utilities for working with streams.

### Functions

#### `createReader stream`
Creates a reader for a ReadableStream.

```kadence
let reader = run stream.createReader response.body
```

#### `readAll stream`
Reads all data from a stream and returns it as a list of chunks.

```kadence
let chunks = await run stream.readAll readable
```

#### `pipe source to target`
Pipes a readable stream to a writable stream.

```kadence
run stream.pipe source to dest
```

---

## String Operations (stdlib/string.kade)

String manipulation utilities.

### Functions

#### `words text`
Splits text into words.

```kadence
let w = run string.words "hello world"  // ["hello", "world"]
```

#### `lines text`
Splits text into lines.

```kadence
let l = run string.lines "line1\nline2"
```

#### `trimmed text`
Trims whitespace from both ends of the string.

```kadence
let t = run string.trimmed "  hello  "  // "hello"
```

#### `capitalized text`
Capitalizes the first character of the string.

```kadence
let c = run string.capitalized "kadence"  // "Kadence"
```

#### `padStart text length char`
Pads the start of the string with `char` until it reaches `length`.

```kadence
let p = run string.padStart "5" 3 "0"  // "005"
```

#### `padEnd text length char`
Pads the end of the string with `char` until it reaches `length`.

```kadence
let p = run string.padEnd "Item" 10 "."  // "Item......"
```

#### `repeated text count`
Repeats the string `count` times.

```kadence
let r = run string.repeated "na" 3  // "nanana"
```

#### `slice text start end`
Extracts a section of the string.

```kadence
let s = run string.slice "hello" 1 4  // "ell"
```

#### `toCamelCase text`
Converts a string to camelCase.

```kadence
let c = run string.toCamelCase "hello world"  // "helloWorld"
```

---

## System Info (stdlib/system.kade)

Utilities for retrieving system information.

### Functions

#### `platform`
Returns the operating system platform.

```kadence
let p = run system.platform  // "win32", "linux", etc.
```

#### `arch`
Returns the CPU architecture.

```kadence
let a = run system.arch  // "x64", "arm64", etc.
```

#### `cpus`
Returns detailed CPU information.

```kadence
let cpus = run system.cpus
```

#### `totalMemory`
Returns the total system memory in bytes.

```kadence
let total = run system.totalMemory
```

#### `freeMemory`
Returns the free system memory in bytes.

```kadence
let free = run system.freeMemory
```

#### `homedir`
Returns the path to the current user's home directory.

```kadence
let home = run system.homedir
```

#### `hostname`
Returns the hostname of the operating system.

```kadence
let host = run system.hostname
```

---

## Testing (stdlib/test.kade)

Testing utilities.

### Functions

#### `suite name callback`
Defines a test suite.

```kadence
run test.suite "Math Tests" () => { ... }
```

#### `assertEquals actual expected message`
Asserts that two values are equal.

```kadence
run test.assertEquals 2 2 "2 should equal 2"
```

#### `assertTrue value message`
Asserts that the value is true.

```kadence
run test.assertTrue (1 < 2) "Math works"
```

#### `assertFalse value message`
Asserts that the value is false.

```kadence
run test.assertFalse (1 > 2) "Math still works"
```

#### `assertThrows fn message`
Asserts that the function throws an error.

```kadence
run test.assertThrows () => { throw "Error" } "Should throw"
```

---

## URL (stdlib/url.kade)

URL Parsing and manipulation.

### Functions

#### `parseUrl urlString`
Parses a URL string into a URL object.

```kadence
let u = run url.parseUrl "https://example.com"
```

#### `buildUrl href`
Creates a URL string from a href (mostly alias for toString on URL object).

```kadence
let s = run url.buildUrl "https://example.com"
```

#### `getSearchParam url name`
Gets the value of a query parameter.

```kadence
let u = run url.parseUrl "https://site.com?q=search"
let q = run url.getSearchParam u "q"  // "search"
```

---

## UUID (stdlib/uuid.kade)

UUID generation and validation.

### Functions

#### `v4`
Generates a random UUID v4 string.

```kadence
let id = run uuid.v4
```

#### `validate uuid`
Checks if the string is a valid UUID.

```kadence
let valid = run uuid.validate id
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
