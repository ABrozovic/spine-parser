/*!
 * @pixi-spine/loader-3.8 - v4.0.3
 * Compiled Fri, 12 May 2023 00:15:57 UTC
 *
 * @pixi-spine/loader-3.8 is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 * 
 * Copyright 2023, Ivan Igorevich Popelyshev <ivan.popelyshev@gmail.com>, All Rights Reserved
 */(function(t,e){"use strict";class r extends t.SpineLoaderAbstract{createBinaryParser(){return new e.SkeletonBinary(null)}createJsonParser(){return new e.SkeletonJson(null)}parseData(s,a,l){const n=s;return n.attachmentLoader=new e.AtlasAttachmentLoader(a),{spineData:n.readSkeletonData(l),spineAtlas:a}}}new r().installLoader()})(PIXI.spine,PIXI.spine38);
//# sourceMappingURL=loader-3.8.js.map
