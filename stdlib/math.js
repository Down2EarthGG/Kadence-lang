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
 
function hypotenuse (a, b) { 
  return Math.sqrt(((a * a ) + (b * b ) )); 
 }
if (typeof exports !== 'undefined') exports.hypotenuse = hypotenuse;
function areaOfCircle (radius) { 
  return Math.PI * radius  * radius ; 
 }
if (typeof exports !== 'undefined') exports.areaOfCircle = areaOfCircle;
function isEven (n) { 
  if ((n / 2) * 2  === n ) { 
  return true; 
 }   else { 
  return false; 
 }   
 }
if (typeof exports !== 'undefined') exports.isEven = isEven;
function clamp (val, minVal, maxVal) { 
  if (val < minVal ) { 
  return minVal; 
 }   else if (val > maxVal ) { 
  return maxVal; 
 }   else { 
  return val; 
 }   
 }
if (typeof exports !== 'undefined') exports.clamp = clamp;
function randomFloat (min, max) { 
  let r = Math.random(); 
  return min + (r * (max - min ) ) ; 
 }
if (typeof exports !== 'undefined') exports.randomFloat = randomFloat;
function toRadians (deg) { 
  return deg * (Math.PI / 180) ; 
 }
if (typeof exports !== 'undefined') exports.toRadians = toRadians;
function toDegrees (rad) { 
  return rad * (180 / Math.PI) ; 
 }
if (typeof exports !== 'undefined') exports.toDegrees = toDegrees; 
(async () => { 
 
 })().catch(err => { if (err) console.error("\x1b[31mRuntime Error:\x1b[0m", err.stack || err.message); }); 