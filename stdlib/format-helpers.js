"use strict";

function currency(amount, currencyCode) {
    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currencyCode
    });
    return formatter.format(amount);
}

function phoneNumber(text) {
    const cleaned = text.replace(/\D/g, "");
    const len = cleaned.length;

    if (len === 10) {
        const area = cleaned.slice(0, 3);
        const prefix = cleaned.slice(3, 6);
        const line = cleaned.slice(6, 10);
        return `(${area}) ${prefix}-${line}`;
    } else if (len === 11) {
        const country = cleaned.slice(0, 1);
        const area = cleaned.slice(1, 4);
        const prefix = cleaned.slice(4, 7);
        const line = cleaned.slice(7, 11);
        return `+${country} (${area}) ${prefix}-${line}`;
    } else {
        return text;
    }
}

function snakeCase(text) {
    return text.toLowerCase().replace(/\s+/g, "_");
}

function kebabCase(text) {
    return text.toLowerCase().replace(/\s+/g, "-");
}

function slug(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = { currency, phoneNumber, snakeCase, kebabCase, slug };
}
