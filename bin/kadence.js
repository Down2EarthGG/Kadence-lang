#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { execSync } = require("child_process");
const { compile } = require("../src/compiler");

const VERSION = "0.2.0";

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  dim: "\x1b[2m",
};

function log(msg, color = colors.reset) {
  console.log(`${color}${msg}${colors.reset}`);
}

/** Normalize package spec to name (e.g. @scope/pkg@1.0.0 -> @scope/pkg, lodash@1.0.0 -> lodash). */
function getPkgName(pkg) {
  if (!pkg) return "";
  if (pkg.startsWith("@")) {
    const parts = pkg.split("@");
    return parts.length >= 3 ? "@" + parts[1] + "/" + parts[2] : pkg;
  }
  return pkg.split("@")[0];
}

function printHelp() {
  log(`Kadence CLI v${VERSION}`, colors.bright + colors.cyan);
  console.log(`
Usage:
  kadence                Start interactive REPL
  kadence <file>         Compile and run a .kade file
  kadence -c <file>      Compile to JavaScript only
  kadence -c <file> -o <out> --target browser   Compile for browser (no Node APIs)
  kadence -c <file> -o <out> --sourcemap        Emit source map for debugging
  kadence create <name> [--web] [--yes]  Create project folder and run npm install
  kadence init [--web]    Initialize a new project in current directory
  kadence install <pkg>  Install a package (npm/github)
  kadence uninstall <pkg> Remove a package
  kadence update         Update all dependencies
  kadence list           List installed packages
  kadence run <script>   Run a script from kadence.json
  kadence build         Compile all .kade files in project
  kadence test          Run all .test.kade files
  kadence docs          Generate documentation from comments
  kadence dev           Start Vite development server
  kadence -v             Show version
  kadence help           Show this help
    `);
}

function compileFile(filename, opts = {}) {
  const fullPath = path.resolve(filename);
  if (!fs.existsSync(fullPath)) return false;
  const source = fs.readFileSync(fullPath, "utf8").trim();
  try {
    const result = compile(source, Object.assign({ target: "node", sourceFile: path.basename(fullPath) }, opts));
    const js = typeof result === "string" ? result : result.code;
    const map = typeof result === "object" ? result.map : null;

    let outPath = opts.outputFile;
    if (!outPath) {
      if (opts.outputDir) {
        const rel = path.relative(opts.baseDir || process.cwd(), fullPath);
        outPath = path.join(opts.outputDir, rel.replace(/\.kade$/, ".js"));
        const outDir = path.dirname(outPath);
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
      } else {
        outPath = fullPath.replace(/\.kade$/, ".js");
      }
    }

    let toWrite = js;
    if (opts.sourcemap && map) {
      const mapPath = outPath + ".map";
      fs.writeFileSync(mapPath, map, "utf8");
      toWrite = js + "\n//# sourceMappingURL=" + path.basename(mapPath);
    }

    fs.writeFileSync(outPath, toWrite, "utf8");
    return true;
  } catch (e) {
    log(`Error in ${filename}: ${e.message}`, colors.red);
    return false;
  }
}

function buildProject(dir = process.cwd(), isRoot = true, opts = {}) {
  if (isRoot) {
    log(`Building project in ${dir}...`, colors.cyan);
    if (fs.existsSync(path.join(dir, "kadence.json"))) {
      const _config = JSON.parse(fs.readFileSync(path.join(dir, "kadence.json"), "utf8"));
      // Default convention: src -> dist
      opts.outputDir = opts.outputDir || path.join(dir, "dist");
      opts.baseDir = opts.baseDir || path.join(dir, "src");
      if (fs.existsSync(opts.baseDir)) {
        dir = opts.baseDir;
      }
    }
  }

  const files = fs.readdirSync(dir);
  let count = 0;
  files.forEach((file) => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      if (file !== "node_modules" && file !== "dist" && !file.startsWith(".")) {
        count += buildProject(full, false, opts);
      }
    } else if (file.endsWith(".kade")) {
      if (compileFile(full, opts)) {
        log(`  Compiled ${path.relative(process.cwd(), full)}`, colors.dim);
        count++;
      }
    }
  });
  if (isRoot) log(`Done. Compiled ${count} files.`, colors.green);
  return count;
}

