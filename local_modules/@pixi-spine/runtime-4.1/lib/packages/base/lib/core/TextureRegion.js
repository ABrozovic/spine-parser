'use strict';

class TextureRegion {
  constructor() {
    // thats for overrides
    this.size = null;
    this.names = null;
    this.values = null;
    this.renderObject = null;
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
