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
 
function tag (name, content) { 
  return `<` + name  + `>`  + content  + `</`  + name  + `>` ; 
 }
if (typeof exports !== 'undefined') exports.tag = tag;
function div (content) { 
  return tag(`div`, content); 
 }
if (typeof exports !== 'undefined') exports.div = div;
function span (content) { 
  return tag(`span`, content); 
 }
if (typeof exports !== 'undefined') exports.span = span;
function p (content) { 
  return tag(`p`, content); 
 }
if (typeof exports !== 'undefined') exports.p = p;
function h1 (content) { 
  return tag(`h1`, content); 
 }
if (typeof exports !== 'undefined') exports.h1 = h1;
function link (content) { 
  return tag(`a`, content); 
 }
if (typeof exports !== 'undefined') exports.link = link;
function img (content) { 
  return tag(`img`, content); 
 }
if (typeof exports !== 'undefined') exports.img = img; 
(async () => { 
 
 })().catch(err => { if (err) console.error("\x1b[31mRuntime Error:\x1b[0m", err.stack || err.message); }); 