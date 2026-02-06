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
 
let mod = require(`./async-helpers.js`); 
function delay (milliseconds) { 
  return mod.delay(milliseconds); 
 }
if (typeof exports !== 'undefined') exports.delay = delay;
function timeout (promise, milliseconds) { 
  return mod.timeout(promise, milliseconds); 
 }
if (typeof exports !== 'undefined') exports.timeout = timeout;
function retry (fn, maxAttempts, delayMs) { 
  return mod.retry(fn, maxAttempts, delayMs); 
 }
if (typeof exports !== 'undefined') exports.retry = retry;
function debounce (fn, delayMs) { 
  return mod.debounce(fn, delayMs); 
 }
if (typeof exports !== 'undefined') exports.debounce = debounce;
function throttle (fn, delayMs) { 
  return mod.throttle(fn, delayMs); 
 }
if (typeof exports !== 'undefined') exports.throttle = throttle;
function parallel (promises) { 
  return Promise.all(promises); 
 }
if (typeof exports !== 'undefined') exports.parallel = parallel;
function race (promises) { 
  return Promise.race(promises); 
 }
if (typeof exports !== 'undefined') exports.race = race;
function sequential (tasks) { 
  return mod.sequential(tasks); 
 }
if (typeof exports !== 'undefined') exports.sequential = sequential;
function waterfall (tasks, initialValue) { 
  return mod.waterfall(tasks, initialValue); 
 }
if (typeof exports !== 'undefined') exports.waterfall = waterfall;
function batch (items, batchSize, processFn) { 
  return mod.batch(items, batchSize, processFn); 
 }
if (typeof exports !== 'undefined') exports.batch = batch; 
(async () => { 
 
 })().catch(err => { if (err) console.error("\x1b[31mRuntime Error:\x1b[0m", err.stack || err.message); }); 