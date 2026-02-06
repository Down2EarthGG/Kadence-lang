"use strict";

function isEmail(text) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
}

function isNumeric(text) {
    return /^-?\d+\.?\d*$/.test(text);
}

function isAlpha(text) {
    return /^[a-zA-Z]+$/.test(text);
}

function isAlphanumeric(text) {
    return /^[a-zA-Z0-9]+$/.test(text);
}

function isInteger(text) {
    return /^-?\d+$/.test(text);
}

function isHexColor(text) {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(text);
}

function isIpAddress(text) {
    if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(text)) return false;
    const parts = text.split(".");
    for (const part of parts) {
        const num = Number(part);
        if (num < 0 || num > 255) return false;
    }
    return true;
}

function isPhoneNumber(text) {
    const cleaned = text.replace(/\D/g, "");
    const len = cleaned.length;
    return len >= 10 && len <= 15;
}

function isCreditCard(text) {
    const cleaned = text.replace(/\D/g, "");
    const len = cleaned.length;
    if (len < 13 || len > 19) return false;
    let sum = 0;
    let shouldDouble = false;
    for (let i = len - 1; i >= 0; i--) {
        let digit = Number(cleaned[i]);
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
}

function isStrongPassword(text) {
    if (text.length < 8) return false;
    const hasUpper = /[A-Z]/.test(text);
    const hasLower = /[a-z]/.test(text);
    const hasDigit = /\d/.test(text);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(text);
    return hasUpper && hasLower && hasDigit && hasSpecial;
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        isEmail, isNumeric, isAlpha, isAlphanumeric, isInteger,
        isHexColor, isIpAddress, isPhoneNumber, isCreditCard, isStrongPassword
    };
}
