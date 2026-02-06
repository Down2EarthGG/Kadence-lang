const ohm = require("ohm-js");
const { SourceNode } = require("source-map");

/**
 * Pre-processor to convert indentation-based blocks into brace-based blocks.
 * Handles both standard indentation and 'end'-terminated blocks.
 */
function preprocess(code) {
  // Strip carriage returns to handle Windows line endings consistently
  code = code.replace(/\r/g, "");
  const lines = code.split("\n");
  let result = "";
  let indentStack = [0];
  let inBacktickString = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for backticks to toggle string state
    // We remove escaped backticks to avoid false counts
    const cleanLine = line.replace(/\\`/g, "__");
    const backTickCount = (cleanLine.match(/`/g) || []).length;

    const wasInString = inBacktickString;
    if (backTickCount % 2 !== 0) {
      inBacktickString = !inBacktickString;
    }
    const willBeInString = inBacktickString;

    // If we started inside a string, preserve it exactly and skip indentation logic
    if (wasInString) {
      result += line + "\n";
      continue;
    }

    const trimmed = line.trim();

    if (trimmed.length === 0) {
      result += "\n";
      continue;
    }

    const currentIndent = line.search(/\S/);
    let lastIndent = indentStack[indentStack.length - 1];

    // Block-continuation keywords (else, elif, when) stay inside the current block - don't pop when dedenting to them
    const _isBlockContinuation = /^(else|elif|when\s)/.test(trimmed);

    // Handle dedentation based on indentation level or 'end' keyword
    if (currentIndent < lastIndent || trimmed === "end") {
      while (
        indentStack.length > 1 &&
        (currentIndent < indentStack[indentStack.length - 1] || trimmed === "end")
      ) {
        result += "}\n";
        indentStack.pop();
        if (trimmed === "end" && indentStack[indentStack.length - 1] <= currentIndent) break;
      }
      if (trimmed === "end") continue;
      // User wrote "}" or "})" on its own line; we already emitted "}" from the stack, so skip adding the line
      if (trimmed === "}") continue;
      if (trimmed === "})") {
        result += ")\n";
        continue;
      }
    }

    // Add the line itself
    result += line;

    // If we are about to enter a multi-line string, DO NOT generate a block
    if (willBeInString) {
      result += "\n";
      continue;
    }

    // Check if we should add an opening brace
    let nextIndent = -1;
    for (let j = i + 1; j < lines.length; j++) {
      const nextTrimmed = lines[j].trim();

      // We must handle the case where next line is inside a string?
      // But we can't easily peek state. 
      // Simplified assumption: Indentation of next NON-EMPTY line determines block.

      if (nextTrimmed.length > 0) {
        if (nextTrimmed === "end") {
          nextIndent = currentIndent;
        } else {
          nextIndent = lines[j].search(/\S/);
        }
        break;
      }
    }

    if (nextIndent > currentIndent && !trimmed.endsWith("{")) {
      result += " {\n";
      indentStack.push(nextIndent);
    } else if (nextIndent > currentIndent && trimmed.endsWith("{")) {
      indentStack.push(nextIndent);
      result += "\n";
    } else {
      result += "\n";
    }
  }

  // Close any remaining blocks
  while (indentStack.length > 1) {
    result += "}\n";
    indentStack.pop();
  }

  return result;
}

const grammarSource = `
Kadence {
  Program = (FunctionDecl | Statement)+
  
  Statement = ClassDecl
            | AsyncFunctionDecl
            | FunctionDecl
            | VariableDecl
            | ConstantDecl
            | Assignment
            | ImportStmt
            | ExportStmt
            | WebStmt
            | ListStmt
            | SetStmt
            | FileStmt
            | NavigateStmt
            | TryStmt
            | IfStmt
            | MatchStmt
            | WhileStmt
            | ForStmt
            | RepeatStmt
            | WhenStmt
            | WaitStmt
            | IncrementStmt
            | DecrementStmt
            | BreakStmt
            | ContinueStmt
            | ReturnStmt
            | EchoStmt
            | ExpressionStmt

  BreakStmt = "break"
  ContinueStmt = "continue"

  ImportStmt = "import" string "as" identifier -- all
             | "import" "{" ListOf<identifier, ","> "}" "from" string -- named
  ExportStmt = "export" "default" Expression -- default
             | "export" Declaration      -- named
  Declaration = FunctionDecl | AsyncFunctionDecl | ClassDecl | VariableDecl | ConstantDecl

  ClassDecl = "class" identifier ("extends" identifier)? "{" (MethodDecl | PropertyDecl)* "}"
  MethodDecl = "static"? "private"? "function" identifier Param* Block
  PropertyDecl = "static"? "private"? identifier "=" Expression
  
  AsyncFunctionDecl = "async" "function" identifier "(" ListOf<Param, ","> ")" Block -- paren
                    | "async" "function" identifier Param* Block -- classic
  FunctionDecl = "function" identifier "(" ListOf<Param, ","> ")" Block -- paren
               | "function" identifier Param* Block -- classic
  
  Param = "..." word -- rest
        | word "=" Expression -- default
        | word -- base

  VariableDecl = "let" BindingPattern ("=" | "be") Expression
  ConstantDecl = "const" BindingPattern ("=" | "be" | "is") Expression
  
  BindingPattern = "{" ListOf<word, ","> "}" -- object
                 | "[" ListOf<word, ","> "]" -- list
                 | identifier -- base

  Assignment = MemberAccess ("=" | "be") Expression  -- simple
             | BindingPattern ("=" | "be") Expression            -- destructure
  
  ReturnStmt = ("return" | "give") Expression
   IncrementStmt = "increment" MemberAccess -- word
                 | MemberAccess "++"          -- sym
   DecrementStmt = "decrement" MemberAccess -- word
                 | MemberAccess "--"          -- sym

  WaitStmt = "wait" Expression ("seconds" | "second")
  NavigateStmt = "go" "to" Expression
  RepeatStmt = "repeat" Expression ("times" | "time") Block
  
  TryStmt = "try" Block "catch" identifier Block
  MatchStmt = "match" Expression "{" MatchCase+ MatchElse? "}"
  MatchCase = "when" Expression "then" Statement
  MatchElse = "else" Statement
  
  SetStmt = "set" PropTerm "of" MemberAccess "to" Expression -- style
          | "set" MemberAccess PropTerm "to" Expression       -- prop
          | "set" MemberAccess "to" Expression               -- simple
  PropTerm = "text" | "size" | "color" | "class" | "background" | "value" | identifier
  FileStmt = "save" Expression "to" string -- save
           | "read" "from" string        -- read
  
  ForStmt = "for" "each"? identifier "in" Expression Block
  WhenStmt = "when" MemberAccess "is" identifier Block

  ListStmt = "add" Expression "to" MemberAccess     -- add
           | "remove" "item" Expression "from" MemberAccess -- remove_at

  WebStmt = "create" "element" string           -- create
          | "add" MemberAccess "to" MemberAccess       -- add_child

  IfStmt = "if" Expression Block ("elif" Expression Block)* ("else" Block)?
  WhileStmt = "while" Expression Block
  EchoStmt = ("echo" | "say" | "print" | "post") Expression
  ExpressionStmt = Expression

  Block = "{" Statement* "}"

  Expression = RunCall | AwaitExpr | NewExpr | CreateExpr | ObjectLiteral | SpreadExpr | TypeofExpr | CoalesceExpr
  
  RunCall = "run" MemberAccess Arg*
  
  NewExpr = "new" identifier "(" ListOf<Expression, ","> ")" -- paren
          | "new" identifier Arg* -- classic
  CreateExpr = "create" "element" string -- call
  AskExpr = "ask" string
  SizeExpr = "size" "of" Expression
  RandomExpr = "random" "number" "from" Expression "to" Expression -- range
             | "random" -- float
  TransformExpr = ("uppercase" | "lowercase") Primary
  
  MathExpr = kw<"average"> kw<"of"> Expression -- average
           | kw<"minimum"> kw<"of"> Expression -- min
           | kw<"maximum"> kw<"of"> Expression -- max
           | kw<"round"> Expression -- round
           | kw<"floor"> Expression -- floor
           | kw<"ceiling"> Expression -- ceil
           | kw<"absolute"> Expression -- abs
           | kw<"square"> kw<"root"> Expression -- sqrt
           | kw<"power"> Expression kw<"to"> Expression -- pow
           | kw<"sin"> Expression -- sin
           | kw<"cos"> Expression -- cos
           | kw<"tan"> Expression -- tan

  ListExpr = kw<"sort"> Expression -- sort
           | kw<"reverse"> Expression -- reverse
           | kw<"push"> Expression kw<"to"> Expression -- push
           | kw<"pop"> kw<"from"> Expression -- pop

  ObjectExpr = kw<"keys"> kw<"of"> Expression -- keys
             | kw<"values"> kw<"of"> Expression -- values
             | kw<"merge"> Expression kw<"with"> Expression -- merge
  ReadExpr = "read" "from" string
  TimeExpr = "the" "time" "now"   -- time
           | "the" "date" "today" -- date
  ConvertExpr = "convert" Expression "to" TypeTerm
  
  // New feature expressions
  AwaitExpr = "await" Expression
  ObjectLiteral = "object"? "{" ListOf<ObjectPair, ","?> "}"
  ObjectPair = (word | string) ":" Expression -- pair
             | word -- shorthand
             | SpreadExpr -- spread
  
  ArrayMethod = map_kw Expression "with" Lambda              -- map
              | filter_kw Expression "where" Lambda          -- filter
              | reduce_kw Expression "from" Expression "with" Lambda  -- reduce
              | find_kw Expression "where" Lambda            -- find
              | some_kw Expression "where" Lambda            -- some
              | every_kw Expression "where" Lambda           -- every
  
  StringCmd = split_kw Expression "by" Expression         -- split
            | join_kw Expression "with" Expression        -- join
            | trim_kw Expression                          -- trim
            | replace_kw Expression "with" Expression "in" Expression  -- replace
            | kw<"index"> kw<"of"> Expression kw<"in"> Expression    -- indexOf
            | kw<"last"> kw<"index"> kw<"of"> Expression kw<"in"> Expression -- lastIndexOf
  
  HttpExpr = "get" "from" Expression                        -- get
           | "post" "to" Expression "with" Expression       -- post
           | "put" "to" Expression "with" Expression        -- put
           | "delete" "from" Expression                     -- delete
  
  JsonExpr = "parse" "json" "from" Expression               -- parse
           | "stringify" Expression "to" "json"             -- stringify
  
  RegexExpr = "regex" string                                -- create
            | "extract" "all" Expression "from" Expression  -- extractAll
  
  SpreadExpr = "..." Expression
  RangeExpr = "range" Expression "to" Expression
  
  Lambda = identifier "=>" (Block | Expression)                       -- simple
         | "(" ListOf<identifier, ","> ")" "=>" (Block | Expression)  -- multi

  TypeofExpr = "typeof" Expression

  CoalesceExpr = CoalesceExpr "??" OrExpr -- coalesce
               | OrExpr

  OrExpr = OrExpr "or" AndExpr   -- word
         | OrExpr "||" AndExpr   -- sym
         | AndExpr

  AndExpr = AndExpr "and" NotExpr -- word
          | AndExpr "&&" NotExpr  -- sym
          | NotExpr

  NotExpr = "not" Comparison     -- word
          | "!" Comparison       -- sym
          | Comparison

  Comparison = StringCheck      -- string_check
             | PropertyCheck    -- property_check
             | TypeCheck        -- type_check
             | BitwiseOr CompareOp BitwiseOr  -- full
             | CompareOp BitwiseOr           -- short
             | BitwiseOr                     -- base
  
  PropertyCheck = Additive "has" Additive
  
  TypeCheck = Additive "is" article TypeTerm
  TypeTerm = "number" | "string" | "list" | "bool" | "object" | identifier
  article = ("an" | "a") ~idchar

  StringCheck = Additive includes_kw Additive           -- includes
              | Additive "starts" "with" Additive       -- startsWith
              | Additive "ends" "with" Additive         -- endsWith
              | MatchCheck                              -- match
  
  MatchCheck = Additive "matches" Additive

  CompareOp = "=="              -- eq_sym_double
            | "="               -- eq_sym
            | "equals"          -- eq_word
            | "!="              -- neq_sym
            | "not" "equals"    -- neq_word
            | ">"               -- gt_sym
            | "more" "than"     -- gt_word
            | "<"               -- lt_sym
            | "less" "than"     -- lt_word
            | ">="              -- gte_sym
            | "at" "least"      -- gte_word
            | "<="              -- lte_sym
            | "at" "most"       -- lte_word

  Additive = Additive "plus" Multiplicative   -- add_word
           | Additive "+" Multiplicative      -- add_sym
           | Additive "minus" Multiplicative  -- sub_word
           | Additive "-" Multiplicative      -- sub_sym
           | Multiplicative

  BitwiseShift = BitwiseShift "<<" Additive -- left
               | BitwiseShift ">>" Additive -- right
               | Additive

  BitwiseAnd = BitwiseAnd "&" BitwiseShift -- bin
             | BitwiseShift

  BitwiseXor = BitwiseXor "^" BitwiseAnd -- bin
             | BitwiseAnd

  BitwiseOr = BitwiseOr "|" BitwiseXor -- bin
            | BitwiseXor

  Multiplicative = Multiplicative "*" Primary   -- mul_sym
                 | Multiplicative "times" Primary -- mul_word
                 | Multiplicative "/" Primary   -- div
                 | Multiplicative "divided" "by" Primary -- div_word
                 | Primary

  Primary = List                -- list
          | Lambda              -- lambda
          | ItemAccess          -- access
          | MathExpr            -- math
          | StringCmd           -- string
          | ArrayMethod         -- arrayay
          | ListExpr            -- list_op
          | ObjectExpr          -- object
          | JsonExpr            -- json
          | HttpExpr            -- http
          | AskExpr             -- ask
          | SizeExpr            -- size
          | RandomExpr          -- random
          | ReadExpr            -- read
          | TimeExpr            -- time
          | ConvertExpr         -- convert
          | RegexExpr           -- regex
          | RangeExpr           -- range
          | TransformExpr       -- transform
          | Call                -- call
          | MemberAccess        -- member
          | "pi"                -- pi
          | number              -- num
          | bool                -- bool
          | "null"              -- null
          | "undefined"         -- undefined
          | string              -- str
          | "(" Expression ")"  -- paren

  MemberAccess = "this"                        -- this
               | "super"                       -- super
               | identifier MemberAccessSeg*   -- chain

  MemberAccessSeg = "." word  -- prop
                  | "[" Expression "]"  -- index
                  | "?." word  -- opt_prop
                  | "?." "[" Expression "]"  -- opt_index

  List = "list" Arg*
  ItemAccess = "item" Primary "from" Primary

  // Call uses parentheses or 'run' keyword
  Call = MemberAccess "(" ListOf<Expression, ","> ")" -- paren
       | "run" MemberAccess Arg*                      -- run
  
  Arg = Lambda | List | identifier | number | bool | string | "(" Expression ")" -- paren

  bool = "true" | "false"
  word = (letter | "_") (letter | digit | "_")*
  identifier = ~keyword word
  idchar = letter | digit | "_"
  kw<word> = word ~idchar
  
  // Lexical keywords for method-like expressions
  map_kw = "map" ~idchar
  filter_kw = "filter" ~idchar
  reduce_kw = "reduce" ~idchar
  find_kw = "find" ~idchar
  some_kw = "some" ~idchar
  every_kw = "every" ~idchar
  split_kw = "split" ~idchar
  join_kw = "join" ~idchar
  trim_kw = "trim" ~idchar
  includes_kw = "includes" ~idchar
  replace_kw = "replace" ~idchar
    keyword = ("function" | "let" | "const" | "if" | "elif" | "else" | "end" | "while" | "for" | "in" | "return" | "break" | "continue" | "try" | "catch" | "async" | "await" | "new" | "this" | "super" | "true" | "false" | "null" | "undefined" | "class" | "extends" | "static" | "private" | "import" | "export" | "switch" | "case" | "default" | "delete" | "void" | "typeof" | "instanceof" | "do" | "yield" | "throw" | "finally" | "debugger" | "var" | "enum" | "public" | "protected" | "interface" | "implements" | "package" | "list" | "random" | "match" | "then" | "add" | "echo" | "say" | "print" | "post" | "run" | "repeat" | "times" | "time") ~(letter | digit | "_")
  number = digit+ ("." digit+)?
  
  string = doubleString | templateString
  doubleString = "\\"" (escape | interpolation | textDouble)* "\\""
  templateString = "\`" (escape | interpolation | textBacktick)* "\`"
  
  escape = "\\\\" any
  interpolation = "{" (~"}" any)* "}"
  
  textDouble = (~("\\"" | "{" | "\\\\") any)+
  textBacktick = (~("\`" | "{" | "\\\\") any)+
  
  space += "//" (~"\\n" any)*  -- comment
         | "note" ":"? (~"\\n" any)* -- note_comment
}
`;