/** Write project scaffold into targetDir. opts: { projectName, version, description, author, isWeb }. */
function writeScaffold(targetDir, opts) {
  const { projectName, version, description, author, isWeb } = opts;
  const dirs = ["src", "dist", "src/components", "src/lib", "src/assets"];
  dirs.forEach((d) => {
    const full = path.join(targetDir, d);
    if (!fs.existsSync(full)) fs.mkdirSync(full, { recursive: true });
  });

  const config = {
    name: projectName,
    version: version || "1.0.0",
    description: description || "",
    author: author || "",
    scripts: isWeb
      ? { dev: "kadence dev", build: "kadence build --web", preview: "vite preview" }
      : { start: "kadence src/main.kade", build: "kadence build" },
    dependencies: {},
  };

  const mainKade = path.join(targetDir, "src", "main.kade");
  if (!fs.existsSync(mainKade)) {
    fs.writeFileSync(mainKade, "// Welcome to your new Kadence project!\nsay \"Hello, World!\"\n", "utf8");
  }

  const gitignore = path.join(targetDir, ".gitignore");
  if (!fs.existsSync(gitignore)) {
    fs.writeFileSync(gitignore, "node_modules/\ndist/\n*.js\n*.js.map\n", "utf8");
  }

  const kadenceConfig = path.join(targetDir, "kadence.config.js");
  if (!fs.existsSync(kadenceConfig)) {
    fs.writeFileSync(
      kadenceConfig,
      "/** @type {import('kadence-lang').Config} */\nmodule.exports = {\n  outDir: 'dist',\n  srcDir: 'src',\n  target: 'node'\n};\n",
      "utf8"
    );
  }

  fs.writeFileSync(path.join(targetDir, "kadence.json"), JSON.stringify(config, null, 2));

  const pkgPath = path.join(targetDir, "package.json");
  if (!fs.existsSync(pkgPath)) {
    const pkg = {
      name: projectName,
      version: version || "1.0.0",
      type: "commonjs",
      dependencies: { "kadence-lang": "latest" },
    };
    if (isWeb) {
      pkg.devDependencies = { vite: "latest", "vite-plugin-kadence": "latest" };
    }
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  }

  if (isWeb) {
    const indexHtml = path.join(targetDir, "index.html");
    if (!fs.existsSync(indexHtml)) {
      fs.writeFileSync(
        indexHtml,
        `<!DOCTYPE html>
<html>
<head>
    <title>${projectName}</title>
</head>
<body>
    <div id="app"></div>
    <script type="module" src="/src/main.kade"></script>
</body>
</html>`,
        "utf8"
      );
    }
    const viteConfig = path.join(targetDir, "vite.config.js");
    if (!fs.existsSync(viteConfig)) {
      fs.writeFileSync(
        viteConfig,
        `import { defineConfig } from 'vite';
import { kadencePlugin } from './vite-plugin-kadence';

export default defineConfig({
  plugins: [kadencePlugin()]
});`,
        "utf8"
      );
    }
    const pluginSrc = path.join(__dirname, "../src/vite-plugin-kadence.js");
    const pluginDest = path.join(targetDir, "vite-plugin-kadence.js");
    if (fs.existsSync(pluginSrc) && !fs.existsSync(pluginDest)) {
      fs.copyFileSync(pluginSrc, pluginDest);
    }
  }
}

function initProject() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  log("Initialize Kadence Project", colors.bright + colors.cyan);

  rl.question(`Project name (${path.basename(process.cwd())}): `, (name) => {
    const projectName = name || path.basename(process.cwd());
    rl.question("Version (1.0.0): ", (ver) => {
      const version = ver || "1.0.0";
      rl.question("Description: ", (desc) => {
        const description = desc || "";
        rl.question("Author: ", (author) => {
          const isWeb = process.argv.includes("--web");
          writeScaffold(process.cwd(), {
            projectName,
            version,
            description,
            author: author || "",
            isWeb,
          });
          log(`\n✨ Project '${projectName}' initialized.`, colors.green);
          log(`Next steps:\n  npm install\n  ${isWeb ? "kadence dev" : "kadence run start"}`, colors.dim);
          rl.close();
          process.exit(0);
        });
      });
    });
  });
}

