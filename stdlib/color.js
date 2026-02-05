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
 
function rgb (r, g, b) { 
  return `rgb(` + r  + `,`  + g  + `,`  + b  + `)` ; 
 }
if (typeof exports !== 'undefined') exports.rgb = rgb;
function rgba (r, g, b, a) { 
  return `rgba(` + r  + `,`  + g  + `,`  + b  + `,`  + a  + `)` ; 
 }
if (typeof exports !== 'undefined') exports.rgba = rgba;
function hex (hexStr) { 
  let helper = require(`./color-helpers.js`); 
  return helper.hexToRgb(hexStr); 
 }
if (typeof exports !== 'undefined') exports.hex = hex;
function randomHex () { 
  let rand = require(`./random.js`); 
  let chars = [`0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `a`, `b`, `c`, `d`, `e`, `f`]; 
  let parts = [`#`]; 
  for (let __i = 0; __i < 6; __i++) { 
  __kadence_add(parts, (rand.choice(chars))); 
 }  
  return parts.join(``); 
 }
if (typeof exports !== 'undefined') exports.randomHex = randomHex; 
(async () => { 
 
 })().catch(err => { if (err) console.error("\x1b[31mRuntime Error:\x1b[0m", err.stack || err.message); }); 