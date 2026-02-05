# Kadence Examples ♪

This directory contains curated example programs demonstrating the core features of the Kadence language.

## 📂 Curated Examples

### [01_hello_world.kade](../examples/01_hello_world.kade)
The classic introduction. Demonstrates basic output and variable usage.

### [02_control_flow.kade](../examples/02_control_flow.kade)
Showcases decision making and repetition:
*   `if`/`elif`/`else` statements
*   `match` for pattern matching
*   `while` loops and `repeat` blocks

### [03_collections.kade](../examples/03_collections.kade)
Working with data structures:
*   `list` creation and manipulation (`add`, `remove item N from`, `size of`)
*   `for each` iteration
*   `object` literals and property access

### [04_functional.kade](../examples/04_functional.kade)
Modern data transformation using functional patterns:
*   `map` with lambdas
*   `filter` for selection
*   `reduce` for accumulation
*   `range` generation

### [05_web_dom.kade](../examples/05_web_dom.kade)
Expressive web development:
*   `create element` and `set ... class to`
*   Adding children and responding to events (`when ... is clicked`)
*   Component-based logic with functions

### [06_stdlib.kade](../examples/06_stdlib.kade)
Showcase of the extensive Standard Library:
*   `datetime` for simple date manipulation
*   `console` for colorful terminal output
*   `check` for data validation
*   `random` and `color` utilities

---

## 🚀 Running the Examples

You can run any example directly using the Kadence CLI:

```bash
kadence examples/01_hello_world.kade
```

To compile an example to JavaScript (Node.js target):

```bash
kadence -c examples/01_hello_world.kade
```

To compile for the browser:

```bash
kadence -c examples/05_web_dom.kade -o public/app.js --target browser
```

## 🏗️ Showcase Apps

For a complete project structure, check out our demo applications in the `apps/` directory:

*   **[Task Manager](../apps/todo-list)**: A formal project demo with a modern UI, build scripts, and organized directory structure.
