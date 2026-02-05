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
 
function first (array) { 
  return array[0]; 
 }
if (typeof exports !== 'undefined') exports.first = first;
function lastOf (array) { 
  let n = array.length; 
  let idx = n - 1 ; 
  return array[idx]; 
 }
if (typeof exports !== 'undefined') exports.lastOf = lastOf;
function isEmpty (array) { 
  let len = array.length; 
  return len === 0 ; 
 }
if (typeof exports !== 'undefined') exports.isEmpty = isEmpty;
function length (array) { 
  return array.length; 
 }
if (typeof exports !== 'undefined') exports.length = length;
function contains (array, itemToFind) { 
  let found = false; 
  for (let x of array) { 
  if (x === itemToFind ) { 
  let found = true;  
 }   
 } 
  return found; 
 }
if (typeof exports !== 'undefined') exports.contains = contains;
function unique (array) { 
  let result = []; 
  for (let x of array) { 
  let found = false; 
  for (let r of result) { 
  if (r === x ) { 
  found = true;  
 }   
 } 
  if (!(found)) { 
  __kadence_add(result, x); 
 }   
 } 
  return result; 
 }
if (typeof exports !== 'undefined') exports.unique = unique; 
(async () => { 
 
 })().catch(err => { if (err) console.error("\x1b[31mRuntime Error:\x1b[0m", err.stack || err.message); }); 