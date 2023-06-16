/*!
 * @pixi-spine/loader-3.4 - v4.0.3
 * Compiled Fri, 16 Jun 2023 01:12:32 UTC
 *
 * @pixi-spine/loader-3.4 is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 * 
 * Copyright 2023, Ivan Igorevich Popelyshev <ivan.popelyshev@gmail.com>, All Rights Reserved
 */import{SpineLoaderAbstract as n}from"@pixi-spine/loader-base";import{SkeletonBinary as s,SkeletonJson as o,AtlasAttachmentLoader as l}from"@pixi-spine/runtime-3.4";class i extends n{createBinaryParser(){return new s(null)}createJsonParser(){return new o(null)}parseData(r,e,t){const a=r;return a.attachmentLoader=new l(e),{spineData:a.readSkeletonData(t),spineAtlas:e}}}new i().installLoader();
//# sourceMappingURL=loader-3.4.mjs.map
