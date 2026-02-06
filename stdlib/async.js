let mod = require("./async-helpers.js"); 
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