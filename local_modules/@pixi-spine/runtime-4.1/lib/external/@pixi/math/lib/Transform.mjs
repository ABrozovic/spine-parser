import { Matrix } from './Matrix.mjs';
import { ObservablePoint } from './ObservablePoint.mjs';

const _Transform = class {
  constructor() {
    this.worldTransform = new Matrix();
    this.localTransform = new Matrix();
    this.position = new ObservablePoint(this.onChange, this, 0, 0);
    this.scale = new ObservablePoint(this.onChange, this, 1, 1);
    this.pivot = new ObservablePoint(this.onChange, this, 0, 0);
    this.skew = new ObservablePoint(this.updateSkew, this, 0, 0);
    this._rotation = 0;
    this._cx = 1;
    this._sx = 0;
    this._cy = 0;
    this._sy = 1;
    this._localID = 0;
    this._currentLocalID = 0;
    this._worldID = 0;
    this._parentID = 0;
  }
  onChange() {
    this._localID++;
  }
  updateSkew() {
    this._cx = Math.cos(this._rotation + this.skew.y);
    this._sx = Math.sin(this._rotation + this.skew.y);
    this._cy = -Math.sin(this._rotation - this.skew.x);
    this._sy = Math.cos(this._rotation - this.skew.x);
    this._localID++;
  }
  toString() {
    return `[@pixi/math:Transform position=(${this.position.x}, ${this.position.y}) rotation=${this.rotation} scale=(${this.scale.x}, ${this.scale.y}) skew=(${this.skew.x}, ${this.skew.y}) ]`;
  }
  updateLocalTransform() {
    const lt = this.localTransform;
    if (this._localID !== this._currentLocalID) {
      lt.a = this._cx * this.scale.x;
      lt.b = this._sx * this.scale.x;
      lt.c = this._cy * this.scale.y;
      lt.d = this._sy * this.scale.y;
      lt.tx = this.position.x - (this.pivot.x * lt.a + this.pivot.y * lt.c);
      lt.ty = this.position.y - (this.pivot.x * lt.b + this.pivot.y * lt.d);
      this._currentLocalID = this._localID;
      this._parentID = -1;
    }
  }
  updateTransform(parentTransform) {
    const lt = this.localTransform;
    if (this._localID !== this._currentLocalID) {
      lt.a = this._cx * this.scale.x;
      lt.b = this._sx * this.scale.x;
      lt.c = this._cy * this.scale.y;
      lt.d = this._sy * this.scale.y;
      lt.tx = this.position.x - (this.pivot.x * lt.a + this.pivot.y * lt.c);
      lt.ty = this.position.y - (this.pivot.x * lt.b + this.pivot.y * lt.d);
      this._currentLocalID = this._localID;
      this._parentID = -1;
    }
    if (this._parentID !== parentTransform._worldID) {
      const pt = parentTransform.worldTransform;
      const wt = this.worldTransform;
      wt.a = lt.a * pt.a + lt.b * pt.c;
      wt.b = lt.a * pt.b + lt.b * pt.d;
      wt.c = lt.c * pt.a + lt.d * pt.c;
      wt.d = lt.c * pt.b + lt.d * pt.d;
      wt.tx = lt.tx * pt.a + lt.ty * pt.c + pt.tx;
      wt.ty = lt.tx * pt.b + lt.ty * pt.d + pt.ty;
      this._parentID = parentTransform._worldID;
      this._worldID++;
    }
  }
  setFromMatrix(matrix) {
    matrix.decompose(this);
    this._localID++;
  }
  get rotation() {
    return this._rotation;
  }
  set rotation(value) {
    if (this._rotation !== value) {
      this._rotation = value;
      this.updateSkew();
    }
  }
};
let Transform = _Transform;
Transform.IDENTITY = new _Transform();

export { Transform };
//# sourceMappingURL=Transform.mjs.map
