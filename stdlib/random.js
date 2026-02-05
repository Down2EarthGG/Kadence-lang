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
 
function float (min, max) { 
  return min + (Math.random() * (max - min ) ) ; 
 }
if (typeof exports !== 'undefined') exports.float = float;
function integer (min, max) { 
  let rangeVal = (max - min ) + 1 ; 
  let factor = Math.random(); 
  return Math.floor((min + (factor * rangeVal ) )); 
 }
if (typeof exports !== 'undefined') exports.integer = integer;
function choice (items) { 
  let len = items.length; 
  if (len === 0 ) { 
  return ``; 
 }  
  let idx = integer(0, (len - 1 )); 
  return items[idx]; 
 }
if (typeof exports !== 'undefined') exports.choice = choice;
function shuffle (items) { 
  let res = []; 
  let temp = []; 
  for (let x of items) { 
  __kadence_add(temp, x); 
 } 
  let n = temp.length; 
  for (let __i = 0; __i < n; __i++) { 
  let idx = integer(0, ((temp.length) - 1 )); 
  let picked = temp[idx]; 
  __kadence_add(res, picked);
  temp.splice(idx, 1); 
 }  
  return res; 
 }
if (typeof exports !== 'undefined') exports.shuffle = shuffle;
function uuid () { 
  let chars = `0123456789abcdef`; 
  let result = `#`; 
  for (let __i = 0; __i < 6; __i++) { 
  let idx = integer(0, 15); 
  let result = result + (chars[idx]) ;  
 }  
  return result; 
 }
if (typeof exports !== 'undefined') exports.uuid = uuid; 
(async () => { 
 
 })().catch(err => { if (err) console.error("\x1b[31mRuntime Error:\x1b[0m", err.stack || err.message); }); 