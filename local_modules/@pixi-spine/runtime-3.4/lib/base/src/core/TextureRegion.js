'use strict';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class TextureRegion {
  constructor() {
    __publicField(this, "texture");
    // thats for overrides
    __publicField(this, "size", null);
    __publicField(this, "names", null);
    __publicField(this, "values", null);
    __publicField(this, "renderObject", null);
  }
  get width() {
    const tex = this.texture;
    if (tex.trim) {
      return tex.trim.width;
    }
    return tex.orig.width;
  }
  get height() {
    const tex = this.texture;
    if (tex.trim) {
      return tex.trim.height;
    }
    return tex.orig.height;
  }
  get u() {
    return this.texture._uvs.x0;
  }
  get v() {
    return this.texture._uvs.y0;
  }
  get u2() {
    return this.texture._uvs.x2;
  }
  get v2() {
    return this.texture._uvs.y2;
  }
  get offsetX() {
    const tex = this.texture;
    return tex.trim ? tex.trim.x : 0;
  }
  get offsetY() {
    return this.spineOffsetY;
  }
  get pixiOffsetY() {
    const tex = this.texture;
    return tex.trim ? tex.trim.y : 0;
  }
  get spineOffsetY() {
    const tex = this.texture;
    return this.originalHeight - this.height - (tex.trim ? tex.trim.y : 0);
  }
  get originalWidth() {
    return this.texture.orig.width;
  }
  get originalHeight() {
    return this.texture.orig.height;
  }
  get x() {
    return this.texture.frame.x;
  }
  get y() {
    return this.texture.frame.y;
  }
  get rotate() {
    return this.texture.rotate !== 0;
  }
  get degrees() {
    return (360 - this.texture.rotate * 45) % 360;
  }
}

exports.TextureRegion = TextureRegion;
//# sourceMappingURL=TextureRegion.js.map
