'use strict';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const _Color = class {
  constructor(r = 0, g = 0, b = 0, a = 0) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }
  set(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    return this.clamp();
  }
  setFromColor(c) {
    this.r = c.r;
    this.g = c.g;
    this.b = c.b;
    this.a = c.a;
    return this;
  }
  setFromString(hex) {
    hex = hex.charAt(0) == "#" ? hex.substr(1) : hex;
    this.r = parseInt(hex.substr(0, 2), 16) / 255;
    this.g = parseInt(hex.substr(2, 2), 16) / 255;
    this.b = parseInt(hex.substr(4, 2), 16) / 255;
    this.a = hex.length != 8 ? 1 : parseInt(hex.substr(6, 2), 16) / 255;
    return this;
  }
  add(r, g, b, a) {
    this.r += r;
    this.g += g;
    this.b += b;
    this.a += a;
    return this.clamp();
  }
  clamp() {
    if (this.r < 0)
      this.r = 0;
    else if (this.r > 1)
      this.r = 1;
    if (this.g < 0)
      this.g = 0;
    else if (this.g > 1)
      this.g = 1;
    if (this.b < 0)
      this.b = 0;
    else if (this.b > 1)
      this.b = 1;
    if (this.a < 0)
      this.a = 0;
    else if (this.a > 1)
      this.a = 1;
    return this;
  }
  static rgba8888ToColor(color, value) {
    color.r = ((value & 4278190080) >>> 24) / 255;
    color.g = ((value & 16711680) >>> 16) / 255;
    color.b = ((value & 65280) >>> 8) / 255;
    color.a = (value & 255) / 255;
  }
  static rgb888ToColor(color, value) {
    color.r = ((value & 16711680) >>> 16) / 255;
    color.g = ((value & 65280) >>> 8) / 255;
    color.b = (value & 255) / 255;
  }
  static fromString(hex) {
    return new _Color().setFromString(hex);
  }
};
let Color = _Color;
__publicField(Color, "WHITE", new _Color(1, 1, 1, 1));
__publicField(Color, "RED", new _Color(1, 0, 0, 1));
__publicField(Color, "GREEN", new _Color(0, 1, 0, 1));
__publicField(Color, "BLUE", new _Color(0, 0, 1, 1));
__publicField(Color, "MAGENTA", new _Color(1, 0, 1, 1));
const _MathUtils = class {
  static clamp(value, min, max) {
    if (value < min)
      return min;
    if (value > max)
      return max;
    return value;
  }
  static cosDeg(degrees) {
    return Math.cos(degrees * _MathUtils.degRad);
  }
  static sinDeg(degrees) {
    return Math.sin(degrees * _MathUtils.degRad);
  }
  static signum(value) {
    return Math.sign(value);
  }
  static toInt(x) {
    return x > 0 ? Math.floor(x) : Math.ceil(x);
  }
  static cbrt(x) {
    const y = Math.pow(Math.abs(x), 1 / 3);
    return x < 0 ? -y : y;
  }
  static randomTriangular(min, max) {
    return _MathUtils.randomTriangularWith(min, max, (min + max) * 0.5);
  }
  static randomTriangularWith(min, max, mode) {
    const u = Math.random();
    const d = max - min;
    if (u <= (mode - min) / d)
      return min + Math.sqrt(u * d * (mode - min));
    return max - Math.sqrt((1 - u) * d * (max - mode));
  }
  static isPowerOfTwo(value) {
    return value && (value & value - 1) === 0;
  }
};
let MathUtils = _MathUtils;
__publicField(MathUtils, "PI", 3.1415927);
__publicField(MathUtils, "PI2", _MathUtils.PI * 2);
__publicField(MathUtils, "radiansToDegrees", 180 / _MathUtils.PI);
__publicField(MathUtils, "radDeg", _MathUtils.radiansToDegrees);
__publicField(MathUtils, "degreesToRadians", _MathUtils.PI / 180);
__publicField(MathUtils, "degRad", _MathUtils.degreesToRadians);
const _Utils = class {
  static arrayCopy(source, sourceStart, dest, destStart, numElements) {
    for (let i = sourceStart, j = destStart; i < sourceStart + numElements; i++, j++) {
      dest[j] = source[i];
    }
  }
  static arrayFill(array, fromIndex, toIndex, value) {
    for (let i = fromIndex; i < toIndex; i++) {
      array[i] = value;
    }
  }
  static setArraySize(array, size, value = 0) {
    const oldSize = array.length;
    if (oldSize == size)
      return array;
    array.length = size;
    if (oldSize < size) {
      for (let i = oldSize; i < size; i++)
        array[i] = value;
    }
    return array;
  }
  static ensureArrayCapacity(array, size, value = 0) {
    if (array.length >= size)
      return array;
    return _Utils.setArraySize(array, size, value);
  }
  static newArray(size, defaultValue) {
    const array = new Array(size);
    for (let i = 0; i < size; i++)
      array[i] = defaultValue;
    return array;
  }
  static newFloatArray(size) {
    if (_Utils.SUPPORTS_TYPED_ARRAYS) {
      return new Float32Array(size);
    }
    const array = new Array(size);
    for (let i = 0; i < array.length; i++)
      array[i] = 0;
    return array;
  }
  static newShortArray(size) {
    if (_Utils.SUPPORTS_TYPED_ARRAYS) {
      return new Int16Array(size);
    }
    const array = new Array(size);
    for (let i = 0; i < array.length; i++)
      array[i] = 0;
    return array;
  }
  static toFloatArray(array) {
    return _Utils.SUPPORTS_TYPED_ARRAYS ? new Float32Array(array) : array;
  }
  static toSinglePrecision(value) {
    return _Utils.SUPPORTS_TYPED_ARRAYS ? Math.fround(value) : value;
  }
  // This function is used to fix WebKit 602 specific issue described at http://esotericsoftware.com/forum/iOS-10-disappearing-graphics-10109
  static webkit602BugfixHelper(alpha, blend) {
  }
  static contains(array, element, identity = true) {
    for (let i = 0; i < array.length; i++) {
      if (array[i] == element)
        return true;
    }
    return false;
  }
  static enumValue(type, name) {
    return type[name[0].toUpperCase() + name.slice(1)];
  }
};
let Utils = _Utils;
__publicField(Utils, "SUPPORTS_TYPED_ARRAYS", typeof Float32Array !== "undefined");

exports.Color = Color;
exports.MathUtils = MathUtils;
exports.Utils = Utils;
//# sourceMappingURL=Utils.js.map