function createProject(appName) {
  const isWeb = process.argv.includes("--web");
  if (!appName || appName.startsWith("-")) {
    log("Usage: kadence create <project-name> [--web] [--yes]", colors.red);
    log("Example: kadence create my-app --web", colors.dim);
    process.exit(1);
  }
  const targetDir = path.resolve(process.cwd(), appName);
  if (fs.existsSync(targetDir)) {
    const stat = fs.statSync(targetDir);
    if (stat.isDirectory() && fs.readdirSync(targetDir).length > 0) {
      log(`Error: Directory '${appName}' already exists and is not empty.`, colors.red);
      process.exit(1);
    }
  }
  log(`Creating Kadence project '${appName}'...`, colors.cyan);
  fs.mkdirSync(targetDir, { recursive: true });
  writeScaffold(targetDir, {
    projectName: appName,
    version: "1.0.0",
    description: "",
    author: "",
    isWeb,
  });
  log(`✨ Project created. Installing dependencies...`, colors.green);
  try {
    execSync("npm install", { cwd: targetDir, stdio: "inherit" });
  } catch (_e) {
    log("npm install failed. Run 'npm install' inside the project manually.", colors.yellow);
  }
  log(`\nNext steps:`, colors.bright);
  log(`  cd ${appName}`, colors.cyan);
  log(`  ${isWeb ? "npm run dev" : "npm run start"}`, colors.cyan);
  process.exit(0);
}

function installPackage(pkg) {
  if (!pkg) {
    // If no package specified, install all from kadence.json
    if (fs.existsSync("kadence.json")) {
      const config = JSON.parse(fs.readFileSync("kadence.json", "utf8"));
      const deps = Object.keys(config.dependencies || {});
      if (deps.length === 0) {
        log("No dependencies to install.", colors.yellow);
        process.exit(0);
      }
      log(`Installing ${deps.length} dependencies...`, colors.cyan);
      deps.forEach((d) => {
        try {
          execSync(`npm install ${d}`, { stdio: "inherit" });
        } catch (_e) {
          log(`Failed to install ${d}`, colors.red);
        }
      });
      log("All dependencies installed.", colors.green);
      process.exit(0);
    } else {
      log("Usage: kadence install <package_name>", colors.red);
      log("Or run 'kadence init' first to create kadence.json", colors.dim);
      process.exit(1);
    }
  }

  log(`Installing ${pkg}...`, colors.cyan);

  // Initialize package.json if not exists
  if (!fs.existsSync("package.json")) {
    execSync("npm init -y", { stdio: "ignore" });
  }

  try {
    execSync(`npm install ${pkg}`, { stdio: "inherit" });

    // Get actual installed version from package.json
    const pkgName = getPkgName(pkg);
    let installedVersion = "latest";
    if (fs.existsSync("package.json")) {
      const npmPkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
      if (npmPkg.dependencies && npmPkg.dependencies[pkgName]) {
        installedVersion = npmPkg.dependencies[pkgName];
      }
    }

    // Update kadence.json (create if missing)
    let config;
    if (fs.existsSync("kadence.json")) {
      config = JSON.parse(fs.readFileSync("kadence.json", "utf8"));
    } else {
      config = {
        name:
          (fs.existsSync("package.json")
            ? JSON.parse(fs.readFileSync("package.json", "utf8")).name
            : null) || path.basename(process.cwd()),
        version:
          (fs.existsSync("package.json")
            ? JSON.parse(fs.readFileSync("package.json", "utf8")).version
            : null) || "1.0.0",
        dependencies: {},
      };
    }
    config.dependencies = config.dependencies || {};
    config.dependencies[pkgName] = installedVersion;
    fs.writeFileSync("kadence.json", JSON.stringify(config, null, 2));
    log(`Added ${pkgName}@${installedVersion} to kadence.json`, colors.green);

    // Auto-compile if it's a Kadence package
    const pkgDir = path.join("node_modules", pkgName);
    if (
      fs.existsSync(path.join(pkgDir, "kadence.json")) ||
      fs.readdirSync(pkgDir).some((f) => f.endsWith(".kade"))
    ) {
      log(`Kadence package detected. Compiling...`, colors.blue);
      buildProject(pkgDir, false);
    }
  } catch (_e) {
    log(`Failed to install ${pkg}`, colors.red);
    process.exit(1);
  }
  process.exit(0);
}

function uninstallPackage(pkg) {
  if (!pkg) {
    log("Usage: kadence uninstall <package_name>", colors.red);
    process.exit(1);
  }

  log(`Uninstalling ${pkg}...`, colors.cyan);

  try {
    execSync(`npm uninstall ${pkg}`, { stdio: "inherit" });

    const pkgName = getPkgName(pkg);
    if (fs.existsSync("kadence.json")) {
      const config = JSON.parse(fs.readFileSync("kadence.json", "utf8"));
      if (config.dependencies && config.dependencies[pkgName]) {
        delete config.dependencies[pkgName];
        fs.writeFileSync("kadence.json", JSON.stringify(config, null, 2));
        log(`Removed ${pkgName} from kadence.json`, colors.green);
      }
    }
    process.exit(0);
  } catch (_e) {
    log(`Failed to uninstall ${pkg}`, colors.red);
    process.exit(1);
  }
}

