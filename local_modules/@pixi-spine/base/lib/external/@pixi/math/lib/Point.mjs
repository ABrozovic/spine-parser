class Point {
  constructor(x = 0, y = 0) {
    this.x = 0;
    this.y = 0;
    this.x = x;
    this.y = y;
  }
  clone() {
    return new Point(this.x, this.y);
  }
  copyFrom(p) {
    this.set(p.x, p.y);
    return this;
  }
  copyTo(p) {
    p.set(this.x, this.y);
    return p;
  }
  equals(p) {
    return p.x === this.x && p.y === this.y;
  }
  set(x = 0, y = x) {
    this.x = x;
    this.y = y;
    return this;
  }
  toString() {
    return `[@pixi/math:Point x=${this.x} y=${this.y}]`;
  }
}

export { Point };
//# sourceMappingURL=Point.mjs.map
