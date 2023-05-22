'use strict';

function hex2rgb(hex, out = []) {
  out[0] = (hex >> 16 & 255) / 255;
  out[1] = (hex >> 8 & 255) / 255;
  out[2] = (hex & 255) / 255;
  return out;
}
function rgb2hex(rgb) {
  return (rgb[0] * 255 << 16) + (rgb[1] * 255 << 8) + (rgb[2] * 255 | 0);
}

exports.hex2rgb = hex2rgb;
exports.rgb2hex = rgb2hex;
//# sourceMappingURL=hex.js.map
