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
 
let term = require(`./console.js`); 
let testHelpers = require(`./test-helpers.js`); 
function suite (name, callback) { 
  __kadence_echo(`Suite: ` + name ); 
  if (callback !== undefined ) { 
  callback();  
 }  
  return true; 
 }
if (typeof exports !== 'undefined') exports.suite = suite;
function assertEquals (actual, expected, message) { 
  if (actual === expected ) { 
  let colored = term.green(`PASS`); 
  __kadence_echo(colored + `: `  + message ); 
  return true; 
 }   else { 
  let colored = term.red(`FAIL`); 
  __kadence_echo(colored + `: `  + message ); 
  __kadence_echo(`  Expected: ` + expected ); 
  __kadence_echo(`  Actual: ` + actual ); 
  return false; 
 }   
 }
if (typeof exports !== 'undefined') exports.assertEquals = assertEquals;
function assertTrue (value, message) { 
  if (value) { 
  let colored = term.green(`PASS`); 
  __kadence_echo(colored + `: `  + message ); 
  return true; 
 }   else { 
  let colored = term.red(`FAIL`); 
  __kadence_echo(colored + `: `  + message ); 
  return false; 
 }   
 }
if (typeof exports !== 'undefined') exports.assertTrue = assertTrue;
function assertFalse (value, message) { 
  if (!(value)) { 
  let colored = term.green(`PASS`); 
  __kadence_echo(colored + `: `  + message ); 
  return true; 
 }   else { 
  let colored = term.red(`FAIL`); 
  __kadence_echo(colored + `: `  + message ); 
  return false; 
 }   
 }
if (typeof exports !== 'undefined') exports.assertFalse = assertFalse;
function assertThrows (fn, message) { 
  let result = testHelpers.assertThrows(fn); 
  if (result.threw) { 
  let colored = term.green(`PASS`); 
  __kadence_echo(colored + `: `  + message ); 
  return true; 
 }   else { 
  let colored = term.red(`FAIL`); 
  __kadence_echo(colored + `: `  + message ); 
  __kadence_echo(`  Expected function to throw`); 
  return false; 
 }   
 }
if (typeof exports !== 'undefined') exports.assertThrows = assertThrows; 
(async () => { 
 
 })().catch(err => { if (err) console.error("\x1b[31mRuntime Error:\x1b[0m", err.stack || err.message); }); 