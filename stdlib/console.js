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
 
function log (message) { 
  console.log(message);  
 }
if (typeof exports !== 'undefined') exports.log = log;
function error (message) { 
  console.error(message);  
 }
if (typeof exports !== 'undefined') exports.error = error;
function red (text) { 
  return `\x1b[31m` + text  + `\x1b[0m` ; 
 }
if (typeof exports !== 'undefined') exports.red = red;
function green (text) { 
  return `\x1b[32m` + text  + `\x1b[0m` ; 
 }
if (typeof exports !== 'undefined') exports.green = green;
function bold (text) { 
  return `\x1b[1m` + text  + `\x1b[0m` ; 
 }
if (typeof exports !== 'undefined') exports.bold = bold; 
(async () => { 
 
 })().catch(err => { if (err) console.error("\x1b[31mRuntime Error:\x1b[0m", err.stack || err.message); }); 