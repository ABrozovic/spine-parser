/*!
 * @pixi-spine/loader-3.4 - v4.0.3
 * Compiled Tue, 13 Jun 2023 12:45:40 UTC
 *
 * @pixi-spine/loader-3.4 is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 * 
 * Copyright 2023, Ivan Igorevich Popelyshev <ivan.popelyshev@gmail.com>, All Rights Reserved
 */(function(t,e){"use strict";class r extends t.SpineLoaderAbstract{createBinaryParser(){return new e.SkeletonBinary(null)}createJsonParser(){return new e.SkeletonJson(null)}parseData(s,a,l){const n=s;return n.attachmentLoader=new e.AtlasAttachmentLoader(a),{spineData:n.readSkeletonData(l),spineAtlas:a}}}new r().installLoader()})(PIXI.spine,PIXI.spine34);
//# sourceMappingURL=loader-3.4.js.map
