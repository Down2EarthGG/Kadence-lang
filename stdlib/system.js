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
 
let os = require(`os`); 
function platform () { 
  return os.platform(); 
 }
if (typeof exports !== 'undefined') exports.platform = platform;
function arch () { 
  return os.arch(); 
 }
if (typeof exports !== 'undefined') exports.arch = arch;
function cpus () { 
  return os.cpus(); 
 }
if (typeof exports !== 'undefined') exports.cpus = cpus;
function totalMemory () { 
  return os.totalmem(); 
 }
if (typeof exports !== 'undefined') exports.totalMemory = totalMemory;
function freeMemory () { 
  return os.freemem(); 
 }
if (typeof exports !== 'undefined') exports.freeMemory = freeMemory;
function homedir () { 
  return os.homedir(); 
 }
if (typeof exports !== 'undefined') exports.homedir = homedir;
function hostname () { 
  return os.hostname(); 
 }
if (typeof exports !== 'undefined') exports.hostname = hostname; 
(async () => { 
 
 })().catch(err => { if (err) console.error("\x1b[31mRuntime Error:\x1b[0m", err.stack || err.message); }); 