const grammar = ohm.grammar(grammarSource);

let compileOptions = { target: "node", sourceFile: "source.kade" };

let lineMap = [];
function initLineMap(code) {
  lineMap = [0];
  for (let i = 0; i < code.length; i++) {
    if (code[i] === "\n") lineMap.push(i + 1);
  }
}

function getLineCol(pos) {
  let line = 0;
  while (line + 1 < lineMap.length && lineMap[line + 1] <= pos) {
    line++;
  }
  return { line: line + 1, col: pos - lineMap[line] };
}

function createNode(ohmNode, chunks) {
  const { line, col } = getLineCol(ohmNode.source.startIdx);
  return new SourceNode(line, col, compileOptions.sourceFile, chunks);
}

let currentSubject = null; // Tracks the current subject for chained comparisons

const semantics = grammar
  .createSemantics()
  .addOperation("hasAwait", {
    AwaitExpr(_a, _e) {
      return true;
    },
    TypeofExpr(_t, e) {
      return e.hasAwait();
    },
    _iter(...children) {
      return children.some((c) => c.hasAwait());
    },
    _nonterminal(...children) {
      return children.some((c) => c.hasAwait());
    },
    _terminal() {
      return false;
    },
  })
  .addOperation("toNode", {
    Program(statements) {
      const target = compileOptions.target || "node";
      const helper = `
function __kadence_echo(val) {
    const s = String(val);
    const low = s.toLowerCase();
    if (typeof process !== 'undefined' && process.stdout && process.stdout.isTTY) {
        if (low.includes('error')) console.log("\\x1b[31m" + s + "\\x1b[0m");
        else if (low.includes('warning')) console.log("\\x1b[33m" + s + "\\x1b[0m");
        else if (low.includes('success')) console.log("\\x1b[32m" + s + "\\x1b[0m");
        else console.log(s);
    } else {
        console.log(s);
    }
}
function __kadence_min(val) {
    if (Array.isArray(val)) return Math.min(...val);
    return val;
}
function __kadence_max(val) {
    if (Array.isArray(val)) return Math.max(...val);
    return val;
}
function __kadence_add(parent, child) {
    if (Array.isArray(parent)) {
        parent.push(child);
        return parent;
    }
    if (typeof parent === 'object' && parent !== null && typeof parent.appendChild === 'function') {
        parent.appendChild(child);
        return parent;
    }
    throw new Error("Runtime Error: Cannot add item to " + typeof parent);
}
`;
      let topNodes = [];
      let iifeNodes = [];

      statements.children.forEach((s) => {
        const node = s.toNode();
        const js = node.toString();
        const hasAwait = s.hasAwait();
        const isFuncOrClass = js.includes("function ") || js.includes("class ");
        const isDecl =
          isFuncOrClass ||
          js.includes("require(") ||
          js.includes("let ") ||
          js.includes("const ") ||
          js.includes("exports.");

        if (hasAwait && !isFuncOrClass) iifeNodes.push(node);
        else if (isDecl) topNodes.push(node);
        else iifeNodes.push(node);
      });

      const errHandler = 'err => { if (err) console.error("\\x1b[31mRuntime Error:\\x1b[0m", err.stack || err.message); }';

      if (target === "browser") {
        const browserPreamble = `(function () {\n    var fs = { writeFileSync: function () { }, readFileSync: function () { return ""; } };\n    var require = typeof require === "function" ? require : function () { return {}; };\n`;
        return createNode(this, [
          browserPreamble,
          helper,
          ...topNodes.map(n => [n, "\n"]),
          "(async function() {\n",
          ...iifeNodes.map(n => [n, "\n"]),
          "\n})().catch(" + errHandler + ");\n})();"
        ]);
      }
      return createNode(this, [
        'const fs = require("fs"); \n',
        helper,
        ...topNodes.map(n => [n, "\n"]),
        "(async () => { \n",
        ...iifeNodes.map(n => [n, "\n"]),
        " })().catch(" + errHandler + "); "
      ]);
    },
    FunctionDecl_paren(_fn, id, _lp, params, _rp, block) {
      const ps = params.asIteration().children.map(p => p.toNode());
      const paramList = [];
      ps.forEach((p, i) => {
        paramList.push(p);
        if (i < ps.length - 1) paramList.push(", ");
      });
      return createNode(this, ["function ", id.toNode(), " (", ...paramList, ") ", block.toNode()]);
    },
    FunctionDecl_classic(_fn, id, params, block) {
      const ps = params.children.map(p => p.toNode());
      const paramList = [];
      ps.forEach((p, i) => {
        paramList.push(p);
        if (i < ps.length - 1) paramList.push(", ");
      });
      return createNode(this, ["function ", id.toNode(), " (", ...paramList, ") ", block.toNode()]);
    },
    AsyncFunctionDecl_paren(_async, _fn, id, _lp, params, _rp, block) {
      const ps = params.asIteration().children.map(p => p.toNode());
      const paramList = [];
      ps.forEach((p, i) => {
        paramList.push(p);
        if (i < ps.length - 1) paramList.push(", ");
      });
      return createNode(this, ["async function ", id.toNode(), " (", ...paramList, ") ", block.toNode()]);
    },
    AsyncFunctionDecl_classic(_async, _fn, id, params, block) {
      const ps = params.children.map(p => p.toNode());
      const paramList = [];
      ps.forEach((p, i) => {
        paramList.push(p);
        if (i < ps.length - 1) paramList.push(", ");
      });
      return createNode(this, ["async function ", id.toNode(), " (", ...paramList, ") ", block.toNode()]);
    },
    ClassDecl(_class, id, _extends, superId, _lb, members, _rb) {
      const extension = superId.children.length > 0 ? ["extends ", superId.toNode(), " "] : "";
      return createNode(this, ["class ", id.toNode(), " ", ...extension, "{ \n ", ...members.children.map(m => [m.toNode(), "\n"]), " \n } "]);
    },
    ImportStmt_all(_import, path, _as, id) {
      let p = path.toJS();
      p = p.replace(/\.kade([`"'])$/, ".js$1");
      const inner = p.replace(/^["'`]|["'`]$/g, "");
      if (inner.includes("/") && !/^\.\.?\//.test(inner)) p = p.replace(/^(["`'])(.*)(["`'])$/, "$1./$2$3");
      return createNode(this, ["const ", id.toNode(), " = require(", p, ");"]);
    },
    ImportStmt_named(_import, _lb, ids, _rb, _from, path) {
      let p = path.toJS();
      p = p.replace(/\.kade([`"'])$/, ".js$1");
      const inner = p.replace(/^["'`]|["'`]$/g, "");
      if (inner.includes("/") && !/^\.\.?\//.test(inner)) p = p.replace(/^(["`'])(.*)(["`'])$/, "$1./$2$3");
      const idList = [];
      const children = ids.asIteration().children;
      children.forEach((c, i) => {
        idList.push(c.toNode());
        if (i < children.length - 1) idList.push(", ");
      });
      return createNode(this, ["const { ", ...idList, " } = require(", p, ");"]);
    },
    ExportStmt_default(_export, _default, expr) {
      return createNode(this, ["if (typeof exports !== 'undefined') exports.default = ", expr.toNode(), "; else export default ", expr.toNode(), ";"]);
    },
    ExportStmt_named(_export, decl) {
      const name = decl.getName();
      return createNode(this, [decl.toNode(), "\nif (typeof exports !== 'undefined') exports.", name, " = ", name, ";"]);
    },
    Declaration(decl) { return decl.toNode(); },
    MethodDecl(staticKw, privateKw, _fn, id, params, block) {
      const ps = params.children.map(p => p.toNode());
      const paramList = [];
      ps.forEach((p, i) => {
        paramList.push(p);
        if (i < ps.length - 1) paramList.push(", ");
      });
      const prefix = (staticKw.sourceString ? "static " : "") + (privateKw.sourceString ? "#" : "");
      return createNode(this, ["  ", prefix, id.toNode(), " (", ...paramList, ") ", block.toNode()]);
    },
    PropertyDecl(staticKw, privateKw, id, _eq, expr) {
      const prefix = (staticKw.sourceString ? "static " : "") + (privateKw.sourceString ? "#" : "");
      return createNode(this, ["  ", prefix, id.toNode(), " = ", expr.toNode(), "; "]);
    },
    Param_rest(_dots, id) { return createNode(this, ["...", id.toNode()]); },
    Param_default(id, _eq, expr) { return createNode(this, [id.toNode(), " = ", expr.toNode()]); },
    Param_base(id) { return id.toNode(); },
    VariableDecl(_let, pattern, _eq, expr) { return createNode(this, ["let ", pattern.toNode(), " = ", expr.toNode(), "; "]); },
    ConstantDecl(_const, pattern, _eq, expr) { return createNode(this, ["const ", pattern.toNode(), " = ", expr.toNode(), "; "]); },
    BindingPattern_object(_lb, ids, _rb) {
      const idList = [];
      const children = ids.asIteration().children;
      children.forEach((c, i) => {
        idList.push(c.toNode());
        if (i < children.length - 1) idList.push(", ");
      });
      return createNode(this, ["{ ", ...idList, " }"]);
    },
    BindingPattern_list(_lb, ids, _rb) {
      const idList = [];
      const children = ids.asIteration().children;
      children.forEach((c, i) => {
        idList.push(c.toNode());
        if (i < children.length - 1) idList.push(", ");
      });
      return createNode(this, ["[ ", ...idList, " ]"]);
    },
    BindingPattern_base(id) { return id.toNode(); },
    Assignment_simple(member, _op, expr) { return createNode(this, [member.toNode(), " = ", expr.toNode(), "; "]); },
    Assignment_destructure(pattern, _op, expr) { return createNode(this, [pattern.toNode(), " = ", expr.toNode(), "; "]); },
    TryStmt(_try, tryBlock, _catch, errorId, catchBlock) {
      return createNode(this, ["try ", tryBlock.toNode(), " catch(", errorId.toNode(), ") ", catchBlock.toNode()]);
    },
    MatchStmt(_match, expr, _open, cases, elseCase, _close) {
      return createNode(this, [
        "(() => { const __match = ", expr.toNode(), "; ",
        ...cases.children.map((c, i) => [i === 0 ? "if " : " else if ", c.toNode()]),
        elseCase.children.length > 0 ? [" else { ", elseCase.children[0].toNode(), " } "] : "",
        "})(); "
      ]);
    },
    MatchCase(_when, condition, _then, statement) {
      return createNode(this, ["(__match === ", condition.toNode(), ") { ", statement.toNode(), " }"]);
    },
    MatchElse(_else, statement) { return statement.toNode(); },
    RepeatStmt(_repeat, count, _unit, block) {
      return createNode(this, ["for (let __i = 0; __i < ", count.toNode(), "; __i++) ", block.toNode()]);
    },
    WebStmt_create(_create, _elem, str) { return createNode(this, ["document.createElement(", str.toNode(), "); "]); },
    WebStmt_add_child(_add, child, _to, parent) { return createNode(this, ["__kadence_add(", parent.toNode(), ", ", child.toNode(), ");"]); },
    SetStmt_style(_set, prop, _of, target, _to, val) {
      let p = prop.toJS();
      if (p === "text") return createNode(this, [target.toNode(), ".innerText = ", val.toNode(), ";"]);
      if (p === "class") return createNode(this, [target.toNode(), ".className = ", val.toNode(), ";"]);
      return createNode(this, [target.toNode(), ".style.", p, " = ", val.toNode(), ";"]);
    },
    SetStmt_prop(_set, target, prop, _to, val) {
      let p = prop.toJS();
      if (p === "class") p = "className";
      if (p === "text") p = "innerText";
      return createNode(this, [target.toNode(), ".", p, " = ", val.toNode(), ";"]);
    },
    SetStmt_simple(_set, target, _to, val) { return createNode(this, [target.toNode(), " = ", val.toNode(), ";"]); },
    ListStmt_add(_add, val, _to, list) { return createNode(this, ["__kadence_add(", list.toNode(), ", ", val.toNode(), ");"]); },
    ListStmt_remove_at(_rem, _item, idx, _from, list) { return createNode(this, [list.toNode(), ".splice(", idx.toNode(), ", 1);"]); },
    PropTerm(node) { return node.sourceString; },
    FileStmt_save(_save, content, _to, path) { return createNode(this, ["fs.writeFileSync(", path.toNode(), ", ", content.toNode(), ");"]); },
    FileStmt_read(_read, _from, path) { return createNode(this, ["fs.readFileSync(", path.toNode(), ", 'utf8');"]); },
    NavigateStmt(_go, _to, expr) { return createNode(this, ["window.location.href = ", expr.toNode(), ";"]); },
    AskExpr(_ask, str) { return createNode(this, ["prompt(", str.toNode(), ")"]); },
    SizeExpr(_size, _of, id) { return createNode(this, [id.toNode(), ".length"]); },
    MathExpr_average(_avg, _of, id) {
      return createNode(this, ["(", id.toNode(), ".reduce((a, b) => a + b, 0) / ", id.toNode(), ".length)"]);
    },
    MathExpr_min(_min, _of, id) { return createNode(this, ["__kadence_min(", id.toNode(), ")"]); },
    MathExpr_max(_max, _of, id) { return createNode(this, ["__kadence_max(", id.toNode(), ")"]); },
    MathExpr_round(_round, expr) { return createNode(this, ["Math.round(", expr.toNode(), ")"]); },
    MathExpr_floor(_floor, expr) { return createNode(this, ["Math.floor(", expr.toNode(), ")"]); },
    MathExpr_ceil(_ceil, expr) { return createNode(this, ["Math.ceil(", expr.toNode(), ")"]); },
    MathExpr_abs(_abs, expr) { return createNode(this, ["Math.abs(", expr.toNode(), ")"]); },
    MathExpr_sqrt(_sqrt, _root, expr) { return createNode(this, ["Math.sqrt(", expr.toNode(), ")"]); },
    MathExpr_pow(_pow, base, _to, exp) { return createNode(this, ["Math.pow(", base.toNode(), ", ", exp.toNode(), ")"]); },
    MathExpr_sin(_sin, expr) { return createNode(this, ["Math.sin(", expr.toNode(), ")"]); },
    MathExpr_cos(_cos, expr) { return createNode(this, ["Math.cos(", expr.toNode(), ")"]); },
    MathExpr_tan(_tan, expr) { return createNode(this, ["Math.tan(", expr.toNode(), ")"]); },
    ListExpr_sort(_sort, expr) { return createNode(this, ["([...", expr.toNode(), "].sort())"]); },
    ListExpr_reverse(_reverse, expr) { return createNode(this, ["([...", expr.toNode(), "].reverse())"]); },
    ListExpr_push(_push, val, _to, array) {
      return createNode(this, ["(() => { const _a = ", array.toNode(), "; _a.push(", val.toNode(), "); return _a; })()"]);
    },
    ListExpr_pop(_pop, _from, array) { return createNode(this, [array.toNode(), ".pop()"]); },
    ObjectExpr_keys(_keys, _of, expr) { return createNode(this, ["Object.keys(", expr.toNode(), ")"]); },
    ObjectExpr_values(_values, _of, expr) { return createNode(this, ["Object.values(", expr.toNode(), ")"]); },
    ObjectExpr_merge(_merge, a, _with, b) { return createNode(this, ["Object.assign({}, ", a.toNode(), ", ", b.toNode(), ")"]); },
    ReadExpr(_read, _from, path) { return createNode(this, ["fs.readFileSync(", path.toNode(), ", 'utf8')"]); },
    TimeExpr_time(_the, _time, _now) { return createNode(this, ["new Date().toLocaleTimeString()"]); },
    TimeExpr_date(_the, _date, _today) { return createNode(this, ["new Date().toLocaleDateString()"]); },
    ConvertExpr(_convert, expr, _to, type) {
      const t = type.sourceString;
      if (t === "number") return createNode(this, ["Number(", expr.toNode(), ")"]);
      if (t === "string") return createNode(this, ["String(", expr.toNode(), ")"]);
      if (t === "bool") return createNode(this, ["Boolean(", expr.toNode(), ")"]);
      if (t === "object") return createNode(this, ["Object(", expr.toNode(), ")"]);
      return createNode(this, [t, "(", expr.toNode(), ")"]);
    },
    AwaitExpr(_await, expr) { return createNode(this, ["await ", expr.toNode()]); },
    NewExpr_paren(_new, id, _lp, args, _rp) {
      const children = args.asIteration().children;
      const argList = [];
      children.forEach((c, i) => {
        argList.push(c.toNode());
        if (i < children.length - 1) argList.push(", ");
      });
      return createNode(this, ["new ", id.sourceString, "(", ...argList, ")"]);
    },
    NewExpr_classic(_new, id, args) {
      const children = args.children;
      const argList = [];
      children.forEach((c, i) => {
        argList.push(c.toNode());
        if (i < children.length - 1) argList.push(", ");
      });
      return createNode(this, ["new ", id.sourceString, "(", ...argList, ")"]);
    },
    ObjectLiteral(_objKw, _lb, pairs, _rb) {
      const children = pairs.asIteration().children;
      const pairList = [];
      children.forEach((c, i) => {
        pairList.push(c.toNode());
        if (i < children.length - 1) pairList.push(", ");
      });
      return createNode(this, ["{ ", ...pairList, " }"]);
    },
    ObjectPair_pair(key, _colon, value) { return createNode(this, [key.toNode(), ": ", value.toNode()]); },
    ObjectPair_shorthand(id) { return id.toNode(); },
    ObjectPair_spread(spread) { return spread.toNode(); },
    ArrayMethod_map(_map, array, _with, lambda) { return createNode(this, [array.toNode(), ".map(", lambda.toNode(), ")"]); },
    ArrayMethod_filter(_filter, array, _where, lambda) { return createNode(this, [array.toNode(), ".filter(", lambda.toNode(), ")"]); },
    ArrayMethod_reduce(_reduce, array, _from, init, _with, lambda) { return createNode(this, [array.toNode(), ".reduce(", lambda.toNode(), ", ", init.toNode(), ")"]); },
    ArrayMethod_find(_find, array, _where, lambda) { return createNode(this, [array.toNode(), ".find(", lambda.toNode(), ")"]); },
    ArrayMethod_some(_some, array, _where, lambda) { return createNode(this, [array.toNode(), ".some(", lambda.toNode(), ")"]); },
    ArrayMethod_every(_every, array, _where, lambda) { return createNode(this, [array.toNode(), ".every(", lambda.toNode(), ")"]); },
    HttpExpr_get(_get, _from, url) { return createNode(this, ["fetch(", url.toNode(), ").then(r => r.json())"]); },
    HttpExpr_post(_post, _to, url, _with, data) {
      return createNode(this, ["fetch(", url.toNode(), ", {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(", data.toNode(), ")}).then(r => r.json())"]);
    },
    HttpExpr_put(_put, _to, url, _with, data) {
      return createNode(this, ["fetch(", url.toNode(), ", {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(", data.toNode(), ")}).then(r => r.json())"]);
    },
    HttpExpr_delete(_delete, _from, url) { return createNode(this, ["fetch(", url.toNode(), ", {method: 'DELETE'}).then(r => r.json())"]); },
    JsonExpr_parse(_parse, _json, _from, str) { return createNode(this, ["JSON.parse(", str.toNode(), ")"]); },
    JsonExpr_stringify(_stringify, obj, _to, _json) { return createNode(this, ["JSON.stringify(", obj.toNode(), ")"]); },
    RegexExpr_create(_regex, pattern) { return createNode(this, ["new RegExp(", pattern.toNode(), ")"]); },
    RegexExpr_extractAll(_extract, _all, pattern, _from, str) { return createNode(this, [str.toNode(), ".match(", pattern.toNode(), ")"]); },
    StringCheck(child) { return child.toNode(); },
    MatchCheck(str, _matches, pattern) { return createNode(this, [pattern.toNode(), ".test(", str.toNode(), ")"]); },
    StringCmd_split(_split, str, _by, delim) { return createNode(this, [str.toNode(), ".split(", delim.toNode(), ")"]); },
    StringCmd_join(_join, array, _with, delim) { return createNode(this, [array.toNode(), ".join(", delim.toNode(), ")"]); },
    StringCmd_trim(_trim, str) { return createNode(this, [str.toNode(), ".trim()"]); },
    StringCmd_replace(_replace, search, _with, replacement, _in, str) { return createNode(this, [str.toNode(), ".replace(", search.toNode(), ", ", replacement.toNode(), ")"]); },
    StringCmd_indexOf(_index, _of, search, _in, str) { return createNode(this, [str.toNode(), ".indexOf(", search.toNode(), ")"]); },
    StringCmd_lastIndexOf(_last, _index, _of, search, _in, str) { return createNode(this, [str.toNode(), ".lastIndexOf(", search.toNode(), ")"]); },
    StringCheck_includes(str, _includes, search) { return createNode(this, [str.toNode(), ".includes(", search.toNode(), ")"]); },
    StringCheck_startsWith(str, _starts, _with, search) { return createNode(this, [str.toNode(), ".startsWith(", search.toNode(), ")"]); },
    StringCheck_endsWith(str, _ends, _with, search) { return createNode(this, [str.toNode(), ".endsWith(", search.toNode(), ")"]); },
    Comparison_string_check(child) { return child.toNode(); },
    Comparison_property_check(child) { return child.toNode(); },
    PropertyCheck(obj, _has, prop) { return createNode(this, ["(", prop.toNode(), " in ", obj.toNode(), ")"]); },
    SpreadExpr(_dots, expr) { return createNode(this, ["...", expr.toNode()]); },
    RangeExpr(_range, start, _to, end) {
      return createNode(this, ["Array.from({length: ", end.toNode(), " - ", start.toNode(), " + 1}, (_, i) => i + ", start.toNode(), ")"]);
    },
    Lambda_simple(param, _arrow, body) {
      const asyncKw = body.hasAwait() ? "async " : "";
      return createNode(this, [asyncKw, param.toNode(), " => ", body.toNode()]);
    },
    Lambda_multi(_lp, params, _rp, _arrow, body) {
      const asyncKw = body.hasAwait() ? "async " : "";
      const ps = params.asIteration().children.map(p => p.toNode());
      const paramList = [];
      ps.forEach((p, i) => {
        paramList.push(p);
        if (i < ps.length - 1) paramList.push(", ");
      });
      return createNode(this, [asyncKw, "(", ...paramList, ") => ", body.toNode()]);
    },
    MemberAccess_chain(id, segs) {
      let r = id.toNode();
      for (const seg of segs.children) {
        r = createNode(this, [r, seg.toNode()]);
      }
      return r;
    },
    MemberAccess_this(_this) { return "this"; },
    MemberAccess_super(_super) { return "super"; },
    MemberAccessSeg_prop(_dot, prop) { return createNode(this, [".", prop.toNode()]); },
    MemberAccessSeg_index(_lb, index, _rb) { return createNode(this, ["[", index.toNode(), "]"]); },
    MemberAccessSeg_opt_prop(_opt, prop) { return createNode(this, ["?.", prop.toNode()]); },
    MemberAccessSeg_opt_index(_opt, _lb, index, _rb) { return createNode(this, ["?.[", index.toNode(), "]"]); },
    CreateExpr_call(_create, _elem, str) { return createNode(this, ["document.createElement(", str.toNode(), ")"]); },
    BreakStmt(_break) { return createNode(this, ["break;"]); },
    ContinueStmt(_continue) { return createNode(this, ["continue;"]); },
    ReturnStmt(_ret, expr) { return createNode(this, ["return ", expr.toNode(), ";"]); },
    IncrementStmt_word(_inc, id) { return createNode(this, [id.toNode(), "++;"]); },
    IncrementStmt_sym(id, _sym) { return createNode(this, [id.toNode(), "++;"]); },
    DecrementStmt_word(_dec, id) { return createNode(this, [id.toNode(), "--;"]); },
    DecrementStmt_sym(id, _sym) { return createNode(this, [id.toNode(), "--;"]); },
    WaitStmt(_wait, expr, _unit) { return createNode(this, ["await new Promise(r => setTimeout(r, ", expr.toNode(), " * 1000));"]); },
    RandomExpr_range(_rand, _num, _from, min, _to, max) {
      return createNode(this, ["Math.floor(Math.random() * (", max.toNode(), " - ", min.toNode(), " + 1)) + ", min.toNode()]);
    },
    RandomExpr_float(_rand) {
      return createNode(this, ["Math.random()"]);
    },
    TypeCheck(expr, _is, _a, type) {
      const t = type.sourceString;
      if (t === "number") return createNode(this, ["typeof ", expr.toNode(), " === 'number'"]);
      if (t === "string") return createNode(this, ["typeof ", expr.toNode(), " === 'string'"]);
      if (t === "bool") return createNode(this, ["typeof ", expr.toNode(), " === 'boolean'"]);
      if (t === "list") return createNode(this, ["Array.isArray(", expr.toNode(), ")"]);
      return createNode(this, ["typeof ", expr.toNode(), " === '", t, "'"]);
    },
    TypeTerm(node) { return node.sourceString; },
    Primary_transform(child) { return child.toNode(); },
    TransformExpr(op, expr) {
      const o = op.sourceString;
      if (o === "uppercase") return createNode(this, ["(", expr.toNode(), ").toString().toUpperCase()"]);
      if (o === "lowercase") return createNode(this, ["(", expr.toNode(), ").toString().toLowerCase()"]);
      return expr.toNode();
    },
    Comparison_type_check(child) { return child.toNode(); },
    Primary_regex(child) { return child.toNode(); },
    Primary_range(child) { return child.toNode(); },
    IfStmt(_if, cond, block, elifKws, elifConds, elifBlocks, _elseKw, elseBlock) {
      const res = ["if (", cond.toNode(), ") ", block.toNode()];
      const elifC = elifConds.children;
      const elifB = elifBlocks.children;
      for (let i = 0; i < elifC.length; i++) {
        res.push(" else if (", elifC[i].toNode(), ") ", elifB[i].toNode());
      }
      if (_elseKw.children.length > 0) {
        res.push(" else ", elseBlock.children[0].toNode());
      }
      return createNode(this, res);
    },
    WhileStmt(_while, cond, block) { return createNode(this, ["while (", cond.toNode(), ") ", block.toNode()]); },
    ForStmt(_for, _each, id, _in, expr, block) { return createNode(this, ["for (let ", id.toJS(), " of ", expr.toNode(), ") ", block.toNode()]); },
    WhenStmt(_when, target, _is, event, block) {
      let eventName = event.sourceString;
      if (eventName === "clicked") eventName = "click";
      const asyncKw = block.hasAwait() ? "async " : "";
      return createNode(this, [target.toNode(), ".addEventListener('", eventName, "', ", asyncKw, "() => ", block.toNode(), ");"]);
    },
    EchoStmt(_echo, expr) { return createNode(this, ["__kadence_echo(", expr.toNode(), "); "]); },
    ExpressionStmt(expr) { return createNode(this, [expr.toNode(), "; "]); },
    Block(_lb, statements, _rb) {
      return createNode(this, ["{ \n", ...statements.children.map(s => ["  ", s.toNode(), "\n"]), " \n } "]);
    },
    CoalesceExpr_coalesce(left, _op, right) { return createNode(this, [left.toNode(), " ?? ", right.toNode()]); },
    CoalesceExpr(child) { return child.toNode(); },
    OrExpr_word(left, _or, right) { return createNode(this, [left.toNode(), " || ", right.toNode()]); },
    OrExpr_sym(left, _op, right) { return createNode(this, [left.toNode(), " || ", right.toNode()]); },
    OrExpr(child) { return child.toNode(); },
    AndExpr_word(left, _and, right) { return createNode(this, [left.toNode(), " && ", right.toNode()]); },
    AndExpr_sym(left, _op, right) { return createNode(this, [left.toNode(), " && ", right.toNode()]); },
    AndExpr(child) { return child.toNode(); },
    NotExpr_word(_not, expr) { return createNode(this, ["!(", expr.toNode(), ")"]); },
    NotExpr_sym(_op, expr) { return createNode(this, ["!(", expr.toNode(), ")"]); },
    NotExpr(child) { return child.toNode(); },
    Comparison_full(left, op, right) {
      const l = left.toNode();
      currentSubject = l.toString();
      return createNode(this, [l, " ", op.toNode(), " ", right.toNode()]);
    },
    Comparison_short(op, right) {
      return createNode(this, [currentSubject, " ", op.toNode(), " ", right.toNode()]);
    },
    Comparison_base(child) {
      const n = child.toNode();
      currentSubject = n.toString();
      return n;
    },
    CompareOp_eq_sym_double(_op) { return "==="; },
    CompareOp_eq_sym(_op) { return "==="; },
    CompareOp_eq_word(_op) { return "==="; },
    CompareOp_neq_sym(_op) { return "!=="; },
    CompareOp_neq_word(_not, _equals) { return "!=="; },
    CompareOp_gt_sym(_op) { return ">"; },
    CompareOp_gt_word(_more, _than) { return ">"; },
    CompareOp_lt_sym(_op) { return "<"; },
    CompareOp_lt_word(_less, _than) { return "<"; },
    CompareOp_gte_sym(_op) { return ">="; },
    CompareOp_gte_word(_at, _least) { return ">="; },
    CompareOp_lte_sym(_op) { return "<="; },
    CompareOp_lte_word(_at, _most) { return "<="; },
    Additive_add_word(left, _plus, right) { return createNode(this, [left.toNode(), " + ", right.toNode()]); },
    Additive_add_sym(left, _plus, right) { return createNode(this, [left.toNode(), " + ", right.toNode()]); },
    Additive_sub_word(left, _minus, right) { return createNode(this, [left.toNode(), " - ", right.toNode()]); },
    Additive_sub_sym(left, _minus, right) { return createNode(this, [left.toNode(), " - ", right.toNode()]); },
    Additive(child) { return child.toNode(); },
    BitwiseShift_left(l, _op, r) { return createNode(this, [l.toNode(), " << ", r.toNode()]); },
    BitwiseShift_right(l, _op, r) { return createNode(this, [l.toNode(), " >> ", r.toNode()]); },
    BitwiseShift(child) { return child.toNode(); },
    BitwiseAnd_bin(l, _op, r) { return createNode(this, [l.toNode(), " & ", r.toNode()]); },
    BitwiseAnd(child) { return child.toNode(); },
    BitwiseXor_bin(l, _op, r) { return createNode(this, [l.toNode(), " ^ ", r.toNode()]); },
    BitwiseXor(child) { return child.toNode(); },
    BitwiseOr_bin(l, _op, r) { return createNode(this, [l.toNode(), " | ", r.toNode()]); },
    BitwiseOr(child) { return child.toNode(); },
    Multiplicative_mul_sym(left, _times, right) { return createNode(this, [left.toNode(), " * ", right.toNode()]); },
    Multiplicative_mul_word(left, _times, right) { return createNode(this, [left.toNode(), " * ", right.toNode()]); },
    Multiplicative_div(left, _op, right) { return createNode(this, [left.toNode(), " / ", right.toNode()]); },
    Multiplicative_div_word(left, _divided, _by, right) { return createNode(this, [left.toNode(), " / ", right.toNode()]); },
    Multiplicative(child) { return child.toNode(); },
    Primary_list(child) { return child.toNode(); },
    Primary_lambda(child) { return child.toNode(); },
    Primary_access(child) { return child.toNode(); },
    Primary_call(child) { return child.toNode(); },
    Primary_math(child) { return child.toNode(); },
    Primary_string(child) { return child.toNode(); },
    Primary_arrayay(child) { return child.toNode(); },
    Primary_list_op(child) { return child.toNode(); },
    Primary_object(child) { return child.toNode(); },
    Primary_json(child) { return child.toNode(); },
    Primary_http(child) { return child.toNode(); },
    Primary_ask(child) { return child.toNode(); },
    Primary_size(child) { return child.toNode(); },
    Primary_random(child) { return child.toNode(); },
    Primary_read(child) { return child.toNode(); },
    Primary_time(child) { return child.toNode(); },
    Primary_convert(child) { return child.toNode(); },
    Primary_member(child) { return child.toNode(); },
    Primary_pi(_pi) { return "Math.PI"; },
    Primary_num(child) { return child.toNode(); },
    Primary_bool(child) { return child.toNode(); },
    Primary_null(_n) { return "null"; },
    Primary_undefined(_u) { return "undefined"; },
    Primary_str(child) { return child.toNode(); },
    Primary_paren(_lp, expr, _rp) { return createNode(this, ["(", expr.toNode(), ")"]); },
    Call_paren(id, _lp, args, _rp) {
      const ps = args.asIteration().children.map(a => a.toNode());
      const argList = [];
      ps.forEach((p, i) => {
        argList.push(p);
        if (i < ps.length - 1) argList.push(", ");
      });
      return createNode(this, [id.toNode(), "(", ...argList, ")"]);
    },
    RunCall(_run, member, args) {
      const ps = args.children.map(a => a.toNode());
      const argList = [];
      ps.forEach((p, i) => {
        argList.push(p);
        if (i < ps.length - 1) argList.push(", ");
      });
      return createNode(this, [member.toNode(), "(", ...argList, ")"]);
    },
    Call_run(_run, id, args) {
      const ps = args.children.map(a => a.toNode());
      const argList = [];
      ps.forEach((p, i) => {
        argList.push(p);
        if (i < ps.length - 1) argList.push(", ");
      });
      return createNode(this, [id.toNode(), "(", ...argList, ")"]);
    },
    Arg(child) { return child.toNode(); },
    Arg_paren(_lp, expr, _rp) { return createNode(this, ["(", expr.toNode(), ")"]); },
    List(_list, args) {
      const ps = args.children.map(a => a.toNode());
      const argList = [];
      ps.forEach((p, i) => {
        argList.push(p);
        if (i < ps.length - 1) argList.push(", ");
      });
      return createNode(this, ["[", ...argList, "]"]);
    },
    ItemAccess(_item, index, _from, list) { return createNode(this, [list.toNode(), "[", index.toNode(), "]"]); },
    string(child) { return child.toNode(); },
    doubleString(_l, parts, _r) { return createNode(this, ["`", ...parts.children.map(p => p.toNode()), "`"]); },
    templateString(_l, parts, _r) { return createNode(this, ["`", ...parts.children.map(p => p.toNode()), "`"]); },
    escape(_slash, char) {
      const c = char.sourceString;
      if (c === "n") return "\\n";
      if (c === "t") return "\\t";
      if (c === "r") return "\\r";
      if (c === '"') return '\\"';
      if (c === "\\") return "\\\\";
      if (c === "`") return "\\`";
      return "\\" + c;
    },
    textDouble(char) { return char.sourceString; },
    textBacktick(char) { return char.sourceString; },
    interpolation(_l, content, _r) {
      const exprMatch = grammar.match(content.sourceString, "Expression");
      if (exprMatch.failed()) throw new Error(`Invalid expression in string interpolation: ${exprMatch.message}`);
      return createNode(this, ["${", semantics(exprMatch).toNode(), "}"]);
    },
    bool(val) { return val.sourceString; },
    word(_first, _rest) { return this.sourceString; },
    identifier(w) { return w.toNode(); },
    number(_digits, _dot, _fract) { return this.sourceString; },
    _iter(...children) { return children.map(c => c.toNode()); },
    _terminal() { return this.sourceString; },
  })
  .addOperation("toJS", {
    Program(statements) {
      const target = compileOptions.target || "node";
      const helper = `
function __kadence_echo(val) {
    const s = String(val);
    const low = s.toLowerCase();
    if (typeof process !== 'undefined' && process.stdout && process.stdout.isTTY) {
        if (low.includes('error')) console.log("\\x1b[31m" + s + "\\x1b[0m");
        else if (low.includes('warning')) console.log("\\x1b[33m" + s + "\\x1b[0m");
        else if (low.includes('success')) console.log("\\x1b[32m" + s + "\\x1b[0m");
        else console.log(s);
    } else {
        console.log(s);
    }
}
function __kadence_min(val) {
    if (Array.isArray(val)) return Math.min(...val);
    return val;
}
function __kadence_max(val) {
    if (Array.isArray(val)) return Math.max(...val);
    return val;
}
function __kadence_add(parent, child) {
    if (Array.isArray(parent)) {
        parent.push(child);
        return parent;
    }
    if (typeof parent === 'object' && parent !== null && typeof parent.appendChild === 'function') {
        parent.appendChild(child);
        return parent;
    }
    throw new Error("Runtime Error: Cannot add item to " + typeof parent);
}
`;
      let topLevel = [];
      let iifeLevel = [];

      statements.children.forEach((s) => {
        const js = s.toJS();
        const hasAwait = s.hasAwait();
        const isFuncOrClass = js.includes("function ") || js.includes("class ");
        const isDecl =
          isFuncOrClass ||
          js.includes("require(") ||
          js.includes("let ") ||
          js.includes("const ") ||
          js.includes("exports.");

        if (hasAwait && !isFuncOrClass) {
          iifeLevel.push(js);
        } else if (isDecl) {
          topLevel.push(js);
        } else {
          iifeLevel.push(js);
        }
      });

      const topCode = topLevel.join("\n");
      const iifeCode = iifeLevel.join("\n");
      const errHandler =
        'err => { if (err) console.error("Runtime Error:", err.stack || err.message); }';

      if (target === "browser") {
        const browserPreamble = `(function () {
    var fs = { writeFileSync: function () { }, readFileSync: function () { return ""; } };
    var require = typeof require === "function" ? require : function () { return {}; };
    `;
        return (
          browserPreamble +
          helper +
          topCode +
          "\n(async function() {\n" +
          iifeCode +
          "\n})().catch(" +
          errHandler +
          ");\n})();"
        );
      }
      return `const fs = require("fs"); \n${helper} \n${topCode} \n(async () => { \n${iifeCode} \n })().catch(err => { if (err) console.error("\\x1b[31mRuntime Error:\\x1b[0m", err.stack || err.message); }); `;
    },
    FunctionDecl_paren(_fn, id, _lp, params, _rp, block) {
      const paramNames = params.asIteration().children.map((p) => p.toJS()).join(", ");
      return `function ${id.toJS()} (${paramNames}) ${block.toJS()} `;
    },
    FunctionDecl_classic(_fn, id, params, block) {
      const paramNames = params.children.map((p) => p.toJS()).join(", ");
      return `function ${id.toJS()} (${paramNames}) ${block.toJS()} `;
    },
    AsyncFunctionDecl_paren(_async, _fn, id, _lp, params, _rp, block) {
      const paramNames = params.asIteration().children.map((p) => p.toJS()).join(", ");
      return `async function ${id.toJS()} (${paramNames}) ${block.toJS()} `;
    },
    AsyncFunctionDecl_classic(_async, _fn, id, params, block) {
      const paramNames = params.children.map((p) => p.toJS()).join(", ");
      return `async function ${id.toJS()} (${paramNames}) ${block.toJS()} `;
    },
    ClassDecl(_class, id, _extends, superId, _lb, members, _rb) {
      const extension = superId.children.length > 0 ? `extends ${superId.toJS()} ` : "";
      return `class ${id.toJS()} ${extension}{ \n ${members.children.map((m) => m.toJS()).join("\n")} \n } `;
    },
    ImportStmt_all(_import, path, _as, id) {
      let p = path.toJS();
      p = p.replace(/\.kade([`"'])$/, ".js$1");
      const inner = p.replace(/^["'`]|["'`]$/g, "");
      if (inner.includes("/") && !/^\.\.?\//.test(inner))
        p = p.replace(/^(["`'])(.*)(["`'])$/, "$1./$2$3");
      return `const ${id.toJS()} = require(${p});`;
    },
    ImportStmt_named(_import, _lb, ids, _rb, _from, path) {
      let p = path.toJS();
      p = p.replace(/\.kade([`"'])$/, ".js$1");
      const inner = p.replace(/^["'`]|["'`]$/g, "");
      if (inner.includes("/") && !/^\.\.?\//.test(inner))
        p = p.replace(/^(["`'])(.*)(["`'])$/, "$1./$2$3");
      const idList = ids
        .asIteration()
        .children.map((i) => i.toJS())
        .join(", ");
      return `const { ${idList} } = require(${p});`;
    },
    ExportStmt_default(_export, _default, expr) {
      return `if (typeof exports !== 'undefined') exports.default = ${expr.toJS()}; else export default ${expr.toJS()};`;
    },
    ExportStmt_named(_export, decl) {
      const js = decl.toJS().trim();
      const name = decl.getName();
      return `${js}\nif (typeof exports !== 'undefined') exports.${name} = ${name};`;
    },
    Declaration(decl) {
      return decl.toJS();
    },
    MethodDecl(staticKw, privateKw, _fn, id, params, block) {
      const paramNames = params.children.map((p) => p.toJS()).join(", ");
      const name = id.toJS();
      const prefix = (staticKw.sourceString ? "static " : "") + (privateKw.sourceString ? "#" : "");
      return `  ${prefix}${name} (${paramNames}) ${block.toJS()} `;
    },
    PropertyDecl(staticKw, privateKw, id, _eq, expr) {
      const prefix = (staticKw.sourceString ? "static " : "") + (privateKw.sourceString ? "#" : "");
      return `  ${prefix}${id.toJS()} = ${expr.toJS()}; `;
    },
    Param_rest(_dots, id) {
      return `...${id.toJS()}`;
    },
    Param_default(id, _eq, expr) {
      return `${id.toJS()} = ${expr.toJS()}`;
    },
    Param_base(id) {
      return id.toJS();
    },
    VariableDecl(_let, pattern, _eq, expr) {
      return `let ${pattern.toJS()} = ${expr.toJS()}; `;
    },
    ConstantDecl(_const, pattern, _eq, expr) {
      return `const ${pattern.toJS()} = ${expr.toJS()}; `;
    },
    BindingPattern_object(_lb, ids, _rb) {
      return `{ ${ids.asIteration().children.map(i => i.toJS()).join(", ")} }`;
    },
    BindingPattern_list(_lb, ids, _rb) {
      return `[ ${ids.asIteration().children.map(i => i.toJS()).join(", ")} ]`;
    },
    BindingPattern_base(id) {
      return id.toJS();
    },
    Assignment_simple(member, _op, expr) {
      return `${member.toJS()} = ${expr.toJS()}; `;
    },
    Assignment_destructure(pattern, _op, expr) {
      return `${pattern.toJS()} = ${expr.toJS()}; `;
    },
    TryStmt(_try, tryBlock, _catch, errorId, catchBlock) {
      return `try ${tryBlock.toJS()} catch(${errorId.toJS()}) ${catchBlock.toJS()} `;
    },
    MatchStmt(_match, expr, _open, cases, elseCase, _close) {
      const val = expr.toJS();
      let result = `(() => { const __match = ${val}; `;
      const caseNodes = cases.children;
      for (let i = 0; i < caseNodes.length; i++) {
        const caseCode = caseNodes[i].toJS();
        if (i === 0) result += `if ${caseCode} `;
        else result += `else if ${caseCode} `;
      }
      if (elseCase.children.length > 0) {
        result += `else { ${elseCase.children[0].toJS()} } `;
      }
      result += `})(); `;
      return result;
    },
    MatchCase(_when, condition, _then, statement) {
      return `(__match === ${condition.toJS()}) { ${statement.toJS()} }`;
    },
    MatchElse(_else, statement) {
      return statement.toJS();
    },
    RepeatStmt(_repeat, count, _unit, block) {
      return `for (let __i = 0; __i < ${count.toJS()}; __i++) ${block.toJS()} `;
    },
    WebStmt_create(_create, _elem, str) {
      return `document.createElement(${str.toJS()}); `;
    },
    WebStmt_add_child(_add, child, _to, parent) {
      return `__kadence_add(${parent.toJS()}, ${child.toJS()});`;
    },
    SetStmt_style(_set, prop, _of, target, _to, val) {
      let p = prop.toJS();
      if (p === "text") return `${target.toJS()}.innerText = ${val.toJS()};`;
      if (p === "class") return `${target.toJS()}.className = ${val.toJS()};`;
      return `${target.toJS()}.style.${p} = ${val.toJS()};`;
    },
    SetStmt_prop(_set, target, prop, _to, val) {
      let p = prop.toJS();
      if (p === "class") p = "className";
      if (p === "text") p = "innerText";
      if (p === "value") p = "value";
      return `${target.toJS()}.${p} = ${val.toJS()};`;
    },
    SetStmt_simple(_set, target, _to, val) {
      return `${target.toJS()} = ${val.toJS()};`;
    },
    ListStmt_add(_add, val, _to, list) {
      return `__kadence_add(${list.toJS()}, ${val.toJS()});`;
    },
    ListStmt_remove_at(_rem, _item, idx, _from, list) {
      return `${list.toJS()}.splice(${idx.toJS()}, 1);`;
    },
    PropTerm(node) {
      return node.sourceString;
    },
    FileStmt_save(_save, content, _to, path) {
      return `fs.writeFileSync(${path.toJS()}, ${content.toJS()});`;
    },
    FileStmt_read(_read, _from, path) {
      return `fs.readFileSync(${path.toJS()}, 'utf8');`;
    },
    NavigateStmt(_go, _to, expr) {
      return `window.location.href = ${expr.toJS()};`;
    },
    AskExpr(_ask, str) {
      return `prompt(${str.toJS()})`;
    },
    SizeExpr(_size, _of, id) {
      return `${id.toJS()}.length`;
    },
    MathExpr_average(_avg, _of, id) {
      const i = id.toJS();
      return `(${i}.reduce((a, b) => a + b, 0) / ${i}.length)`;
    },
    MathExpr_min(_min, _of, id) {
      return `__kadence_min(${id.toJS()})`;
    },
    MathExpr_max(_max, _of, id) {
      return `__kadence_max(${id.toJS()})`;
    },
    MathExpr_round(_round, expr) {
      return `Math.round(${expr.toJS()})`;
    },
    MathExpr_floor(_floor, expr) {
      return `Math.floor(${expr.toJS()})`;
    },
    MathExpr_ceil(_ceil, expr) {
      return `Math.ceil(${expr.toJS()})`;
    },
    MathExpr_abs(_abs, expr) {
      return `Math.abs(${expr.toJS()})`;
    },
    MathExpr_sqrt(_sqrt, _root, expr) {
      return `Math.sqrt(${expr.toJS()})`;
    },
    MathExpr_pow(_pow, base, _to, exp) {
      return `Math.pow(${base.toJS()}, ${exp.toJS()})`;
    },
    MathExpr_sin(_sin, expr) {
      return `Math.sin(${expr.toJS()})`;
    },
    MathExpr_cos(_cos, expr) {
      return `Math.cos(${expr.toJS()})`;
    },
    MathExpr_tan(_tan, expr) {
      return `Math.tan(${expr.toJS()})`;
    },

    ListExpr_sort(_sort, expr) {
      return `[...${expr.toJS()}].sort()`;
    },
    ListExpr_reverse(_reverse, expr) {
      return `[...${expr.toJS()}].reverse()`;
    },
    ListExpr_push(_push, val, _to, array) {
      return `(() => { const _a = ${array.toJS()}; _a.push(${val.toJS()}); return _a; })()`;
    },
    ListExpr_pop(_pop, _from, array) {
      return `${array.toJS()}.pop()`;
    },

    ObjectExpr_keys(_keys, _of, expr) {
      return `Object.keys(${expr.toJS()})`;
    },
    ObjectExpr_values(_values, _of, expr) {
      return `Object.values(${expr.toJS()})`;
    },
    ObjectExpr_merge(_merge, a, _with, b) {
      return `Object.assign({}, ${a.toJS()}, ${b.toJS()})`;
    },
    ReadExpr(_read, _from, path) {
      return `fs.readFileSync(${path.toJS()}, 'utf8')`;
    },
    TimeExpr_time(_the, _time, _now) {
      return `new Date().toLocaleTimeString()`;
    },
    TimeExpr_date(_the, _date, _today) {
      return `new Date().toLocaleDateString()`;
    },
    ConvertExpr(_convert, expr, _to, type) {
      const t = type.toJS();
      if (t === "number") return `Number(${expr.toJS()})`;
      if (t === "string") return `String(${expr.toJS()})`;
      if (t === "bool") return `Boolean(${expr.toJS()})`;
      if (t === "object") return `Object(${expr.toJS()})`;
      return `${t}(${expr.toJS()})`;
    },
    AwaitExpr(_await, expr) {
      return `await ${expr.toJS()}`;
    },
    NewExpr_paren(_new, id, _lp, args, _rp) {
      return `new ${id.sourceString}(${args
        .asIteration()
        .children.map((a) => a.toJS())
        .join(", ")})`;
    },
    NewExpr_classic(_new, id, args) {
      return `new ${id.sourceString}(${args
        .children.map((a) => a.toJS())
        .join(", ")})`;
    },
    ObjectLiteral(_objKw, _lb, pairs, _rb) {
      const pairStrs = pairs
        .asIteration()
        .children.map((p) => p.toJS())
        .join(", ");
      return `{ ${pairStrs} }`;
    },
    ObjectPair_pair(key, _colon, value) {
      return `${key.toJS()}: ${value.toJS()}`;
    },
    ObjectPair_shorthand(id) {
      return id.toJS();
    },
    ObjectPair_spread(spread) {
      return spread.toJS();
    },
    ArrayMethod_map(_map, array, _with, lambda) {
      return `${array.toJS()}.map(${lambda.toJS()})`;
    },
    ArrayMethod_filter(_filter, array, _where, lambda) {
      return `${array.toJS()}.filter(${lambda.toJS()})`;
    },
    ArrayMethod_reduce(_reduce, array, _from, init, _with, lambda) {
      return `${array.toJS()}.reduce(${lambda.toJS()}, ${init.toJS()})`;
    },
    ArrayMethod_find(_find, array, _where, lambda) {
      return `${array.toJS()}.find(${lambda.toJS()})`;
    },
    ArrayMethod_some(_some, array, _where, lambda) {
      return `${array.toJS()}.some(${lambda.toJS()})`;
    },
    ArrayMethod_every(_every, array, _where, lambda) {
      return `${array.toJS()}.every(${lambda.toJS()})`;
    },
    HttpExpr_get(_get, _from, url) {
      return `fetch(${url.toJS()}).then(r => r.json())`;
    },
    HttpExpr_post(_post, _to, url, _with, data) {
      return `fetch(${url.toJS()}, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(${data.toJS()})}).then(r => r.json())`;
    },
    HttpExpr_put(_put, _to, url, _with, data) {
      return `fetch(${url.toJS()}, {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(${data.toJS()})}).then(r => r.json())`;
    },
    HttpExpr_delete(_delete, _from, url) {
      return `fetch(${url.toJS()}, {method: 'DELETE'}).then(r => r.json())`;
    },
    JsonExpr_parse(_parse, _json, _from, str) {
      return `JSON.parse(${str.toJS()})`;
    },
    JsonExpr_stringify(_stringify, obj, _to, _json) {
      return `JSON.stringify(${obj.toJS()})`;
    },
    RegexExpr_create(_regex, pattern) {
      return `new RegExp(${pattern.toJS()})`;
    },
    RegexExpr_extractAll(_extract, _all, pattern, _from, str) {
      return `${str.toJS()}.match(${pattern.toJS()})`;
    },
    StringCheck(child) {
      return child.toJS();
    },
    MatchCheck(str, _matches, pattern) {
      return `${pattern.toJS()}.test(${str.toJS()})`;
    },
    StringCmd_split(_split, str, _by, delim) {
      return `${str.toJS()}.split(${delim.toJS()})`;
    },
    StringCmd_join(_join, array, _with, delim) {
      return `${array.toJS()}.join(${delim.toJS()})`;
    },
    StringCmd_trim(_trim, str) {
      return `${str.toJS()}.trim()`;
    },
    StringCmd_replace(_replace, search, _with, replacement, _in, str) {
      return `${str.toJS()}.replace(${search.toJS()}, ${replacement.toJS()})`;
    },
    StringCmd_indexOf(_index, _of, search, _in, str) {
      return `${str.toJS()}.indexOf(${search.toJS()})`;
    },
    StringCmd_lastIndexOf(_last, _index, _of, search, _in, str) {
      return `${str.toJS()}.lastIndexOf(${search.toJS()})`;
    },

    StringCheck_includes(str, _includes, search) {
      return `${str.toJS()}.includes(${search.toJS()})`;
    },
    StringCheck_startsWith(str, _starts, _with, search) {
      return `${str.toJS()}.startsWith(${search.toJS()})`;
    },
    StringCheck_endsWith(str, _ends, _with, search) {
      return `${str.toJS()}.endsWith(${search.toJS()})`;
    },
    Comparison_string_check(child) {
      return child.toJS();
    },
    Comparison_property_check(child) {
      return child.toJS();
    },
    PropertyCheck(obj, _has, prop) {
      return `(${prop.toJS()} in ${obj.toJS()})`;
    },

    SpreadExpr(_dots, expr) {
      return `...${expr.toJS()}`;
    },
    RangeExpr(_range, start, _to, end) {
      return `Array.from({length: ${end.toJS()} - ${start.toJS()} + 1}, (_, i) => i + ${start.toJS()})`;
    },
    Lambda_simple(param, _arrow, body) {
      const asyncKw = body.hasAwait() ? "async " : "";
      return `${asyncKw}${param.toJS()} => ${body.toJS()}`;
    },
    Lambda_multi(_lp, params, _rp, _arrow, body) {
      const asyncKw = body.hasAwait() ? "async " : "";
      return `${asyncKw}(${params
        .asIteration()
        .children.map((p) => p.toJS())
        .join(", ")}) => ${body.toJS()}`;
    },
    MemberAccess_chain(id, segs) {
      let r = id.toJS();
      for (const seg of segs.children) {
        r = r + seg.toJS();
      }
      return r;
    },
    MemberAccess_this(_this) {
      return "this";
    },
    MemberAccess_super(_super) {
      return "super";
    },
    MemberAccessSeg_prop(_dot, prop) {
      return `.${prop.toJS()}`;
    },
    MemberAccessSeg_index(_lb, index, _rb) {
      return `[${index.toJS()}]`;
    },
    MemberAccessSeg_opt_prop(_opt, prop) {
      return `?.${prop.toJS()}`;
    },
    MemberAccessSeg_opt_index(_opt, _lb, index, _rb) {
      return `?.[${index.toJS()}]`;
    },
    CreateExpr_call(_create, _elem, str) {
      return `document.createElement(${str.toJS()})`;
    },
    ReturnStmt(_ret, expr) {
      return `return ${expr.toJS()};`;
    },
    IncrementStmt_word(_inc, id) {
      return `${id.toJS()}++;`;
    },
    IncrementStmt_sym(id, _sym) {
      return `${id.toJS()}++;`;
    },
    DecrementStmt_word(_dec, id) {
      return `${id.toJS()}--;`;
    },
    DecrementStmt_sym(id, _sym) {
      return `${id.toJS()}--;`;
    },
    WaitStmt(_wait, expr, _unit) {
      return `await new Promise(r => setTimeout(r, ${expr.toJS()} * 1000));`;
    },
    RandomExpr_range(_rand, _num, _from, min, _to, max) {
      return `Math.floor(Math.random() * (${max.toJS()} - ${min.toJS()} + 1)) + ${min.toJS()}`;
    },
    RandomExpr_float(_rand) {
      return `Math.random()`;
    },
    TypeCheck(expr, _is, _a, type) {
      const t = type.toJS();
      if (t === "number") return `typeof ${expr.toJS()} === 'number'`;
      if (t === "string") return `typeof ${expr.toJS()} === 'string'`;
      if (t === "bool") return `typeof ${expr.toJS()} === 'boolean'`;
      if (t === "list") return `Array.isArray(${expr.toJS()})`;
      return `typeof ${expr.toJS()} === '${t}'`;
    },
    TypeTerm(node) {
      return node.sourceString;
    },
    Primary_transform(child) {
      return child.toJS();
    },
    TransformExpr(op, expr) {
      const o = op.toJS();
      if (o === "uppercase") return `(${expr.toJS()}).toString().toUpperCase()`;
      if (o === "lowercase") return `(${expr.toJS()}).toString().toLowerCase()`;
      return expr.toJS();
    },
    Comparison_type_check(child) {
      return child.toJS();
    },
    Primary_regex(child) {
      return child.toJS();
    },
    Primary_range(child) {
      return child.toJS();
    },
    IfStmt(_if, cond, block, elifKws, elifConds, elifBlocks, _elseKw, elseBlock) {
      let result = `if (${cond.toJS()}) ${block.toJS()} `;

      const elifC = elifConds.children;
      const elifB = elifBlocks.children;
      for (let i = 0; i < elifC.length; i++) {
        result += ` else if (${elifC[i].toJS()}) ${elifB[i].toJS()} `;
      }

      if (_elseKw.children.length > 0) {
        result += ` else ${elseBlock.children[0].toJS()} `;
      }

      return result;
    },
    WhileStmt(_while, cond, block) {
      return `while (${cond.toJS()}) ${block.toJS()} `;
    },
    ForStmt(_for, _each, id, _in, expr, block) {
      return `for (let ${id.toJS()} of ${expr.toJS()}) ${block.toJS()}`;
    },
    WhenStmt(_when, target, _is, event, block) {
      let eventName = event.toJS();
      if (eventName === "clicked") eventName = "click";
      const asyncKw = block.hasAwait() ? "async " : "";
      return `${target.toJS()}.addEventListener('${eventName}', ${asyncKw}() => ${block.toJS()});`;
    },
    EchoStmt(_echo, expr) {
      return `__kadence_echo(${expr.toJS()}); `;
    },
    ExpressionStmt(expr) {
      return `${expr.toJS()}; `;
    },
    BreakStmt(_break) {
      return "break; ";
    },
    ContinueStmt(_continue) {
      return "continue; ";
    },
    Block(_lb, statements, _rb) {
      return `{ \n${statements.children.map((s) => "  " + s.toJS()).join("\n")} \n } `;
    },
    CoalesceExpr_coalesce(left, _op, right) {
      return `${left.toJS()} ?? ${right.toJS()}`;
    },
    TypeofExpr(_typeof, expr) {
      return `typeof ${expr.toJS()}`;
    },
    CoalesceExpr(child) {
      return child.toJS();
    },
    OrExpr_word(left, _or, right) {
      return `${left.toJS()} || ${right.toJS()}`;
    },
    OrExpr_sym(left, _op, right) {
      return `${left.toJS()} || ${right.toJS()} `;
    },
    OrExpr(child) {
      return child.toJS();
    },
    AndExpr_word(left, _and, right) {
      return `${left.toJS()} && ${right.toJS()} `;
    },
    AndExpr_sym(left, _op, right) {
      return `${left.toJS()} && ${right.toJS()} `;
    },
    AndExpr(child) {
      return child.toJS();
    },
    NotExpr_word(_not, expr) {
      return `!(${expr.toJS()})`;
    },
    NotExpr_sym(_op, expr) {
      return `!(${expr.toJS()})`;
    },
    NotExpr(child) {
      return child.toJS();
    },
    Comparison_full(left, op, right) {
      const l = left.toJS();
      currentSubject = l; // UPDATE SUBJECT
      return `${l} ${op.toJS()} ${right.toJS()} `;
    },
    Comparison_short(op, right) {
      return `${currentSubject} ${op.toJS()} ${right.toJS()} `;
    },
    Comparison_base(child) {
      const res = child.toJS();
      currentSubject = res; // UPDATE SUBJECT
      return res;
    },
    CompareOp_eq_sym_double(_op) {
      return "===";
    },
    CompareOp_eq_sym(_op) {
      return "===";
    },
    CompareOp_eq_word(_op) {
      return "===";
    },
    CompareOp_neq_sym(_op) {
      return "!==";
    },
    CompareOp_neq_word(_not, _equals) {
      return "!==";
    },
    CompareOp_gt_sym(_op) {
      return ">";
    },
    CompareOp_gt_word(_more, _than) {
      return ">";
    },
    CompareOp_lt_sym(_op) {
      return "<";
    },
    CompareOp_lt_word(_less, _than) {
      return "<";
    },
    CompareOp_gte_sym(_op) {
      return ">=";
    },
    CompareOp_gte_word(_at, _least) {
      return ">=";
    },
    CompareOp_lte_sym(_op) {
      return "<=";
    },
    CompareOp_lte_word(_at, _most) {
      return "<=";
    },
    Additive_add_word(left, _plus, right) {
      return `${left.toJS()} + ${right.toJS()} `;
    },
    Additive_add_sym(left, _plus, right) {
      return `${left.toJS()} + ${right.toJS()} `;
    },
    Additive_sub_word(left, _minus, right) {
      return `${left.toJS()} - ${right.toJS()} `;
    },
    Additive_sub_sym(left, _minus, right) {
      return `${left.toJS()} - ${right.toJS()} `;
    },
    Additive(child) {
      return child.toJS();
    },
    BitwiseShift_left(l, _op, r) { return `${l.toJS()} << ${r.toJS()}`; },
    BitwiseShift_right(l, _op, r) { return `${l.toJS()} >> ${r.toJS()}`; },
    BitwiseShift(child) { return child.toJS(); },
    BitwiseAnd_bin(l, _op, r) { return `${l.toJS()} & ${r.toJS()}`; },
    BitwiseAnd(child) { return child.toJS(); },
    BitwiseXor_bin(l, _op, r) { return `${l.toJS()} ^ ${r.toJS()}`; },
    BitwiseXor(child) { return child.toJS(); },
    BitwiseOr_bin(l, _op, r) { return `${l.toJS()} | ${r.toJS()}`; },
    BitwiseOr(child) { return child.toJS(); },
    Multiplicative_mul_sym(left, _times, right) {
      return `${left.toJS()} * ${right.toJS()} `;
    },
    Multiplicative_mul_word(left, _times, right) {
      return `${left.toJS()} * ${right.toJS()} `;
    },
    Multiplicative_div(left, _op, right) {
      return `${left.toJS()} / ${right.toJS()}`;
    },
    Multiplicative_div_word(left, _divided, _by, right) {
      return `${left.toJS()} / ${right.toJS()}`;
    },
    Multiplicative(child) {
      return child.toJS();
    },
    Primary_list(child) {
      return child.toJS();
    },
    Primary_lambda(child) {
      return child.toJS();
    },
    Primary_access(child) {
      return child.toJS();
    },
    Primary_call(child) {
      return child.toJS();
    },
    Primary_math(child) {
      return child.toJS();
    },
    Primary_string(child) {
      return child.toJS();
    },
    Primary_arrayay(child) {
      return child.toJS();
    },
    Primary_list_op(child) {
      return child.toJS();
    },
    Primary_object(child) {
      return child.toJS();
    },
    Primary_json(child) {
      return child.toJS();
    },
    Primary_http(child) {
      return child.toJS();
    },
    Primary_ask(child) {
      return child.toJS();
    },
    Primary_size(child) {
      return child.toJS();
    },
    Primary_random(child) {
      return child.toJS();
    },
    Primary_read(child) {
      return child.toJS();
    },
    Primary_time(child) {
      return child.toJS();
    },
    Primary_convert(child) {
      return child.toJS();
    },
    Primary_member(child) {
      return child.toJS();
    },
    Primary_pi(_pi) {
      return `Math.PI`;
    },
    Primary_num(child) {
      return child.toJS();
    },
    Primary_bool(child) {
      return child.toJS();
    },
    Primary_null(_n) {
      return `null`;
    },
    Primary_undefined(_u) {
      return `undefined`;
    },
    Primary_str(child) {
      return child.toJS();
    },
    Primary_paren(_lp, expr, _rp) {
      return `(${expr.toJS()})`;
    },
    Call_paren(id, _lp, args, _rp) {
      const argList = args.asIteration().children.map((a) => a.toJS()).join(", ");
      return `${id.toJS()}(${argList})`;
    },
    RunCall(_run, member, args) {
      const argList = args.children.map((a) => a.toJS()).join(", ");
      return `${member.toJS()}(${argList})`;
    },
    Call_run(_run, id, args) {
      const argList = args.children.map((a) => a.toJS()).join(", ");
      return `${id.toJS()}(${argList})`;
    },
    Arg(child) {
      return child.toJS();
    },
    Arg_paren(_lp, expr, _rp) {
      return `(${expr.toJS()})`;
    },
    List(_list, args) {
      const argList = args.children.map((a) => a.toJS()).join(", ");
      return `[${argList}]`;
    },
    ItemAccess(_item, index, _from, list) {
      return `${list.toJS()}[${index.toJS()}]`;
    },
    MemberAccess_this(_this) {
      return "this";
    },
    MemberAccess_super(_super) {
      return "super";
    },
    string(child) {
      return child.toJS();
    },
    doubleString(_l, parts, _r) {
      return "`" + parts.children.map((p) => p.toJS()).join("") + "`";
    },
    templateString(_l, parts, _r) {
      return "`" + parts.children.map((p) => p.toJS()).join("") + "`";
    },
    escape(_slash, char) {
      const c = char.sourceString;
      if (c === "n") return "\\n";
      if (c === "t") return "\\t";
      if (c === "r") return "\\r";
      if (c === '"') return '\\"';
      if (c === "\\") return "\\\\";
      if (c === "`") return "\\`";
      return "\\" + c;
    },
    textDouble(char) {
      return char.sourceString;
    },
    textBacktick(char) {
      return char.sourceString;
    },
    interpolation(_l, content, _r) {
      const exprMatch = grammar.match(content.sourceString, "Expression");
      if (exprMatch.failed()) {
        throw new Error(`Invalid expression in string interpolation: ${exprMatch.message}`);
      }
      return "${" + semantics(exprMatch).toJS() + "}";
    },
    bool(val) {
      return val.sourceString;
    },
    word(_first, _rest) {
      return this.sourceString;
    },
    identifier(w) {
      return w.toJS();
    },
    number(_digits, _dot, _fract) {
      return this.sourceString;
    },
    _iter(...children) {
      return children.map((c) => c.toJS());
    },
    _terminal() {
      return this.sourceString;
    },
  });

semantics.addOperation("getName", {
  Program(_statements) {
    return "";
  },
  FunctionDecl_paren(_fn, id, _lp, _params, _rp, _block) {
    return id.sourceString;
  },
  FunctionDecl_classic(_fn, id, _params, _block) {
    return id.sourceString;
  },
  AsyncFunctionDecl_paren(_async, _fn, id, _lp, _params, _rp, _block) {
    return id.sourceString;
  },
  AsyncFunctionDecl_classic(_async, _fn, id, _params, _block) {
    return id.sourceString;
  },
  ClassDecl(_class, id, _extendsKw, _superId, _lb, _members, _rb) {
    return id.sourceString;
  },
  VariableDecl(_let, pattern, _eq, _expr) {
    return pattern.getName();
  },
  ConstantDecl(_const, pattern, _eq, _expr) {
    return pattern.getName();
  },
  BindingPattern_object(_lb, ids, _rb) {
    return ids.asIteration().children.map(i => i.sourceString).join(", ");
  },
  BindingPattern_list(_lb, ids, _rb) {
    return ids.asIteration().children.map(i => i.sourceString).join(", ");
  },
  BindingPattern_base(id) {
    return id.getName();
  },
  word(_first, _rest) {
    return this.sourceString;
  },
  identifier(w) {
    return w.sourceString;
  },
  Declaration(decl) {
    return decl.getName();
  },
  _iter(...children) {
    return children.map((c) => c.getName());
  },
  _terminal() {
    return this.sourceString;
  },
});

const analyzer = grammar.createSemantics();

analyzer.addOperation("getName", {
  Program(_statements) {
    return "";
  },
  FunctionDecl_paren(_fn, id, _lp, _params, _rp, _block) {
    return id.sourceString;
  },
  FunctionDecl_classic(_fn, id, _params, _block) {
    return id.sourceString;
  },
  AsyncFunctionDecl_paren(_async, _fn, id, _lp, _params, _rp, _block) {
    return id.sourceString;
  },
  AsyncFunctionDecl_classic(_async, _fn, id, _params, _block) {
    return id.sourceString;
  },
  ClassDecl(_class, id, _ext, _superId, _lb, _members, _rb) {
    return id.sourceString;
  },
  VariableDecl(_let, pattern, _eq, _expr) {
    return pattern.getName();
  },
  ConstantDecl(_const, pattern, _eq, _expr) {
    return pattern.getName();
  },
  BindingPattern_object(_lb, ids, _rb) {
    return ids.asIteration().children.map(i => i.sourceString).join(", ");
  },
  BindingPattern_list(_lb, ids, _rb) {
    return ids.asIteration().children.map(i => i.sourceString).join(", ");
  },
  BindingPattern_base(id) {
    return id.sourceString;
  },
  Param_rest(_dots, id) {
    return id.sourceString;
  },
  Param_default(id, _eq, _expr) {
    return id.sourceString;
  },
  Param_base(id) {
    return id.sourceString;
  },
  Declaration(decl) {
    return decl.getName();
  },
});

analyzer.addOperation("analyze(context)", {
  Program(statements) {
    statements.analyze(this.args.context);
  },
  FunctionDecl_paren(_fn, id, _lp, params, _rp, block) {
    const context = this.args.context;
    context.symbols.add(id.sourceString);
    const funcContext = { symbols: new Set(context.symbols) };
    params.asIteration().children.forEach((p) => funcContext.symbols.add(p.getName()));
    block.analyze(funcContext);
  },
  FunctionDecl_classic(_fn, id, params, block) {
    const context = this.args.context;
    context.symbols.add(id.sourceString);
    const funcContext = { symbols: new Set(context.symbols) };
    params.children.forEach((p) => funcContext.symbols.add(p.getName()));
    block.analyze(funcContext);
  },
  ClassDecl(_class, id, _extends, superId, _lb, members, _rb) {
    const context = this.args.context;
    context.symbols.add(id.sourceString);
    members.analyze(context);
  },
  MethodDecl(_static, _private, _fn, _id, params, block) {
    const context = this.args.context;
    const methodContext = { symbols: new Set(context.symbols) };
    methodContext.symbols.add("this");
    params.children.forEach((p) => methodContext.symbols.add(p.getName()));
    block.analyze(methodContext);
  },
  PropertyDecl(_static, _private, _id, _eq, expr) {
    expr.analyze(this.args.context);
  },
  ImportStmt_all(_import, _path, _as, id) {
    this.args.context.symbols.add(id.sourceString);
  },
  ImportStmt_named(_import, _lb, ids, _rb, _from, _path) {
    ids.asIteration().children.forEach((id) => {
      this.args.context.symbols.add(id.sourceString);
    });
  },
  ExportStmt_default(_export, _default, expr) {
    expr.analyze(this.args.context);
  },
  ExportStmt_named(_export, decl) {
    decl.analyze(this.args.context);
  },
  AsyncFunctionDecl_paren(_async, _fn, id, _lp, params, _rp, block) {
    const context = this.args.context;
    context.symbols.add(id.sourceString);
    const funcContext = { symbols: new Set(context.symbols) };
    params.asIteration().children.forEach((p) => funcContext.symbols.add(p.getName()));
    block.analyze(funcContext);
  },
  AsyncFunctionDecl_classic(_async, _fn, id, params, block) {
    const context = this.args.context;
    context.symbols.add(id.sourceString);
    const funcContext = { symbols: new Set(context.symbols) };
    params.children.forEach((p) => funcContext.symbols.add(p.getName()));
    block.analyze(funcContext);
  },
  NewExpr_paren(_new, id, _lp, args, _rp) {
    const context = this.args.context;
    const className = id.sourceString;
    if (!context.symbols.has(className) && className !== "Date" && className !== "RegExp" && className !== "URL" && className !== "Promise") {
      semanticError(this, `Semantic Error: Unknown class "${className}" (use a declared class or check spelling)`);
    }
    args.analyze(context);
  },
  NewExpr_classic(_new, id, args) {
    const context = this.args.context;
    const className = id.sourceString;
    if (!context.symbols.has(className) && className !== "Date" && className !== "RegExp" && className !== "URL" && className !== "Promise") {
      semanticError(this, `Semantic Error: Unknown class "${className}" (use a declared class or check spelling)`);
    }
    args.analyze(context);
  },
  VariableDecl(_let, pattern, _eq, expr) {
    const context = this.args.context;
    pattern.analyze(context);
    expr.analyze(context);
  },
  ConstantDecl(_const, pattern, _eq, expr) {
    const context = this.args.context;
    pattern.analyze(context);
    expr.analyze(context);
  },
  BindingPattern_object(_lb, ids, _rb) {
    const context = this.args.context;
    ids.asIteration().children.forEach(id => context.symbols.add(id.sourceString));
  },
  BindingPattern_list(_lb, ids, _rb) {
    const context = this.args.context;
    ids.asIteration().children.forEach(id => context.symbols.add(id.sourceString));
  },
  BindingPattern_base(id) {
    this.args.context.symbols.add(id.sourceString);
  },
  Assignment_simple(member, _op, expr) {
    const context = this.args.context;
    member.analyze(context);
    expr.analyze(context);
  },
  Assignment_destructure(pattern, _op, expr) {
    const context = this.args.context;
    expr.analyze(context);
    pattern.getName().split(", ").forEach(name => {
      if (!context.symbols.has(name.trim())) {
        semanticError(this, `Semantic Error: Undefined variable "${name.trim()}" in destructuring`);
      }
    });
  },
  Block(_lb, statements, _rb) {
    const blockContext = { symbols: new Set(this.args.context.symbols) };
    statements.analyze(blockContext);
  },
  TryStmt(_try, tryBlock, _catch, errorId, catchBlock) {
    const context = this.args.context;
    tryBlock.analyze(context);
    const catchContext = { symbols: new Set(context.symbols) };
    catchContext.symbols.add(errorId.sourceString);
    catchBlock.analyze(catchContext);
  },
  MatchStmt(_match, expr, _open, cases, elseCase, _close) {
    const context = this.args.context;
    expr.analyze(context);
    cases.analyze(context);
    if (elseCase.children.length > 0) elseCase.analyze(context);
  },
  MatchCase(_when, expr, _then, stmt) {
    const context = this.args.context;
    expr.analyze(context);
    stmt.analyze(context);
  },
  MatchElse(_else, stmt) {
    stmt.analyze(this.args.context);
  },
  RepeatStmt(_repeat, count, _unit, block) {
    count.analyze(this.args.context);
    block.analyze(this.args.context);
  },
  IfStmt(_if, cond, block, elifKws, elifConds, elifBlocks, _elseKw, elseBlock) {
    const context = this.args.context;
    cond.analyze(context);
    block.analyze(context);
    elifConds.analyze(context);
    elifBlocks.analyze(context);
    if (elseBlock.children.length > 0) elseBlock.analyze(context);
  },
  WhileStmt(_while, cond, block) {
    const context = this.args.context;
    cond.analyze(context);
    block.analyze(context);
  },
  ForStmt(_for, _each, id, _in, expr, block) {
    const context = this.args.context;
    expr.analyze(context);
    const forContext = { symbols: new Set(context.symbols) };
    forContext.symbols.add(id.sourceString);
    block.analyze(forContext);
  },
  WhenStmt(_when, target, _is, event, block) {
    block.analyze(this.args.context);
  },
  Call_paren(id, _lp, args, _rp) {
    const context = this.args.context;
    id.analyze(context);
    args.analyze(context);
  },
  RunCall(_run, member, args) {
    const context = this.args.context;
    member.analyze(context);
    args.analyze(context);
  },
  Call_run(_run, id, args) {
    const context = this.args.context;
    id.analyze(context);
    args.analyze(context);
  },
  SetStmt_style(_set, _prop, _of, target, _to, val) {
    target.analyze(this.args.context);
    val.analyze(this.args.context);
  },
  SetStmt_prop(_set, target, _prop, _to, val) {
    target.analyze(this.args.context);
    val.analyze(this.args.context);
  },
  SetStmt_simple(_set, target, _to, val) {
    target.analyze(this.args.context);
    val.analyze(this.args.context);
  },
  PropertyCheck(obj, _has, prop) {
    const context = this.args.context;
    obj.analyze(context);
    prop.analyze(context);
  },
  ObjectPair_shorthand(id) {
    id.analyze(this.args.context);
  },
  Lambda_simple(param, _arrayow, body) {
    const context = this.args.context;
    const lambdaContext = { symbols: new Set(context.symbols) };
    lambdaContext.symbols.add(param.sourceString);
    body.analyze(lambdaContext);
  },
  Lambda_multi(_lp, params, _rp, _arrayow, body) {
    const context = this.args.context;
    const lambdaContext = { symbols: new Set(context.symbols) };
    params.asIteration().children.forEach((p) => lambdaContext.symbols.add(p.sourceString));
    body.analyze(lambdaContext);
  },
  MemberAccess_chain(id, segs) {
    const context = this.args.context;
    const name = id.sourceString;
    const globals = [
      "document",
      "window",
      "console",
      "game",
      "Math",
      "fs",
      "Array",
      "Number",
      "String",
      "Boolean",
      "alert",
      "prompt",
      "confirm",
      "location",
      "localStorage",
      "sessionStorage",
      "fetch",
      "setTimeout",
      "setInterval",
      "clearTimeout",
      "clearInterval",
      "JSON",
      "Object",
      "RegExp",
      "Date",
      "pi",
      "it",
      "null",
      "undefined",
      "require",
      "process",
      "Buffer",
      "URL",
      "Promise",
      "encodeURIComponent",
      "decodeURIComponent",
      "globalThis",
    ];
    if (!context.symbols.has(name) && !globals.includes(name)) {
      semanticError(id, `Semantic Error: Using undefined variable "${name}"`);
    }
    segs.children.forEach((seg) => seg.analyze(this.args.context));
  },
  MemberAccess_this(_this) {
    // 'this' is always allowed
  },
  MemberAccessSeg_prop(_dot, _prop) {},
  MemberAccessSeg_index(_lb, expr, _rb) {
    expr.analyze(this.args.context);
  },
  MemberAccessSeg_opt_prop(_opt, _prop) {},
  MemberAccessSeg_opt_index(_opt, _lb, expr, _rb) {
    expr.analyze(this.args.context);
  },
  word(_first, _rest) { },
  identifier(w) { w.analyze(this.args.context); },
  _iter(...children) {
    children.forEach((c) => c.analyze(this.args.context));
  },
  _terminal() { },
  _nonterminal(...children) {
    children.forEach((c) => c.analyze(this.args.context));
  },
});

function semanticError(node, msg) {
  const { line, col } = getLineCol(node.source.startIdx);
  throw new Error(`${msg} (line ${line}, col ${col})`);
}

function compile(source, options) {
  compileOptions = Object.assign({ target: "node", sourceFile: "source.kade" }, options);
  source = source.replace(/^\\uFEFF/, "");
  const preprocessed = preprocess(source);
  initLineMap(preprocessed);
  const match = grammar.match(preprocessed);
  if (match.failed()) {
    // Set KADENCE_TRACE_PARSE=1 to dump Ohm parse trace on failure (for grammar debugging).
    if (process.env.KADENCE_TRACE_PARSE) {
      const trace = grammar.trace(preprocessed);
      console.error('=== Parse trace ===\n' + trace.toString());
    }
    throw new Error(match.message);
  }

  const root = match;
  try {
    analyzer(root).analyze({ symbols: new Set() });
  } catch (e) {
    throw new Error(e.message);
  }

  if (compileOptions.sourcemap) {
    const node = semantics(match).toNode();
    const result = node.toStringWithSourceMap();
    return {
      code: result.code,
      map: result.map.toString()
    };
  }

  return semantics(match).toJS();
}

module.exports = { compile, preprocess };
