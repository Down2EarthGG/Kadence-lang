"use strict";

const crypto = typeof require !== "undefined" ? require("crypto") : null;

function hash(str, algorithm = "sha256") {
  if (!crypto) throw new Error("crypto module requires Node.js");
  return crypto.createHash(algorithm).update(String(str), "utf8").digest("hex");
}

function randomBytes(n) {
  if (!crypto) throw new Error("crypto module requires Node.js");
  return crypto.randomBytes(n).toString("hex");
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { hash, randomBytes };
}
