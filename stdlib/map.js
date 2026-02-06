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
 
let mod = require(`./object-helpers.js`); 
function keys (obj) { 
  return mod.keys(obj); 
 }
if (typeof exports !== 'undefined') exports.keys = keys;
function values (obj) { 
  return mod.values(obj); 
 }
if (typeof exports !== 'undefined') exports.values = values;
function entries (obj) { 
  return mod.entries(obj); 
 }
if (typeof exports !== 'undefined') exports.entries = entries;
function hasKey (obj, key) { 
  return mod.hasKey(obj, key); 
 }
if (typeof exports !== 'undefined') exports.hasKey = hasKey;
function merge (obj1, obj2) { 
  return mod.merge(obj1, obj2); 
 }
if (typeof exports !== 'undefined') exports.merge = merge;
function pick (obj, keysArray) { 
  return mod.pick(obj, keysArray); 
 }
if (typeof exports !== 'undefined') exports.pick = pick;
function omit (obj, keysArray) { 
  return mod.omit(obj, keysArray); 
 }
if (typeof exports !== 'undefined') exports.omit = omit;
function mapValues (obj, fn) { 
  return mod.mapValues(obj, fn); 
 }
if (typeof exports !== 'undefined') exports.mapValues = mapValues;
function mapKeys (obj, fn) { 
  return mod.mapKeys(obj, fn); 
 }
if (typeof exports !== 'undefined') exports.mapKeys = mapKeys;
function invert (obj) { 
  return mod.invert(obj); 
 }
if (typeof exports !== 'undefined') exports.invert = invert;
function deepClone (obj) { 
  return mod.deepClone(obj); 
 }
if (typeof exports !== 'undefined') exports.deepClone = deepClone;
function getPath (obj, path) { 
  return mod.get(obj, path); 
 }
if (typeof exports !== 'undefined') exports.getPath = getPath;
function defaults (obj, defs) { 
  return mod.defaults(obj, defs); 
 }
if (typeof exports !== 'undefined') exports.defaults = defaults;
function isEmpty (obj) { 
  let allKeys = Object.keys(obj); 
  return (allKeys.length) === 0 ; 
 }
if (typeof exports !== 'undefined') exports.isEmpty = isEmpty;
function fromPairs (pairsArray) { 
  let result = {  }; 
  for (let pair of pairsArray) { 
  result[pair[0]] = pair[1];  
 } 
  return result; 
 }
if (typeof exports !== 'undefined') exports.fromPairs = fromPairs; 
(async () => { 
 
 })().catch(err => { if (err) console.error("\x1b[31mRuntime Error:\x1b[0m", err.stack || err.message); }); 