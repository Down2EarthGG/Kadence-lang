# Contributing to Kadence

Thank you for your interest in contributing to Kadence! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/kadence-lang.git`
3. Install dependencies: `npm install`
4. Make your changes
5. Test your changes: `npm test`
6. Submit a pull request

## Development Setup

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run the demo
npm run demo

# Test the CLI
node kadence.js showcase.kade
```

## Project Structure

```
my-project/
├── kadence.json         # Project configuration
├── package.json         # npm dependencies
├── src/                 # Your Kadence source files (.kade)
│   └── main.kade
├── dist/                # Compiled JavaScript output
├── stdlib/              # Kadence standard library
└── node_modules/        # External JS packages
```

## Adding New Features

### 1. Update the Grammar

Edit the grammar in `compiler.js`:

```javascript
const grammarSource = `
  Kadence {
    // Add your grammar rules here
  }
`;
```

### 2. Add Semantic Actions

Add the transpilation logic:

```javascript
const semantics = grammar.createSemantics().addOperation("toJS", {
  YourNewRule(...args) {
    return `/* JavaScript code */`;
  },
});
```

### 3. Update Keywords

If adding new keywords, update the keyword list:

```javascript
keyword = ("function" | "let" | ... | "yournewkeyword") ~(letter | digit | "_")
```

### 4. Add Tests

Create a test file demonstrating the new feature:

```kadence
note: Test for new feature
let result = your new feature here
echo result
```

### 5. Update Documentation

- Add examples to `EXAMPLES.md`
- Update `README.md` if it's a major feature
- Update VS Code extension syntax highlighting if needed

### 6. Syntax highlighting (keywords, operators, builtins)

When adding or changing Kadence keywords, operators, or built-in names:

1. Update **kadence-vscode/kadence-syntax-data.json** first (single source of truth).
2. Keep **kadence-vscode/syntaxes/kadence.tmLanguage.json** (VS Code TextMate grammar) in sync.
3. Keep the Prism Kadence definitions in **apps/landing-page/public/index.html** in sync (keyword, operator, and builtin regexes).

This avoids drift between the editor and the web docs.

## Code Style

- Use clear, descriptive variable names
- Add comments for complex logic
- Keep functions focused and single-purpose
- Follow existing code patterns

## Testing

Before submitting:

1. Test your changes with multiple `.kade` files
2. Verify the transpiled JavaScript is correct
3. Check that existing tests still pass
4. Add new tests for your feature

## Pull Request Process

1. Update documentation
2. Add tests
3. Ensure all tests pass
4. Write a clear PR description explaining:
   - What the change does
   - Why it's needed
   - How to test it

## Ideas for Contributions

- **Language Features**: New statements, expressions, or operators
- **Standard Library**: Built-in functions for common tasks
- **Tooling**: Better error messages, debugging tools
- **Documentation**: Tutorials, examples, guides
- **VS Code Extension**: More snippets, better highlighting
- **Performance**: Optimization of the compiler
- **Bug Fixes**: Fix reported issues

## Questions?

Feel free to open an issue for:

- Bug reports
- Feature requests
- Questions about the codebase
- Discussion about language design

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make Kadence better! 🌟
