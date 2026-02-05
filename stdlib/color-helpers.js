"use strict";

function hexToRgb(hex) {
  let s = hex.startsWith("#") ? hex.slice(1) : hex;
  if (s.length !== 6) return "rgb(0, 0, 0)";
  const r = parseInt(s.slice(0, 2), 16);
  const g = parseInt(s.slice(2, 4), 16);
  const b = parseInt(s.slice(4, 6), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

function lighten(color, percent) {
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return color;
  const f = 1 + percent / 100;
  const r = Math.min(255, Math.round(parseInt(match[1], 10) * f));
  const g = Math.min(255, Math.round(parseInt(match[2], 10) * f));
  const b = Math.min(255, Math.round(parseInt(match[3], 10) * f));
  return color.startsWith("rgba") ? `rgba(${r}, ${g}, ${b}, 1)` : `rgb(${r}, ${g}, ${b})`;
}

function darken(color, percent) {
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return color;
  const f = Math.max(0, 1 - percent / 100);
  const r = Math.round(parseInt(match[1], 10) * f);
  const g = Math.round(parseInt(match[2], 10) * f);
  const b = Math.round(parseInt(match[3], 10) * f);
  return color.startsWith("rgba") ? `rgba(${r}, ${g}, ${b}, 1)` : `rgb(${r}, ${g}, ${b})`;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { hexToRgb, lighten, darken };
}
