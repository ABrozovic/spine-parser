'use strict';

class IkConstraintData {
  constructor(name) {
    this.order = 0;
    this.bones = new Array();
    this.bendDirection = 1;
    this.compress = false;
    this.stretch = false;
    this.uniform = false;
    this.mix = 1;
    this.name = name;
  }
}

exports.IkConstraintData = IkConstraintData;
//# sourceMappingURL=IkConstraintData.js.map
