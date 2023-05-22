'use strict';

var index = require('../../../constants/lib/index.js');

function mapPremultipliedBlendModes() {
  const pm = [];
  const npm = [];
  for (let i = 0; i < 32; i++) {
    pm[i] = i;
    npm[i] = i;
  }
  pm[index.BLEND_MODES.NORMAL_NPM] = index.BLEND_MODES.NORMAL;
  pm[index.BLEND_MODES.ADD_NPM] = index.BLEND_MODES.ADD;
  pm[index.BLEND_MODES.SCREEN_NPM] = index.BLEND_MODES.SCREEN;
  npm[index.BLEND_MODES.NORMAL] = index.BLEND_MODES.NORMAL_NPM;
  npm[index.BLEND_MODES.ADD] = index.BLEND_MODES.ADD_NPM;
  npm[index.BLEND_MODES.SCREEN] = index.BLEND_MODES.SCREEN_NPM;
  const array = [];
  array.push(npm);
  array.push(pm);
  return array;
}
mapPremultipliedBlendModes();
//# sourceMappingURL=premultiply.js.map
