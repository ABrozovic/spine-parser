import { SHAPES } from '../const.mjs';

class Polygon {
  constructor(...points) {
    let flat = Array.isArray(points[0]) ? points[0] : points;
    if (typeof flat[0] !== "number") {
      const p = [];
      for (let i = 0, il = flat.length; i < il; i++) {
        p.push(flat[i].x, flat[i].y);
      }
      flat = p;
    }
    this.points = flat;
    this.type = SHAPES.POLY;
    this.closeStroke = true;
  }
  clone() {
    const points = this.points.slice();
    const polygon = new Polygon(points);
    polygon.closeStroke = this.closeStroke;
    return polygon;
  }
  contains(x, y) {
    let inside = false;
    const length = this.points.length / 2;
    for (let i = 0, j = length - 1; i < length; j = i++) {
      const xi = this.points[i * 2];
      const yi = this.points[i * 2 + 1];
      const xj = this.points[j * 2];
      const yj = this.points[j * 2 + 1];
      const intersect = yi > y !== yj > y && x < (xj - xi) * ((y - yi) / (yj - yi)) + xi;
      if (intersect) {
        inside = !inside;
      }
    }
    return inside;
  }
  toString() {
    return `[@pixi/math:PolygoncloseStroke=${this.closeStroke}points=${this.points.reduce((pointsDesc, currentPoint) => `${pointsDesc}, ${currentPoint}`, "")}]`;
  }
}

export { Polygon };
//# sourceMappingURL=Polygon.mjs.map