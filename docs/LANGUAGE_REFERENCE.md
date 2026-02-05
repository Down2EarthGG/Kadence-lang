# Kadence Language Reference

**Version 0.2.0**

Kadence is a poetic, high-level programming language that transpiles to JavaScript. It is designed for maximum readability, making code feel like natural prose while retaining the power of modern systems.

---

## 1. Syntax Fundamentals

### 1.1 Comments
- **Line Comment**: `// comment` - Standard single-line comment.
- **Note Comment**: `note: comment` - A more descriptive, poetic comment style.
- **Block Comment**: Not explicitly supported (use multiple line comments).

### 1.2 Blocks and Indentation
Kadence supports two primary block styles:
- **Indentation-based**: Blocks are defined by their indentation level (similar to Python).
- **Keyword-based**: Blocks are terminated with the `end` keyword (similar to Ruby/Lua).
*Note: The preprocessor handles translation between these styles automatically.*

---

## 2. Variables and State

### 2.1 Declarations
- **Mutable**: `let [name] be [value]` or `let [name] = [value]`
- **Immutable**: `const [name] is [value]` or `const [name] = [value]`

### 2.2 Assignment
- **Standard**: `[variable] = [value]`
- **Poetic**: `[variable] be [value]`
- **Property Set**: `set [property] of [object] to [value]`
- **Direct Set**: `set [object].[property] to [value]` or `set [variable] to [value]`

### 2.3 Destructuring
Kadence supports modern destructuring patterns:
- **Objects**: `let { name, age } = user`
- **Lists**: `let [ first, second ] = items`

---

## 3. Data Types

### 3.1 Primitives
- **Number**: 64-bit floating point (e.g., `10`, `3.14`).
- **String**: Template literals with interpolation (e.g., `"Hello {name}"`).
- **Boolean**: `true` or `false`.
- **Null/Undefined**: `null`, `undefined`.

### 3.2 Collections
- **List**: `list [v1] [v2] ...` - A comma-free array.
- **Object**: `object { key: val }` - Flexible key-value maps. 
  - Supports **shorthand**: `object { name }` (equivalent to `{ name: name }`).
  - Supports **spread**: `object { ...other }`.

---

## 4. Control Flow

### 4.1 Conditionals
- **If Statement**:
  ```kadence
  if [condition]
      [statements]
  elif [condition]
      [statements]
  else
      [statements]
  end
  ```

### 4.2 Comparisons
| Natural | Symbolic | Meaning |
|---------|----------|---------|
| `equals` | `==` | Equality |
| `not equals` | `!=` | Inequality |
| `more than` | `>` | Greater than |
| `less than` | `<` | Less than |
| `at least` | `>=` | Greater or equal |
| `at most` | `<=` | Less or equal |

### 4.3 Logic Operators
- `and`, `or`, `not` (aliases for `&&`, `||`, `!`)

### 4.4 Property Checks
- **Has**: `[object] has "[property]"` returns true if the property exists on the object.
  ```kadence
  if user has "admin"
      say "Welcome, Admin"
  end
  ```

### 4.5 Loops
- **While**: `while [condition] ... end`
- **For**: `for [item] in [collection] ... end` (optional `each` keyword: `for each x in list`)
- **Repeat**: `repeat [number] times ... end`

### 4.6 Pattern Matching
- **Match**:
  ```kadence
  match [expression]
      when [value] then [statement]
      else [statement]
  end
  ```

---

## 5. Functions and Classes

### 5.1 Functions
- **Declaration**: `function [name] [params] ... end`
- **Execution**:
  - `[name]([args])` - Modern parentheses style.
  - `run [name] [args]` - Classic command style.
- **Return**: `give [value]` or `return [value]`

### 5.2 Async/Await
- **Async Function**: `async function [name] ... end`
- **Await**: `await [expression]`

### 5.3 Classes
- **Declaration**:
  ```kadence
  class [Name]
      function constructor [params] ... end
      function [method] [params] ... end
  end
  ```
- **Instantiation**: `new [ClassName]([args])`
- **Context**: `this` refers to the current instance.

---

## 6. Built-in Operations

### 6.1 Output
- `say [expression]`
- `echo [expression]`
- `print [expression]`
- `post [expression]`

### 6.2 Web/DOM (Browser Target)
- `create element "[tag]"`
- `add [child] to [parent]`
- `set [attr] of [element] to [value]`
- `when [element] is [event] ... end`

### 6.3 Standard Library Utilities
- **Math**: `round`, `floor`, `ceiling`, `square root`, `average of`, `minimum of`.
- **Lists**: `sort`, `reverse`, `push [val] to [list]`, `pop from [list]`.
- **Objects**: `keys of [obj]`, `values of [obj]`, `merge [obj1] with [obj2]`.
- **String**: `trim`, `split [str] by [sep]`, `join [list] with [sep]`.

---

## 7. Module System

### 7.1 Exporting
- `export [declaration]`

### 7.2 Importing
- `import "[path]" as [alias]`
- `import { [names] } from "[path]"`

---

## 8. Error Handling
- **Try/Catch**:
  ```kadence
  try
      [risky statements]
  catch [errorId]
      [handling statements]
  end
  ```
