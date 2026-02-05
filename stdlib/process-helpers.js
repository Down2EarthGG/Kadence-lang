"use strict";

const readline = typeof require !== "undefined" ? require("readline") : null;

function readLine(_ignored) {
  if (!readline) return Promise.reject(new Error("readLine requires Node.js"));
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question("", (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { readLine };
}
