/*!
 * @pixi-spine/loader-uni - v4.0.3
 * Compiled Fri, 12 May 2023 00:15:57 UTC
 *
 * @pixi-spine/loader-uni is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 * 
 * Copyright 2023, Mat Groves, All Rights Reserved
 */this.PIXI=this.PIXI||{},this.PIXI.spine=function(d,E,p,h,I,f){"use strict";function u(a){var n=Object.create(null);return a&&Object.keys(a).forEach(function(t){if(t!=="default"){var e=Object.getOwnPropertyDescriptor(a,t);Object.defineProperty(n,t,e.get?e:{enumerable:!0,get:function(){return a[t]}})}}),n.default=a,Object.freeze(n)}var i=u(h),S=u(I),l=u(f),r=(a=>(a[a.UNKNOWN=0]="UNKNOWN",a[a.VER37=37]="VER37",a[a.VER38=38]="VER38",a[a.VER40=40]="VER40",a[a.VER41=41]="VER41",a))(r||{});function c(a){const n=a.substr(0,3),t=Math.floor(Number(n)*10+.001);return n==="3.7"?37:n==="3.8"?38:n==="4.0"?40:n==="4.1"?41:t<37?37:0}class m{constructor(){this.scale=1}readSkeletonData(n,t){let e=null,s=this.readVersionOldFormat(t),o=c(s);if(o===r.VER38&&(e=new i.SkeletonBinary(new i.AtlasAttachmentLoader(n))),s=this.readVersionNewFormat(t),o=c(s),(o===r.VER40||o===r.VER41)&&(e=new l.SkeletonBinary(new l.AtlasAttachmentLoader(n))),!e){const V=`Unsupported version of spine model ${s}, please update pixi-spine`;console.error(V)}return e.scale=this.scale,e.readSkeletonData(t)}readVersionOldFormat(n){const t=new p.BinaryInput(n);let e;try{t.readString(),e=t.readString()}catch(s){e=""}return e||""}readVersionNewFormat(n){const t=new p.BinaryInput(n);t.readInt32(),t.readInt32();let e;try{e=t.readString()}catch(s){e=""}return e||""}}class w{constructor(){this.scale=1}readSkeletonData(n,t){const e=t.skeleton.spine,s=c(e);let o=null;if(s===r.VER37&&(o=new S.SkeletonJson(new S.AtlasAttachmentLoader(n))),s===r.VER38&&(o=new i.SkeletonJson(new i.AtlasAttachmentLoader(n))),(s===r.VER40||s===r.VER41)&&(o=new l.SkeletonJson(new l.AtlasAttachmentLoader(n))),!o){const V=`Unsupported version of spine model ${e}, please update pixi-spine`;console.error(V)}return o.scale=this.scale,o.readSkeletonData(t)}}class R extends E.SpineLoaderAbstract{createBinaryParser(){return new m}createJsonParser(){return new w}parseData(n,t,e){return{spineData:n.readSkeletonData(t,e),spineAtlas:t}}}class k extends p.SpineBase{createSkeleton(n){const t=c(n.version);let e=null;if(t===r.VER37&&(e=S),t===r.VER38&&(e=i),(t===r.VER40||t===r.VER41)&&(e=l),!e){const s=`Cant detect version of spine model ${n.version}`;console.error(s)}this.skeleton=new e.Skeleton(n),this.skeleton.updateWorldTransform(),this.stateData=new e.AnimationStateData(n),this.state=new e.AnimationState(this.stateData)}}return new R().installLoader(),d.SPINE_VERSION=r,d.Spine=k,d.detectSpineVersion=c,d}({},PIXI.spine,base,PIXI.spine38,PIXI.spine37,PIXI.spine41);
//# sourceMappingURL=loader-uni.js.map
