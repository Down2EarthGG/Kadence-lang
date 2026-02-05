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
 
function base64Encode (str) { 
  let buf = Buffer[`from`](str, `utf8`); 
  return buf.toString(`base64`); 
 }
if (typeof exports !== 'undefined') exports.base64Encode = base64Encode;
function base64Decode (str) { 
  let buf = Buffer[`from`](str, `base64`); 
  return buf.toString(`utf8`); 
 }
if (typeof exports !== 'undefined') exports.base64Decode = base64Decode;
function urlEncode (str) { 
  return encodeURIComponent(str); 
 }
if (typeof exports !== 'undefined') exports.urlEncode = urlEncode;
function urlDecode (str) { 
  return decodeURIComponent(str); 
 }
if (typeof exports !== 'undefined') exports.urlDecode = urlDecode; 
(async () => { 
 
 })().catch(err => { if (err) console.error("\x1b[31mRuntime Error:\x1b[0m", err.stack || err.message); }); 