function updatePackages() {
  log("Updating all packages...", colors.cyan);

  try {
    execSync("npm update", { stdio: "inherit" });

    // Sync versions back to kadence.json
    if (fs.existsSync("kadence.json") && fs.existsSync("package.json")) {
      const config = JSON.parse(fs.readFileSync("kadence.json", "utf8"));
      const npmPkg = JSON.parse(fs.readFileSync("package.json", "utf8"));

      for (const dep of Object.keys(config.dependencies || {})) {
        if (npmPkg.dependencies && npmPkg.dependencies[dep]) {
          config.dependencies[dep] = npmPkg.dependencies[dep];
        }
      }
      fs.writeFileSync("kadence.json", JSON.stringify(config, null, 2));
      log("Updated kadence.json with new versions.", colors.green);
    }
  } catch (_e) {
    log("Failed to update packages.", colors.red);
    process.exit(1);
  }
  process.exit(0);
}

function listPackages() {
  log("Installed Packages:", colors.bright + colors.cyan);

  if (!fs.existsSync("kadence.json")) {
    log("No kadence.json found. Run 'kadence init' first.", colors.yellow);
    process.exit(0);
  }

  const config = JSON.parse(fs.readFileSync("kadence.json", "utf8"));
  const deps = config.dependencies || {};
  const depList = Object.entries(deps);

  if (depList.length === 0) {
    log("  (no dependencies)", colors.dim);
  } else {
    depList.forEach(([name, version]) => {
      log(`  ${name}: ${version}`, colors.reset);
    });
  }
  process.exit(0);
}

function runScript(scriptName) {
  if (!fs.existsSync("kadence.json")) {
    log("No kadence.json found. Run 'kadence init' first.", colors.red);
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync("kadence.json", "utf8"));
  const scripts = config.scripts || {};

  if (!scriptName) {
    log("Available scripts:", colors.cyan);
    const scriptList = Object.keys(scripts);
    if (scriptList.length === 0) {
      log("  (no scripts defined)", colors.dim);
    } else {
      scriptList.forEach((s) => log(`  ${s}: ${scripts[s]}`, colors.reset));
    }
    process.exit(0);
  }

  if (!scripts[scriptName]) {
    log(`Script '${scriptName}' not found in kadence.json`, colors.red);
    process.exit(1);
  }

  const scriptFile = scripts[scriptName];
  log(`Running ${scriptName}: ${scriptFile}`, colors.blue);

  try {
    // If it's a .kade file, run it with kadence
    if (scriptFile.endsWith(".kade")) {
      execSync(`node "${__filename}" "${scriptFile}"`, { stdio: "inherit" });
    } else {
      execSync(scriptFile, { stdio: "inherit", shell: true });
    }
  } catch (_e) {
    process.exit(1);
  }
  process.exit(0);
}

/**
 * REPL with history, context persistence, and basic completion.
 */
function startRepl() {
  const vm = require("vm");
  const repl = require("repl");

  log(`Kadence ${VERSION} ♪`, colors.bright + colors.green);
  log(`Type '.exit' to quit. Context is preserved.`, colors.dim);
  console.log("");

  // Create a persistent context for the session
  const context = vm.createContext({
    require: require,
    console: console,
    process: process,
    exports: {},
    module: { exports: {} },
    __kadence_echo: (val) => { console.log("\x1b[32m" + String(val) + "\x1b[0m"); },
    __kadence_add: (p, c) => Array.isArray(p) ? p.push(c) : p.appendChild(c),
    __kadence_min: (v) => Array.isArray(v) ? Math.min(...v) : v,
    __kadence_max: (v) => Array.isArray(v) ? Math.max(...v) : v,
    fs: require('fs')
  });

  // Custom eval function that compiles Kadence -> JS -> runs in VM
  function kadenceEval(cmd, _context, _filename, callback) {
    const input = cmd.trim();
    if (!input) return callback(null);

    // Filter out REPL commands
    if (input.startsWith(".")) {
      // Allow default REPL commands to handle it if we return undefined?
      // Actually standard Node REPL handles .exit etc before this.
    }

    try {
      // Compile snippet to JS body
      // We wrap it in an async IIFE to support top-level await if needed
      // But for variables to persist, we need to strip 'let'/'const' maybe?
      // Or just compile it as a program.

      // Attempt to compile
      const compiled = compile(input, { target: "node", sourceFile: "repl" });

      // The compiler outputs a full program with "const fs = require..." 
      // We need to strip the preamble for REPL use to avoid redeclaration errors
      // and allow "let x = 1" to stick in the global scope if possible.

      let jsParams = compiled.replace(/const fs = require\("fs"\);/g, "")
        .replace(/const \S+ = require\(.*\);/g, "") // Strip imports for now
        .replace(/^\s*function __kadence_.+?}/gms, "") // Strip helpers
        .replace(/^\(async \(\) => {\s*/, "") // Strip wrapper start
        .replace(/\s*}\)\(\)\.catch\(.+?\);?\s*$/, ""); // Strip wrapper end

      // Run in the persistent context
      const result = vm.runInContext(jsParams, context);
      callback(null, result);
    } catch (e) {
      if (e.message.includes("Unexpected end of input")) {
        return callback(new repl.Recoverable(e));
      }
      callback(e);
    }
  }

  const r = repl.start({
    prompt: `${colors.cyan}kadence> ${colors.reset}`,
    eval: kadenceEval,
    writer: (output) => {
      // format output nicely
      if (output === undefined) return "";
      return require("util").inspect(output, { colors: true });
    },
    useColors: true
  });

  // Expose context to REPL
  Object.assign(r.context, context);
}

