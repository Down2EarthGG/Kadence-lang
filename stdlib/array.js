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
 
function flatten (nestedArray) { 
  let result = []; 
  for (let elem of nestedArray) { 
  if (typeof elem === `object`  && elem.length ) { 
  let flattened = flatten(elem); 
  for (let subItem of flattened) { 
  __kadence_add(result, subItem); 
 }  
 }   else { 
  __kadence_add(result, elem); 
 }   
 } 
  return result; 
 }
if (typeof exports !== 'undefined') exports.flatten = flatten;
function zip (array1, array2) { 
  let result = []; 
  let len1 = array1.length; 
  let len2 = array2.length; 
  let minLen = 0; 
  if (len1 < len2 ) { 
  minLen = len1; 
 }   else { 
  minLen = len2; 
 }  
  let i = 0; 
  while (i < minLen ) { 
  let pair = []; 
  __kadence_add(pair, array1[i]);
  __kadence_add(pair, array2[i]);
  __kadence_add(result, pair);
  i++; 
 }  
  return result; 
 }
if (typeof exports !== 'undefined') exports.zip = zip;
function chunk (array, chunkSize) { 
  let result = []; 
  let i = 0; 
  let len = array.length; 
  while (i < len ) { 
  let currentChunk = []; 
  let j = 0; 
  while (j < chunkSize  && (i + j ) < len  ) { 
  __kadence_add(currentChunk, array[i + j ]);
  j++; 
 }  
  __kadence_add(result, currentChunk);
  i = i + chunkSize ; 
 }  
  return result; 
 }
if (typeof exports !== 'undefined') exports.chunk = chunk;
function partition (array, predicate) { 
  let truthy = []; 
  let falsy = []; 
  for (let elem of array) { 
  if (predicate(elem)) { 
  __kadence_add(truthy, elem); 
 }   else { 
  __kadence_add(falsy, elem); 
 }   
 } 
  let output = []; 
  __kadence_add(output, truthy);
  __kadence_add(output, falsy);
  return output; 
 }
if (typeof exports !== 'undefined') exports.partition = partition;
function take (array, count) { 
  let result = []; 
  let len = array.length; 
  let actualCount = 0; 
  if (count < len ) { 
  actualCount = count; 
 }   else { 
  actualCount = len; 
 }  
  let i = 0; 
  while (i < actualCount ) { 
  __kadence_add(result, array[i]);
  i++; 
 }  
  return result; 
 }
if (typeof exports !== 'undefined') exports.take = take;
function drop (array, count) { 
  let result = []; 
  let len = array.length; 
  let i = count; 
  while (i < len ) { 
  __kadence_add(result, array[i]);
  i++; 
 }  
  return result; 
 }
if (typeof exports !== 'undefined') exports.drop = drop;
function reverse (array) { 
  let result = []; 
  let i = (array.length) - 1 ; 
  while (i >= 0 ) { 
  __kadence_add(result, array[i]);
  i--; 
 }  
  return result; 
 }
if (typeof exports !== 'undefined') exports.reverse = reverse;
function findIndex (array, predicate) { 
  let i = 0; 
  let len = array.length; 
  while (i < len ) { 
  let elem = array[i]; 
  if (predicate(elem)) { 
  return i; 
 }  
  i++; 
 }  
  return 0 - 1 ; 
 }
if (typeof exports !== 'undefined') exports.findIndex = findIndex;
function findFirst (array, predicate) { 
  let idx = findIndex(array, predicate); 
  if (idx >= 0 ) { 
  return array[idx]; 
 }  
  return undefined; 
 }
if (typeof exports !== 'undefined') exports.findFirst = findFirst; 
(async () => { 
 
 })().catch(err => { if (err) console.error("\x1b[31mRuntime Error:\x1b[0m", err.stack || err.message); }); 