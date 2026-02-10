# Kadence User Guide

**A human-readable programming language that feels like poetry.**

Kadence is designed to make code read like natural English while maintaining the full power of modern programming. This guide covers everything you need to know to write, run, and master Kadence.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Basic Syntax](#basic-syntax)
3. [Data Types](#data-types)
4. [Control Flow](#control-flow)
5. [Functions & Scoping](#functions--scoping)
6. [Objects & Classes](#objects--classes)
7. [Module System](#module-system)
8. [Standard Library](#standard-library)
9. [Built-in Language Features](#built-in-language-features)
10. [Web Development](#web-development)
11. [File System](#file-system)
12. [Error Handling](#error-handling)
13. [Debugging](#debugging)
14. [Philosophy](#philosophy)

---

## Getting Started

### Installation

Kadence runs on Node.js. Install it globally via npm:

```bash
npm install -g kadence-lang
```

### CLI Usage

Initialize a project:
```bash
kadence init
```

Run a specific file:
```bash
kadence src/main.kade
```

Debug with Source Maps:
```bash
kadence src/main.kade --sourcemap
```

Compile a file to JS:
```bash
kadence -c src/main.kade -o dist/main.js
```

Build the entire project (src -> dist):
```bash
kadence build
```

Start the interactive REPL:
```bash
kadence
```

---

## Basic Syntax

### Comments

Kadence supports two types of comments:

```kadence
// This is a standard line comment
note: This is a poetic note comment
```

Variables are mutable, constants are fixed. You can use standard `=` or the more poetic `be` and `is`.

```kadence
let name be "Kadence"      // Mutable
const version is "0.2.4"   // Immutable
```

### Blocks & Indentation

Kadence uses an intelligent preprocessor. You can use **indentation** or the **end** keyword to define blocks. They can even be mixed!

**Indentation Style:**

```kadence
if x equals 10
    echo "It is ten!"
```

**Explicit Style:**

```kadence
if x equals 10
    echo "It is ten!"
end
```

---

## Data Types

### Numbers & Booleans

Numbers are 64-bit floats. Booleans are `true` or `false`.

```kadence
let pi = 3.14
let isActive = true
```

### Strings

Strings support interpolation using `{}` and escaping with `\`.

```kadence
let user = "Kadence"
let msg = "Hello, {user}!"
let path = "C:\\Users\\Guest"
```

### Lists

Lists are comma-free and dynamic. Indices are 0-based.

```kadence
let fruits = list "apple" "banana" "cherry"
add "mango" to fruits
remove item 0 from fruits
```

### Objects

Objects are natural and clean.

```kadence
let person = object
    name: "Alex"
    age: 25
end
```

---

## Control Flow

### Output

Use `say`, `echo`, `print`, or `post` to output values. `say` is preferred for a natural reading flow.

```kadence
say "Hello World"
echo "Status: OK"
print "Printing..."
post "Posting to console"
```

### Comparisons

Kadence supports both natural words and mathematical symbols.

- `equals` or `=`
- `not equals` or `!=`
- `more than` or `>`
- `at least` or `>=`
- `less than` or `<`
- `at most` or `<=`

### Conditionals

```kadence
if score more than 90
    say "A+"
elif score more than 80
    say "B"
else
    say "Keep studying!"
end
```

### Loops

**While Loop:**

```kadence
while x less than 10
    increment x
end
```

**For Each Loop (Iteration):**

```kadence
for each item in inventory
    echo item
end
```

**Repeat Loop:**

```kadence
repeat 5 times
    echo "Hello!"
end
```

### Pattern Matching

The `match` statement is a powerful alternative to switch/case. Use it for status codes, enums, or any value-based branching.

```kadence
match status
    when 200 then echo "OK"
    when 404 then echo "Not Found"
    else echo "Unknown"
end
```

You can match on any expression (numbers, strings, variables). The `else` branch runs when no `when` clause matches. Use `then` for single-statement branches; for multiple statements, put them on the next lines after `then` or use a block.

```kadence
match task.priority
    when "high" then echo "Urgent!"
    when "low" then echo "Whenever."
    else echo "Normal priority."
end
```

---

## Functions & Scoping

### Synchronous Functions

```kadence
function greet name
    say "Hello, {name}!"
end

greet("World") // Parentheses style
run greet "World" // Classic style
```

### Async Functions & Await

Kadence handles asynchronous tasks elegantly. Mark a function with `async` and use `await` inside it for promises (e.g. HTTP, timers).

```kadence
async function getData
    let result = await get from "https://api.example.com"
    return result
end
```

Call async functions with `run`; they return a Promise. Use `await` only inside another `async` function. Combine with `wait N seconds` for delays.

```kadence
async function delayedGreeting name
    wait 1 second
    return "Hello, {name}!"
end

let p = run delayedGreeting "Kadence"
// p is a Promise; await p in an async context to get the value
```

---

## Objects & Classes

### Object Literals

Create ad-hoc data with `object { key: value }` or the block form.

```kadence
let person = object { name: "Alex", age: 30 }
echo person.name
person.age = 31
```

### Class Declarations

Define reusable types with `class Name`, a `constructor`, and methods. Use `this` for instance state and `new ClassName args` to create instances.

```kadence
class Puppy
    function constructor name
        this.name = name
    end

    function bark
        echo "{this.name} says: Woof!"
    end
end

let myDog = new Puppy "Max"
run myDog.bark
```

Classes can hold lists or objects in `this` and expose methods that use `match`, loops, and built-ins. See `examples/manager.kade` for a full TaskManager example.

---

## Module System

Kadence allows you to organize your code into reusable modules.

### Exporting

Use the `export` keyword before any declaration to make it available to other files.

```kadence
// mathLib.kade
export function add x y
    return x + y
end

export const version = "1.0.0"
```

### Importing

You can import everything into a namespace or import specific names.

**Import All (with alias):**

```kadence
import "mathLib.kade" as math
echo math.version
let res = run math.add 10 5
```

**Import Named:**

```kadence
import { add, version } from "mathLib.kade"
echo version
let res = run add 10 5
```

_Note: Kadence automatically handles resolving `.kade` paths to their compiled `.js` versions during execution._

---

## Standard Library

### Importable stdlib modules

The `stdlib/` folder ships with Kadence and provides optional modules you can import:

- **stdlib/array.kade** – `flatten`, `zip`, `chunk`, `partition`, `take`, `drop`, `reverse`, `findIndex`
- **stdlib/async.kade** – `delay`, `timeout`, `retry`, `debounce`, `throttle`, `parallel`, `race`, `sequential`, `waterfall`, `batch`
- **stdlib/check.kade** – `isNumber`, `isString`, `isList`, `isObject`, `isEmail`, `isUrl`, `between`, `isDefined`, `isNull`
- **stdlib/color.kade** – `rgb`, `rgba`, `hexToRgb`, `randomHex`, `lighten`, `darken`
- **stdlib/console.kade** – `log`, `error`, `warn`, `clear`, `table`, `red`, `green`, `blue`, `bold`, `dir`, `startTimer`, `endTimer`, `group`, `groupEnd`
- **stdlib/crypto.kade** – `hash`, `randomBytes` (Node.js)
- **stdlib/datetime.kade** – `currentTime`, `today`, `timestamp`, `year`, `month`, `day`, `toIso`, `fromTimestamp`, `addDays`, `format`, `parseDate`, `diffDays`, `diffMs`, `addHours`
- **stdlib/encoding.kade** – `base64Encode`, `base64Decode`, `urlEncode`, `urlDecode`
- **stdlib/env.kade** – `getEnv`, `hasEnv`
- **stdlib/file.kade** – `listDir`, `exists`, `mkdir`, `append`, `unlink`, `readFile`, `writeFile`, `copyFile`, `rename`
- **stdlib/format.kade** – `currency`, `formatNumber`, `percentage`, `fileSize`, `ordinal`, `plural`, `truncate`, `ellipsis`, `padNumber`, `phoneNumber`, `titleCase`, `snakeCase`, `kebabCase`
- **stdlib/html.kade** – `div`, `span`, `p`, `h1`, `h2`, `link`, `img`, `tag`, `tagWithAttrs`
- **stdlib/list.kade** – `first`, `lastOf`, `isEmpty`, `length`, `has`, `unique`, `take`, `drop`, `chunk`, `flatten`, `zip`, `indexOf`, `lastIndexOf`, `sum`, `averageOf`
- **stdlib/map.kade** – `keys`, `values`, `entries`, `hasKey`, `merge`, `pick`, `omit`, `mapValues`, `mapKeys`, `invert`, `deepClone`, `getPath`, `defaults`, `isEmpty`, `fromPairs`
- **stdlib/math.kade** – `hypotenuse`, `areaOfCircle`, `isEven`, `clamp`, `randomFloat`, `toDegrees`, `toRadians`, `roundTo`, `minOf`, `maxOf`
- **stdlib/number.kade** – `parseNumber`, `formatNumber`, `isNaNVal`, `isFiniteVal`
- **stdlib/object.kade** – `hasKey`, `getKeys`, `getValues`, `mergeObjects`, `pick`, `omit`, `deepClone`, `getPath`, `defaults`
- **stdlib/path.kade** – `pathJoin`, `dirname`, `basename`, `extname`, `resolve`
- **stdlib/process.kade** – `exit`, `argv`, `readLine`
- **stdlib/promise.kade** – `promiseAll`, `promiseRace`, `delay`, `retry`
- **stdlib/random.kade** – `integer`, `boolean`, `choice`, `shuffle`
- **stdlib/regex.kade** – `test`, `replaceAll`
- **stdlib/set.kade** – `union`, `intersection`, `difference`, `symmetricDifference`, `isSubset`, `isSuperset`, `areDisjoint`, `cartesianProduct`
- **stdlib/string.kade** – `words`, `lines`, `trimmed`, `capitalized`, `isEmpty`, `joinWithSpace`, `repeatStr`, `truncate`, `padStart`, `padEnd`, `slugify`, `escapeHtml`
- **stdlib/test.kade** – `suite`, `assertEquals`, `assertTrue`, `assertFalse`, `assertApprox`, `assertThrows`
- **stdlib/url.kade** – `parseUrl`, `buildUrl`, `getSearchParam`
- **stdlib/uuid.kade** – `v4`, `validate`
- **stdlib/validation.kade** – `isEmail`, `isUrl`, `isNumeric`, `isAlpha`, `isAlphanumeric`, `isInteger`, `isPositive`, `isNegative`, `isInRange`, `isLength`, `isBlank`, `isNotEmpty`, `isHexColor`, `isIpAddress`, `isPhoneNumber`, `isCreditCard`, `isStrongPassword`

Example:

```kadence
import "stdlib/list.kade" as list
let nums = list 10 20 30
echo run list.first nums   // 10
echo run list.lastOf nums   // 30
```

### Module Reference
For a complete list of functions, signatures, and examples for every module, please see the [Standard Library Reference](STDLIB_REFERENCE.md).

---

## Built-in Language Features

Unlike the Standard Library which requires an `import`, the following features are built directly into the Kadence syntax for maximum performance and readability.

```kadence
let s = "  hello world  "
let t = trim s
let parts = split t by " "
let joined = join parts with "-"
```

### Functional Array Methods

Kadence supports modern functional tools with a natural syntax.

```kadence
let nums = list 1 2 3 4 5
let doubled = map nums with x => x * 2
let evens = filter nums where x => x more than 2
let sum = reduce nums from 0 with (acc, x) => acc + x
```

### Math Utilities

```kadence
let pi = 3.14159
echo round pi            // 3
echo floor pi            // 3
echo ceiling pi          // 4
echo square root 16      // 4
echo power 2 to 3        // 8
echo absolute (0 - 5)    // 5
echo sin 0               // 0
```

### Time & Date

```kadence
echo the time now        // "11:23:45 AM"
echo the date today      // "2/1/2026"
```

### List & Object Utilities

```kadence
let nums = list 3 1 2
let s = sort nums        // [1, 2, 3]
let r = reverse nums     // [2, 1, 3]
push 4 to nums           // [2, 1, 3, 4]
let last = pop from nums // 4

let obj = object { a: 1, b: 2 }
let ks = keys of obj     // ["a", "b"]
let vs = values of obj   // [1, 2]
let m = merge obj with extras
```

### HTTP & JSON

```kadence
let data = get from "https://api.github.com/users/octocat"
let jsonStr = stringify data to json
let obj = parse json from jsonStr
```

---

## Web Development

Kadence shines in the browser.

```kadence
let btn be create element "button"
set btn text to "Click Me"
set btn class to "btn-primary"

when btn is clicked
    say "Button was pressed!"
end
```

---

## File System

Direct I/O for simple scripts.

```kadence
save "Some content" to "note.txt"
let content = read from "note.txt"
```

---

## Error Handling

Use `try` and `catch error` to handle runtime errors (e.g. invalid JSON, failed HTTP).

```kadence
try
    let data = parse json from "invalid"
catch error
    echo "Oops: {error}"
end
```

The `catch error` block receives the error value (often a message string). Code after the try/catch runs normally if no error is thrown.

---

## Debugging

Compile with `--sourcemap` to generate a source map (`.map` file) so stack traces and debuggers show Kadence source lines instead of compiled JavaScript:

```bash
kadence -c script.kade -o script.js --sourcemap
```

When you run a file with `kadence script.kade --sourcemap`, runtime errors will reference the Kadence file. You can also run compiled JS with `node --enable-source-maps script.js` to get Kadence line numbers in stack traces.

---

## Philosophy

Kadence believes that **Readability matters**. Code is written for humans first, and machines second. By combining natural language keywords with a powerful preprocessor, Kadence allows you to stay in the "flow" of logic without being bogged down by syntax punctuation.
