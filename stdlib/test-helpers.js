"use strict";

/**
 * Runs fn(); returns { threw: true, error } if it threw, { threw: false } otherwise.
 * Used by test.assertThrows in Kadence.
 */
function assertThrows(fn) {
  try {
    fn();
    return { threw: false };
  } catch (e) {
    return { threw: true, error: e };
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { assertThrows };
}
