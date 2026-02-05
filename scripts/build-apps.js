#!/usr/bin/env node
/**
 * Build apps: website (into apps/website) and game (apps/game/game.kade -> game.js).
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const websiteDir = path.join(root, "apps", "website");
const componentsDir = path.join(websiteDir, "components");
const { compile } = require(path.join(root, "src", "compiler"));

function buildCompilerBrowser() {
  try {
    execSync(
      "npx esbuild src/compiler.js --bundle --format=iife --global-name=KadenceCompiler --outfile=apps/website/compiler-browser.js --platform=browser --alias:fs=./scripts/fs-stub.js",
      { cwd: root, stdio: "pipe" }
    );
    console.log("  Built apps/website/compiler-browser.js");
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
  let code = componentJs
    .replace(/^\(function\s*\(\)\s*\{\s*/, "(function () { var exports = {}; ");
  const lastClose = code.lastIndexOf("})();");
  if (lastClose !== -1) {
    code = code.slice(0, lastClose) + " return exports; " + code.slice(lastClose);
  }
  return code;
}

console.log("Building apps/website...");
buildCompilerBrowser();

const componentNames = fs.readdirSync(componentsDir)
  .filter((f) => f.endsWith(".kade"))
  .map((f) => path.basename(f, ".kade"));

componentNames.forEach((name) => {
  const src = path.join(componentsDir, `${name}.kade`);
  const out = path.join(componentsDir, `${name}.js`);
  compileCde(src, out);
  console.log("  Compiled apps/website/components/" + name + ".kade");
});

compileCde(path.join(websiteDir, "index.kade"), path.join(websiteDir, "index.js"));
console.log("  Compiled apps/website/index.kade");



let indexJs = fs.readFileSync(path.join(websiteDir, "index.js"), "utf8");
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

fs.writeFileSync(path.join(websiteDir, "index.js"), indexJs, "utf8");
console.log("  Bundled apps/website/index.js");

console.log("Done.");
