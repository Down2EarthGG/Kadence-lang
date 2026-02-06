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
 
let mod = require(`./validation-helpers.js`); 
function isEmail (text) { 
  return mod.isEmail(text); 
 }
if (typeof exports !== 'undefined') exports.isEmail = isEmail;
function isUrl (text) { 
  try { 
  new URL(text); 
  return true; 
 }  catch(error) { 
  return false; 
 }   
 }
if (typeof exports !== 'undefined') exports.isUrl = isUrl;
function isNumeric (text) { 
  return mod.isNumeric(text); 
 }
if (typeof exports !== 'undefined') exports.isNumeric = isNumeric;
function isAlpha (text) { 
  return mod.isAlpha(text); 
 }
if (typeof exports !== 'undefined') exports.isAlpha = isAlpha;
function isAlphanumeric (text) { 
  return mod.isAlphanumeric(text); 
 }
if (typeof exports !== 'undefined') exports.isAlphanumeric = isAlphanumeric;
function isInteger (text) { 
  return mod.isInteger(text); 
 }
if (typeof exports !== 'undefined') exports.isInteger = isInteger;
function isPositive (num) { 
  return num > 0 ; 
 }
if (typeof exports !== 'undefined') exports.isPositive = isPositive;
function isNegative (num) { 
  return num < 0 ; 
 }
if (typeof exports !== 'undefined') exports.isNegative = isNegative;
function isInRange (num, min, max) { 
  return num >= min  && num <= max  ; 
 }
if (typeof exports !== 'undefined') exports.isInRange = isInRange;
function isLength (text, minLen, maxLen) { 
  let len = text.length; 
  return len >= minLen  && len <= maxLen  ; 
 }
if (typeof exports !== 'undefined') exports.isLength = isLength;
function isBlank (text) { 
  let trimmedText = text.trim(); 
  return (trimmedText.length) === 0 ; 
 }
if (typeof exports !== 'undefined') exports.isBlank = isBlank;
function isNotEmpty (text) { 
  return !((isBlank(text))); 
 }
if (typeof exports !== 'undefined') exports.isNotEmpty = isNotEmpty;
function isHexColor (text) { 
  return mod.isHexColor(text); 
 }
if (typeof exports !== 'undefined') exports.isHexColor = isHexColor;
function isIpAddress (text) { 
  return mod.isIpAddress(text); 
 }
if (typeof exports !== 'undefined') exports.isIpAddress = isIpAddress;
function isPhoneNumber (text) { 
  return mod.isPhoneNumber(text); 
 }
if (typeof exports !== 'undefined') exports.isPhoneNumber = isPhoneNumber;
function isCreditCard (text) { 
  return mod.isCreditCard(text); 
 }
if (typeof exports !== 'undefined') exports.isCreditCard = isCreditCard;
function isStrongPassword (text) { 
  return mod.isStrongPassword(text); 
 }
if (typeof exports !== 'undefined') exports.isStrongPassword = isStrongPassword; 
(async () => { 
 
 })().catch(err => { if (err) console.error("\x1b[31mRuntime Error:\x1b[0m", err.stack || err.message); }); 