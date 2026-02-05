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
 
function currentTime () { 
  return new Date(); 
 }
if (typeof exports !== 'undefined') exports.currentTime = currentTime;
function today () { 
  return new Date(); 
 }
if (typeof exports !== 'undefined') exports.today = today;
function year (d) { 
  return d.getFullYear(); 
 }
if (typeof exports !== 'undefined') exports.year = year;
function month (d) { 
  let m = d.getMonth(); 
  return m + 1 ; 
 }
if (typeof exports !== 'undefined') exports.month = month;
function day (d) { 
  return d.getDate(); 
 }
if (typeof exports !== 'undefined') exports.day = day;
function toIso (d) { 
  return d.toISOString(); 
 }
if (typeof exports !== 'undefined') exports.toIso = toIso;
function addDays (d, n) { 
  let result = new Date(d); 
  result.setDate(result.getDate() + n ); 
  return result; 
 }
if (typeof exports !== 'undefined') exports.addDays = addDays; 
(async () => { 
 
 })().catch(err => { if (err) console.error("\x1b[31mRuntime Error:\x1b[0m", err.stack || err.message); }); 