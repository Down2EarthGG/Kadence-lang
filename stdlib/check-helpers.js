"use strict";

function isDefined(val) {
  return val !== undefined;
}

function isNull(val) {
  return val === null;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { isDefined, isNull };
}
