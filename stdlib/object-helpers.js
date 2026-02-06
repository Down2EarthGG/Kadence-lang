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

function keys(obj) {
  return Object.keys(obj);
}

function values(obj) {
  return Object.values(obj);
}

function entries(obj) {
  return Object.entries(obj);
}

function hasKey(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function merge(obj1, obj2) {
  return Object.assign({}, obj1, obj2);
}

function mapValues(obj, fn) {
  const result = {};
  for (const key of Object.keys(obj)) {
    result[key] = fn(obj[key], key);
  }
  return result;
}

function mapKeys(obj, fn) {
  const result = {};
  for (const key of Object.keys(obj)) {
    const newKey = fn(key, obj[key]);
    result[newKey] = obj[key];
  }
  return result;
}

function invert(obj) {
  const result = {};
  for (const key of Object.keys(obj)) {
    result[obj[key]] = key;
  }
  return result;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    pick, omit, deepClone, get, defaults,
    keys, values, entries, hasKey, merge,
    mapValues, mapKeys, invert
  };
}
