"use strict";

function delay(milliseconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

function timeout(promise, milliseconds) {
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error("Operation timed out"));
        }, milliseconds);
    });

    return Promise.race([promise, timeoutPromise]);
}

async function retry(fn, maxAttempts, delayMs) {
    let attempt = 0;

    while (attempt < maxAttempts) {
        try {
            const result = await fn();
            return result;
        } catch (error) {
            attempt++;
            if (attempt < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, delayMs));
            } else {
                throw error;
            }
        }
    }
}

function debounce(fn, delayMs) {
    let timeoutId = null;

    return function (...args) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            fn(...args);
        }, delayMs);
    };
}

function throttle(fn, delayMs) {
    let lastRun = 0;

    return function (...args) {
        const now = Date.now();

        if (now - lastRun >= delayMs) {
            fn(...args);
            lastRun = now;
        }
    };
}

async function sequential(tasks) {
    const results = [];

    for (const task of tasks) {
        const result = await task();
        results.push(result);
    }

    return results;
}

async function waterfall(tasks, initialValue) {
    let value = initialValue;

    for (const task of tasks) {
        value = await task(value);
    }

    return value;
}

async function batch(items, batchSize, processFn) {
    const results = [];
    let i = 0;
    const len = items.length;

    while (i < len) {
        const batchItems = [];
        let j = 0;

        while (j < batchSize && (i + j) < len) {
            batchItems.push(items[i + j]);
            j++;
        }

        const batchResults = await processFn(batchItems);
        for (const result of batchResults) {
            results.push(result);
        }

        i += batchSize;
    }

    return results;
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        delay, timeout, retry, debounce, throttle,
        sequential, waterfall, batch
    };
}
