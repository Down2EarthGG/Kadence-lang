"use strict";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function retry(fn, times) {
  let lastErr;
  const run = () =>
    Promise.resolve(fn()).catch((err) => {
      lastErr = err;
      if (times <= 1) throw err;
      times -= 1;
      return run();
    });
  return run();
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { delay, retry };
}
