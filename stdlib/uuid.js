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
 
let rand = require(`./random.js`); 
function v4 () { 
  let chars = [`0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `a`, `b`, `c`, `d`, `e`, `f`]; 
  let variants = [`8`, `9`, `a`, `b`]; 
  let s = ``; 
  for (let __i = 0; __i < 8; __i++) { 
  s = s + (rand.choice(chars)) ; 
 }  
  s = s + `-` ;
  for (let __i = 0; __i < 4; __i++) { 
  s = s + (rand.choice(chars)) ; 
 }  
  s = s + `-4` ;
  for (let __i = 0; __i < 3; __i++) { 
  s = s + (rand.choice(chars)) ; 
 }  
  s = s + `-` ;
  s = s + (rand.choice(variants)) ;
  for (let __i = 0; __i < 3; __i++) { 
  s = s + (rand.choice(chars)) ; 
 }  
  s = s + `-` ;
  for (let __i = 0; __i < 12; __i++) { 
  s = s + (rand.choice(chars)) ; 
 }  
  return s; 
 }
if (typeof exports !== 'undefined') exports.v4 = v4;
function validate (uuid) { 
  let helper = require(`./regex-helpers.js`); 
  return helper.validateUuid(uuid); 
 }
if (typeof exports !== 'undefined') exports.validate = validate; 
(async () => { 
 
 })().catch(err => { if (err) console.error("\x1b[31mRuntime Error:\x1b[0m", err.stack || err.message); }); 