function runTests(dir = process.cwd()) {
  if (dir === process.cwd()) log(`Running tests...`, colors.cyan);

  const stats = { total: 0, passed: 0, failed: 0 };
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      if (file !== "node_modules" && file !== "dist" && !file.startsWith(".")) {
        const subStats = runTests(full);
        stats.total += subStats.total;
        stats.passed += subStats.passed;
        stats.failed += subStats.failed;
      }
    } else if (file.endsWith(".test.kade")) {
      stats.total++;
      log(`\n📄 ${path.relative(process.cwd(), full)}`, colors.bright);
      const src = fs.readFileSync(full, "utf8");
      try {
        // Compile
        const built = compile(src, { target: "node", sourceFile: file });

        // Run
        const tempFile = path.join(dir, `.${file}.js`);
        fs.writeFileSync(tempFile, built);

        try {
          // We run synchronously to capture output in order
          execSync(`node "${tempFile}"`, {
            stdio: "inherit",
            cwd: dir,
            env: { ...process.env, KADENCE_TEST_MODE: "true" }
          });
          stats.passed++;
        } catch (_err) {
          stats.failed++;
          // output already shown
        } finally {
          if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
        }
      } catch (e) {
        log(`  Compilation Error: ${e.message}`, colors.red);
        stats.failed++;
      }
    }
  });

  if (dir === process.cwd()) {
    console.log("");
    log("--- Test Summary ---", colors.bright);
    if (stats.failed > 0) log(`Tests: ${stats.failed} failed, ${stats.passed} passed, ${stats.total} total`, colors.red);
    else log(`Tests: ${stats.passed} passed, ${stats.total} total`, colors.green);
  }
  return stats;
}

function generateDocs(dir = process.cwd(), isRoot = true) {
  if (isRoot) log(`Generating documentation...`, colors.cyan);

  const files = fs.readdirSync(dir);
  const docs = [];

  files.forEach((file) => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      if (file !== "node_modules" && file !== "dist" && !file.startsWith(".")) {
        docs.push(...generateDocs(full, false));
      }
    } else if (file.endsWith(".kade")) {
      const content = fs.readFileSync(full, "utf8");
      const lines = content.split("\n");
      let currentNote = "";

      lines.forEach((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("note:")) {
          currentNote = trimmed.replace(/^note:\s*/, "").trim();
        } else if (trimmed.startsWith("export function ") || trimmed.startsWith("export async function ")) {
          const name = trimmed.replace(/^export (async )?function /, "").split(/[ ([]/)[0];
          docs.push({ file: path.relative(process.cwd(), full), name, note: currentNote, type: "function" });
          currentNote = "";
        } else if (trimmed.startsWith("export const ") || trimmed.startsWith("export let ")) {
          const name = trimmed.replace(/^export (const|let) /, "").split(/[ =]/)[0];
          docs.push({ file: path.relative(process.cwd(), full), name, note: currentNote, type: "variable" });
          currentNote = "";
        } else if (trimmed.length > 0) {
          // If a line is not a note and not an export, reset note if it was just a floating note
          // But we keep it if it was immediately above
        }
      });
    }
  });

  if (isRoot) {
    if (docs.length === 0) {
      log("No exported functions or variables found.", colors.yellow);
    } else {
      log("\n📖 API Documentation\n", colors.bright + colors.green);
      let currentFile = "";
      docs.forEach((d) => {
        if (d.file !== currentFile) {
          log(`\n📄 ${d.file}`, colors.blue + colors.bright);
          currentFile = d.file;
        }
        const typeChar = d.type === "function" ? "ƒ" : "ν";
        log(`  ${colors.yellow}${typeChar} ${colors.reset}${colors.bright}${d.name}${colors.reset}${d.note ? " - " + colors.dim + d.note : ""}`);
      });
      console.log("");
    }
  }

  return docs;
}

