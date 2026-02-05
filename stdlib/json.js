const fs = require("fs"); 

function __kadence_echo(val) {
    const s = String(val);
    const low = s.toLowerCase();
    if (typeof process !== 'undefined' && process.stdout && process.stdout.isTTY) {
        if (low.includes('error')) console.log("\x1b[31m" + s + "\x1b[0m");
        else if (low.includes('warning')) console.log("\x1b[33m" + s + "\x1b[0m");
        else if (low.includes('success')) console.log("\x1b[32m" + s + "\x1b[0m");
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
 
let fsMod = require(`fs`); 
function readJson (path) { 
  if (!((fsMod.existsSync(path)))) { 
  return null; 
 }  
  let content = fsMod.readFileSync(path, `utf8`); 
  return JSON.parse(content); 
 }
if (typeof exports !== 'undefined') exports.readJson = readJson;
function writeJson (path, data) { 
  let str = JSON.stringify(data); 
  fsMod.writeFileSync(path, str);  
 }
if (typeof exports !== 'undefined') exports.writeJson = writeJson;
function format (data) { 
  return JSON.stringify(data, null, 2); 
 }
if (typeof exports !== 'undefined') exports.format = format;
function parseSafe (text) { 
  try { 
  return JSON.parse(text); 
 }  catch(e) { 
  return null; 
 }   
 }
if (typeof exports !== 'undefined') exports.parseSafe = parseSafe; 
(async () => { 
 
 })().catch(err => { if (err) console.error("\x1b[31mRuntime Error:\x1b[0m", err.stack || err.message); }); 