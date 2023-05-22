import { Matrix } from './Matrix.mjs';

const ux = [1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1, 0, 1];
const uy = [0, 1, 1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1];
const vx = [0, -1, -1, -1, 0, 1, 1, 1, 0, 1, 1, 1, 0, -1, -1, -1];
const vy = [1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, 1, 1, 1, 0, -1];
const signum = Math.sign;
function init() {
  for (let i = 0; i < 16; i++) {
    const row = [];
    for (let j = 0; j < 16; j++) {
      const _ux = signum(ux[i] * ux[j] + vx[i] * uy[j]);
      const _uy = signum(uy[i] * ux[j] + vy[i] * uy[j]);
      const _vx = signum(ux[i] * vx[j] + vx[i] * vy[j]);
      const _vy = signum(uy[i] * vx[j] + vy[i] * vy[j]);
      for (let k = 0; k < 16; k++) {
        if (ux[k] === _ux && uy[k] === _uy && vx[k] === _vx && vy[k] === _vy) {
          row.push(k);
          break;
        }
      }
    }
  }
  for (let i = 0; i < 16; i++) {
    const mat = new Matrix();
    mat.set(ux[i], uy[i], vx[i], vy[i], 0, 0);
  }
}
init();
//# sourceMappingURL=groupD8.mjs.map
