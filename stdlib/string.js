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
 
function words (text) { 
  return text.split(` `); 
 }
if (typeof exports !== 'undefined') exports.words = words;
function lines (text) { 
  return text.split(`\n`); 
 }
if (typeof exports !== 'undefined') exports.lines = lines;
function trimmed (text) { 
  return text.trim(); 
 }
if (typeof exports !== 'undefined') exports.trimmed = trimmed;
function capitalized (text) { 
  let len = text.length; 
  if (len === 0 ) { 
  return text; 
 }  
  let firstChar = ((text[0])).toString().toUpperCase(); 
  if (text === 1 .length) { 
  return firstChar; 
 }  
  let parts = text.split(``); 
  let rest = []; 
  let idx = 1; 
  while (idx < parts.length ) { 
  __kadence_add(rest, parts[idx]);
  idx++; 
 }  
  return firstChar + (rest.join(``)) ; 
 }
if (typeof exports !== 'undefined') exports.capitalized = capitalized;
function isEmpty (text) { 
  return text === 0 .length; 
 }
if (typeof exports !== 'undefined') exports.isEmpty = isEmpty; 
(async () => { 
 
 })().catch(err => { if (err) console.error("\x1b[31mRuntime Error:\x1b[0m", err.stack || err.message); }); 