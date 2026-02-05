"use strict";

function pick(obj, keys) {
  const r = {};
  for (const k of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) r[k] = obj[k];
  }
  return r;
}

function omit(obj, keys) {
  const set = new Set(keys);
  const r = {};
  for (const k of Object.keys(obj)) {
    if (!set.has(k)) r[k] = obj[k];
  }
  return r;
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function get(obj, path) {
  if (obj == null) return undefined;
  const parts = typeof path === "string" ? path.split(".") : path;
  let cur = obj;
  for (const p of parts) {
    cur = cur == null ? undefined : cur[p];
  }
  return cur;
}

function defaults(obj, defs) {
  const r = { ...defs };
  for (const k of Object.keys(obj || {})) {
    if (r[k] === undefined) r[k] = obj[k];
  }
  return r;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { pick, omit, deepClone, get, defaults };
}
