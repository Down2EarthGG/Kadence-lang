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
 
function union (set1, set2) { 
  let result = []; 
  for (let elem of set1) { 
  __kadence_add(result, elem); 
 } 
  for (let elem of set2) { 
  let found = false; 
  for (let existing of result) { 
  if (existing === elem ) { 
  found = true; 
 }   
 } 
  if (!(found)) { 
  __kadence_add(result, elem); 
 }   
 } 
  return result; 
 }
if (typeof exports !== 'undefined') exports.union = union;
function intersection (set1, set2) { 
  let result = []; 
  for (let elem of set1) { 
  let found = false; 
  for (let item2 of set2) { 
  if (elem === item2 ) { 
  found = true; 
 }   
 } 
  if (found) { 
  __kadence_add(result, elem); 
 }   
 } 
  return result; 
 }
if (typeof exports !== 'undefined') exports.intersection = intersection;
function difference (set1, set2) { 
  let result = []; 
  for (let elem of set1) { 
  let found = false; 
  for (let item2 of set2) { 
  if (elem === item2 ) { 
  found = true; 
 }   
 } 
  if (!(found)) { 
  __kadence_add(result, elem); 
 }   
 } 
  return result; 
 }
if (typeof exports !== 'undefined') exports.difference = difference;
function symmetricDifference (set1, set2) { 
  let diff1 = difference(set1, set2); 
  let diff2 = difference(set2, set1); 
  return union(diff1, diff2); 
 }
if (typeof exports !== 'undefined') exports.symmetricDifference = symmetricDifference;
function isSubset (subset, bigSet) { 
  for (let elem of subset) { 
  let found = false; 
  for (let elem2 of bigSet) { 
  if (elem === elem2 ) { 
  found = true; 
 }   
 } 
  if (!(found)) { 
  return false; 
 }   
 } 
  return true; 
 }
if (typeof exports !== 'undefined') exports.isSubset = isSubset;
function isSuperset (bigSet, subset) { 
  return isSubset(subset, bigSet); 
 }
if (typeof exports !== 'undefined') exports.isSuperset = isSuperset;
function areDisjoint (set1, set2) { 
  for (let elem of set1) { 
  for (let item2 of set2) { 
  if (elem === item2 ) { 
  return false; 
 }   
 }  
 } 
  return true; 
 }
if (typeof exports !== 'undefined') exports.areDisjoint = areDisjoint;
function cartesianProduct (set1, set2) { 
  let result = []; 
  for (let item1 of set1) { 
  for (let item2 of set2) { 
  let pair = []; 
  __kadence_add(pair, item1);
  __kadence_add(pair, item2);
  __kadence_add(result, pair); 
 }  
 } 
  return result; 
 }
if (typeof exports !== 'undefined') exports.cartesianProduct = cartesianProduct; 
(async () => { 
 
 })().catch(err => { if (err) console.error("\x1b[31mRuntime Error:\x1b[0m", err.stack || err.message); }); 