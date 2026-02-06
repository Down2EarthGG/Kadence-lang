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
 
let fsMod = require(`fs`); 
function listDir (path) { 
  return fsMod.readdirSync(path); 
 }
if (typeof exports !== 'undefined') exports.listDir = listDir;
function exists (path) { 
  return fsMod.existsSync(path); 
 }
if (typeof exports !== 'undefined') exports.exists = exists;
function mkdir (path) { 
  fsMod.mkdirSync(path);  
 }
if (typeof exports !== 'undefined') exports.mkdir = mkdir;
function append (path, content) { 
  fsMod.appendFileSync(path, content);  
 }
if (typeof exports !== 'undefined') exports.append = append;
function unlink (path) { 
  fsMod.unlinkSync(path);  
 }
if (typeof exports !== 'undefined') exports.unlink = unlink;
function readFile (path) { 
  return fsMod.readFileSync(path, `utf8`); 
 }
if (typeof exports !== 'undefined') exports.readFile = readFile;
function writeFile (path, content) { 
  fsMod.writeFileSync(path, content);  
 }
if (typeof exports !== 'undefined') exports.writeFile = writeFile;
function copyFile (src, dest) { 
  fsMod.copyFileSync(src, dest);  
 }
if (typeof exports !== 'undefined') exports.copyFile = copyFile;
function removeDir (path) { 
  let options = { recursive: true, force: true }; 
  fsMod.rmSync(path, options);  
 }
if (typeof exports !== 'undefined') exports.removeDir = removeDir;
function copyDir (src, dest) { 
  let options = { recursive: true }; 
  fsMod.cpSync(src, dest, options);  
 }
if (typeof exports !== 'undefined') exports.copyDir = copyDir;
function stat (path) { 
  return fsMod.statSync(path); 
 }
if (typeof exports !== 'undefined') exports.stat = stat;
function isDirectory (path) { 
  let s = stat(path); 
  return s.isDirectory(); 
 }
if (typeof exports !== 'undefined') exports.isDirectory = isDirectory;
function isFile (path) { 
  let s = stat(path); 
  return s.isFile(); 
 }
if (typeof exports !== 'undefined') exports.isFile = isFile; 
(async () => { 
 
 })().catch(err => { if (err) console.error("\x1b[31mRuntime Error:\x1b[0m", err.stack || err.message); }); 