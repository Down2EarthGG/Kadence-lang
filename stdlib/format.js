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
 
let mod = require(`./format-helpers.js`); 
function currency (amount, currencyCode) { 
  return mod.currency(amount, currencyCode); 
 }
if (typeof exports !== 'undefined') exports.currency = currency;
function formatNumber (num, decimals) { 
  return num.toFixed(decimals); 
 }
if (typeof exports !== 'undefined') exports.formatNumber = formatNumber;
function percentage (num, decimals) { 
  let fixed = num.toFixed(decimals); 
  return fixed + `%` ; 
 }
if (typeof exports !== 'undefined') exports.percentage = percentage;
function fileSize (bytes) { 
  if (bytes < 1024 ) { 
  return bytes + ` B` ; 
 }   else if (bytes < 1048576 ) { 
  let kb = bytes / 1024; 
  return (kb.toFixed(2)) + ` KB` ; 
 }   else if (bytes < 1073741824 ) { 
  let mb = bytes / 1048576; 
  return (mb.toFixed(2)) + ` MB` ; 
 }   else { 
  let gb = bytes / 1073741824; 
  return (gb.toFixed(2)) + ` GB` ; 
 }   
 }
if (typeof exports !== 'undefined') exports.fileSize = fileSize;
function ordinal (num) { 
  let tens = Math.floor((num / 10) * 10 ); 
  let remainder = num - tens ; 
  let lastTwo = num - (Math.floor((num / 100) * 100 )) ; 
  if (lastTwo >= 11  && lastTwo <= 13  ) { 
  return num + `th` ; 
 }  
  if (remainder === 1 ) { 
  return num + `st` ; 
 }   else if (remainder === 2 ) { 
  return num + `nd` ; 
 }   else if (remainder === 3 ) { 
  return num + `rd` ; 
 }   else { 
  return num + `th` ; 
 }   
 }
if (typeof exports !== 'undefined') exports.ordinal = ordinal;
function plural (count, singular, pluralForm) { 
  if (count === 1 ) { 
  return singular; 
 }   else { 
  return pluralForm; 
 }   
 }
if (typeof exports !== 'undefined') exports.plural = plural;
function truncate (text, maxLength, suffix) { 
  let len = text.length; 
  if (len <= maxLength ) { 
  return text; 
 }  
  let truncated = text.slice(0, maxLength); 
  return truncated + suffix ; 
 }
if (typeof exports !== 'undefined') exports.truncate = truncate;
function ellipsis (text, maxLength) { 
  return truncate(text, maxLength, `...`); 
 }
if (typeof exports !== 'undefined') exports.ellipsis = ellipsis;
function padNumber (num, width) { 
  let str = String(num); 
  let len = str.length; 
  if (len >= width ) { 
  return str; 
 }  
  let zerosNeeded = width - len ; 
  let zeros = ``; 
  let i = 0; 
  while (i < zerosNeeded ) { 
  zeros = zeros + `0` ;
  i++; 
 }  
  return zeros + str ; 
 }
if (typeof exports !== 'undefined') exports.padNumber = padNumber;
function phoneNumber (text) { 
  return mod.phoneNumber(text); 
 }
if (typeof exports !== 'undefined') exports.phoneNumber = phoneNumber;
function titleCase (text) { 
  let words = text.split(` `); 
  let result = []; 
  for (let word of words) { 
  if ((word.length) > 0 ) { 
  let first = ((word[0])).toString().toUpperCase(); 
  let rest = ((word.slice(1))).toString().toLowerCase(); 
  __kadence_add(result, (first + rest )); 
 }   
 } 
  return result.join(` `); 
 }
if (typeof exports !== 'undefined') exports.titleCase = titleCase;
function snakeCase (text) { 
  return mod.snakeCase(text); 
 }
if (typeof exports !== 'undefined') exports.snakeCase = snakeCase;
function kebabCase (text) { 
  return mod.kebabCase(text); 
 }
if (typeof exports !== 'undefined') exports.kebabCase = kebabCase;
function slug (text) { 
  return mod.slug(text); 
 }
if (typeof exports !== 'undefined') exports.slug = slug; 
(async () => { 
 
 })().catch(err => { if (err) console.error("\x1b[31mRuntime Error:\x1b[0m", err.stack || err.message); }); 