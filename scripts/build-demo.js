#!/usr/bin/env node
/**
 * Build website (apps/website): compile all .kade (index + components) and bundle for browser.
 * Layout matches JS projects: /components, index entry.
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const demoDir = path.join(root, "apps", "website");
const componentsDir = path.join(demoDir, "components");
const { compile } = require(path.join(root, "src", "compiler"));

function buildCompilerBrowser() {
  try {
    execSync(
      "npx esbuild src/compiler.js --bundle --format=iife --global-name=KadenceCompiler --outfile=apps/website/compiler-browser.js --platform=browser --alias:fs=./scripts/fs-stub.js",
      { cwd: root, stdio: "pipe" }
    );
    console.log("  Built compiler-browser.js");
  } catch (_e) {
    console.warn("  Skipped compiler-browser.js (esbuild failed); Run will not execute editor code.");
  }
}

function compileCde(inputPath, outputPath) {
  const source = fs.readFileSync(inputPath, "utf8").trim();
  const js = compile(source, { target: "browser" });
  fs.writeFileSync(outputPath, js, "utf8");
}

function wrapComponentModule(componentJs) {
  // Inject exports so the IIFE can return the module
  let code = componentJs
    .replace(/^\(function\s*\(\)\s*\{\s*/, "(function () { var exports = {}; ");
  // Replace the outer IIFE's closing })(); with return exports; })();
  // (last occurrence is the outer IIFE; the first is the async one)
  const lastClose = code.lastIndexOf("})();");
  if (lastClose !== -1) {
    code = code.slice(0, lastClose) + " return exports; " + code.slice(lastClose);
  }
  return code;
}

// 0. Build compiler for browser (so Run can execute editor code)
buildCompilerBrowser();

// 1. Compile all component .kade to .js
const componentNames = fs.readdirSync(componentsDir)
  .filter((f) => f.endsWith(".kade"))
  .map((f) => path.basename(f, ".kade"));

componentNames.forEach((name) => {
  const src = path.join(componentsDir, `${name}.kade`);
  const out = path.join(componentsDir, `${name}.js`);
  compileCde(src, out);
  console.log(`  Compiled components/${name}.kade`);
});

// 2. Compile index.kade to index.js (full page for standalone use)
compileCde(path.join(demoDir, "index.kade"), path.join(demoDir, "index.js"));
console.log("  Compiled index.kade");

// 3. Bundle: inline component requires into index.js for browser
let indexJs = fs.readFileSync(path.join(demoDir, "index.js"), "utf8");

const requireRe = /const\s+(\w+)\s*=\s*require\s*\(\s*[`"']\.\/components\/(\w+)\.js[`"']\s*\)\s*;\s*/g;
const required = [];
let match;
while ((match = requireRe.exec(indexJs)) !== null) {
  required.push({ varName: match[1], file: match[2] });
}

required.forEach(({ varName, file }) => {
  const compPath = path.join(componentsDir, `${file}.js`);
  const compJs = fs.readFileSync(compPath, "utf8");
  const wrapped = wrapComponentModule(compJs);
  const replacement = `const ${varName} = ${wrapped.trim()}\n`;
  indexJs = indexJs.replace(
    new RegExp(`const\\s+${varName}\\s*=\\s*require\\s*\\(\\s*[\`"']\\.\\/components\\/${file}\\.js[\`"']\\s*\\)\\s*;\\s*`, "g"),
    replacement
  );
});

fs.writeFileSync(path.join(demoDir, "index.js"), indexJs, "utf8");
console.log("  Bundled index.js for browser");
console.log("Done.");
