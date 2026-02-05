# Kadence Programming Language 🚀

[![npm version](https://img.shields.io/npm/v/kadence-lang.svg?style=flat-square)](https://www.npmjs.com/package/kadence-lang)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)](https://github.com/kadence-lang/kadence-lang)

**A human-readable programming language that feels like poetry.**

Kadence is designed to make code read like natural English while maintaining the full power of modern programming environments. It bridges the gap between readable intent and high-performance execution by compiling into clean, optimized ES6+ JavaScript.

---

## 🌟 Why Kadence?

*   **Poetic Syntax**: Express logic in sentences, not just symbols.
*   **Zero Punctuation Fatigue**: Minimal requirement for braces, semicolons, or boilerplate.
*   **Modern Power**: Built-in support for Classes, Async/Await, Pattern Matching, and Functional Programming.
*   **Universal**: Run in Node.js for CLI tools or in any modern browser for web apps.
*   **Smart DX**: Intelligent preprocessor for indentation-based blocks with optional `end` keywords.

---

## 🚀 Quick Start

### Try it now (No Install)
Use `npx` to initialize a new Kadence project instantly:

```bash
# For a Web Application (Vite-powered)
npx kadence-lang create my-poetic-app --web

# For a CLI/Node Application
npx kadence-lang create my-poetic-tool
```

### Manual Installation
Install the CLI globally for the best experience:

```bash
npm install -g kadence-lang
```

---

## 📝 The Kadence Experience

Create a file named `intro.kade`:

```kadence
let name be "Kadence"
say "Welcome to {name}!"

let numbers be list 1 2 3 4 5
let avg = average of numbers

if avg more than 3
    say "Success: The average is high! ({avg})"
else
    say "The average is {avg}"
end

// Functional power
let doubled = map numbers with (x) => x * 2
say "Doubled: {doubled}"
```

Run it immediately:
```bash
kadence intro.kade
```

Validate your install with the bundled example:
```bash
kadence examples/01_hello_world.kade
```

---

## 🏗️ Language Features

### Variables & Blocks
Kadence uses `let`, `const`, `be`, and `is` for natural declarations.
```kadence
let mutable be 42
const fixed is "eternal"

// Blocks can be indentation-based or explicit
if status equals "ok"
    say "Proceeding..."
end
```

### Pattern Matching
Modern branching logic that reads like a story.
```kadence
match status_code
    when 200 then say "Success"
    when 404 then say "Not Found"
    else say "Unknown Error"
end
```

### Async/Await
First-class support for the modern web and I/O.
```kadence
async function fetchUser id
    say "Fetching user {id}..."
    let data = await get from "https://api.example.com/users/{id}"
    give data
end
```

### Classes
Clean, readable Object-Oriented programming.
```kadence
class Manager
    function constructor name
        this.name = name
    end

    function greet
        say "Manager {this.name} reports for duty!"
    end
end

let boss = new Manager "Alice"
run boss.greet
```

---

## 📦 Standard Library

Kadence ships with a comprehensive set of modules for common tasks.

| Module | Core Functionality |
| :--- | :--- |
| `list` | `first`, `lastOf`, `shuffle`, `range`, `unique` |
| `string` | `trimmed`, `repeated`, `toCamelCase`, `padStart`, `words` |
| `math` | `clamp`, `randomFloat`, `toRadians`, `hypotenuse` |
| `datetime` | `the time now`, `the date today`, `diffDays`, `toIso` |
| `file` | `readFile`, `writeFile`, `copyDir`, `removeDir`, `stat` |
| `path` | `joinPaths`, `resolve`, `basename`, `dirname`, `extension` |
| `env` | `getEnv`, `hasEnv` (Environment Variables) |
| `process` | `args`, `exit`, `cwd` |
| `system` | `platform`, `arch`, `totalMemory`, `freeMemory` |
| `network` | `serve`, `fetchJson` (Simple HTTP Server) |
| `json` | `readJson`, `writeJson`, `format`, `parseSafe` |
| `check` | `isNumber`, `isString`, `isEmail`, `between` |
| `test` | `suite`, `assertEquals`, `assertTrue`, `assertThrows` |
| `color` | `randomHex`, `rgbToHex`, `hexToRgb` |
| `html` | `div`, `span`, `p`, `img`, `link` (Browser only) |
| `crypto` | `hash`, `randomBytes`, `uuid` |

*Usage Example:*
```kadence
import "stdlib/math.kade" as math
let result = run math.clamp index 0 100
```

---

## 🛠️ Tooling

### VS Code Extension
The official extension provides:
*   ✨ Syntax Highlighting
*   ⌨️ Intelligent Snippets (`if`, `for`, `function`, `class`, `match`)
*   📏 Auto-Indentation

**To install:** Copy the `kadence-vscode` folder to your `.vscode/extensions` directory or search for "Kadence" in the marketplace.

### CLI Commands
```bash
kadence <file>          # Run a file
kadence -c <file>       # Compile to JS
kadence build           # Build project (src -> dist)
kadence dev             # Start dev server (for --web projects)
kadence help            # View all commands
```

---

## 🗺️ Roadmap

- [x] Full Module System (`import`/`export`)
- [x] Standard Library Core (40+ modules)
- [x] Browser Runtime & Vite Plugin
- [x] Source Maps for easy debugging
- [ ] Language Server Protocol (LSP) for enhanced IDE support
- [ ] Integrated Package Registry for Kadence modules
- [ ] Native Mobile Build Target

---

## 🤝 Contributing

We love poetic code. If you want to contribute, please check our [Contributing Guide](docs/CONTRIBUTING.md).

---

## 📄 License

Kadence is released under the **MIT License**.

---

**Made with ❤️ for developers who believe code should be beautiful.**
