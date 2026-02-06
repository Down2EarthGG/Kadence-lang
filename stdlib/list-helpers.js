"use strict";

/**
 * Sort array in place (ascending). Returns the same array.
 * For sortBy, keyFn(item) is used for comparison.
 */
function sort(arr) {
    return arr.slice().sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

function sortBy(arr, keyFn) {
    return arr.slice().sort((a, b) => {
        const ka = keyFn(a);
        const kb = keyFn(b);
        return ka < kb ? -1 : ka > kb ? 1 : 0;
    });
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = { sort, sortBy };
}