const args = process.argv.slice(2);

if (args.length === 0) {
  startRepl();
} else if (args[0] === "help") {
  printHelp();
} else if (args[0] === "-v") {
  log(`Kadence ${VERSION}`, colors.green);
} else if (args[0] === "create") {
  createProject(args[1]);
} else if (args[0] === "init") {
  initProject();
} else if (args[0] === "install") {
  installPackage(args[1]);
} else if (args[0] === "uninstall" || args[0] === "remove") {
  uninstallPackage(args[1]);
} else if (args[0] === "update") {
  updatePackages();
} else if (args[0] === "list" || args[0] === "ls") {
  listPackages();
} else if (args[0] === "dev") {
  try {
    execSync("npx vite", { stdio: "inherit" });
  } catch (_e) {
    process.exit(1);
  }
} else if (args[0] === "run") {
  runScript(args[1]);
} else if (args[0] === "build") {
  buildProject();
  process.exit(0);
} else if (args[0] === "test") {
  runTests();
  process.exit(0);
} else if (args[0] === "docs") {
  generateDocs();
  process.exit(0);
} else {
  let compileOnly = false;
  let outputFile = null;
  let filename = null;
  let target = "node";
  let sourcemap = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "-c") compileOnly = true;
    else if (args[i] === "-o" && args[i + 1]) {
      outputFile = args[i + 1];
      i++;
    } else if ((args[i] === "--target" || args[i] === "-t") && args[i + 1]) {
      target = args[i + 1];
      i++;
    } else if (args[i] === "--sourcemap") sourcemap = true;
    else if (!filename) filename = args[i];
  }

  if (!filename) {
    log("Error: No file specified", colors.red);
    process.exit(1);
  }

  const fullPath = path.resolve(filename);
  if (!fs.existsSync(fullPath)) {
    log(`Error: File not found: ${filename}`, colors.red);
    process.exit(1);
  }

  const source = fs.readFileSync(fullPath, "utf8").trim();

  try {
    const result = compile(source, { target, sourcemap, sourceFile: path.basename(fullPath) });
    const js = typeof result === "string" ? result : result.code;
    const map = typeof result === "object" ? result.map : null;

    if (outputFile) {
      let toWrite = js;
      const outPath = path.resolve(outputFile);
      if (sourcemap && map) {
        const mapPath = outPath + ".map";
        fs.writeFileSync(mapPath, map, "utf8");
        toWrite = js + "\n//# sourceMappingURL=" + path.basename(mapPath);
      }
      fs.writeFileSync(outPath, toWrite, "utf8");
      log(`Successfully compiled to ${outputFile}`, colors.green);
    } else if (compileOnly) {
      console.log(js);
    } else {
      log(`--- Running ${path.basename(filename)} ---`, colors.blue);

      const tempDir = path.dirname(fullPath);
      const tempFile = path.join(tempDir, `.${path.basename(filename)}.js`);
      let jsToRun = js;
      if (sourcemap && map) {
        const mapPath = tempFile + ".map";
        fs.writeFileSync(mapPath, map, "utf8");
        jsToRun = js + "\n//# sourceMappingURL=" + path.basename(mapPath);
      }
      fs.writeFileSync(tempFile, jsToRun, "utf8");

      try {
        const nodeCmd = sourcemap
          ? `node --enable-source-maps "${tempFile}"`
          : `node "${tempFile}"`;
        execSync(nodeCmd, { stdio: "inherit", cwd: tempDir });
      } catch (_err) {
        // Error is already printed by inherit stdio
      } finally {
        if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
        const tempMap = tempFile + ".map";
        if (fs.existsSync(tempMap)) fs.unlinkSync(tempMap);
      }
    }
  } catch (e) {
    log("Kadence Error:", colors.red + colors.bright);
    console.error(e.message);
    process.exit(1);
  }
}
