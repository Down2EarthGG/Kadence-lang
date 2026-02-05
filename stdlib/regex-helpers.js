"use strict";

function test(pattern, str) {
  return new RegExp(pattern).test(str);
}

function replaceAll(pattern, str, replacement) {
  return str.replace(new RegExp(pattern, "g"), replacement);
}

function validateUuid(uuid) {
  const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
  return pattern.test(uuid);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { test, replaceAll, validateUuid };
}
