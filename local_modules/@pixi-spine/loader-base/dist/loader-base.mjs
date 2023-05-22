/*!
 * @pixi-spine/loader-base - v4.0.3
 * Compiled Fri, 12 May 2023 00:15:30 UTC
 *
 * @pixi-spine/loader-base is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 * 
 * Copyright 2023, Ivan Igorevich Popelyshev <ivan.popelyshev@gmail.com>, All Rights Reserved
 */import{TextureAtlas as b}from"@pixi-spine/base";import{LoaderParserPriority as L,checkExtension as g,checkDataUrl as y}from"@pixi/assets";import{ExtensionType as w,settings as j,utils as f,extensions as v}from"@pixi/core";const C={extension:w.Asset,loader:{extension:{type:w.LoadParser,priority:L.Normal},test(s){return g(s,".atlas")},async load(s){return await(await j.ADAPTER.fetch(s)).text()},testParse(s,r){const c=g(r.src,".atlas"),e=typeof s=="string";return Promise.resolve(c&&e)},async parse(s,r,c){const e=r.data;let t=f.path.dirname(r.src);t&&t.lastIndexOf("/")!==t.length-1&&(t+="/");let n=null,o=null;const u=new Promise((p,i)=>{n=p,o=i});let d;const l=p=>{p||o(`Something went terribly wrong loading a spine .atlas file
Most likely your texture failed to load.`),n(d)};if(e.image||e.images){const p=Object.assign(e.image?{default:e.image}:{},e.images);d=new b(s,(i,m)=>{const a=p[i]||p.default;a&&a.baseTexture?m(a.baseTexture):m(a)},l)}else d=new b(s,k(c,t,e.imageMetadata),l);return await u},unload(s){s.dispose()}}},k=(s,r,c,e)=>async(t,n)=>{const o=f.path.join(...r.split(f.path.sep),t),u=await s.load(e||{src:o,data:c});n(u.baseTexture)};v.add(C);const B=".json",F="application/json",J="application/octet-stream",$=["image/jpeg","image/png"];function M(s){return s.hasOwnProperty("bones")}function q(s){return s instanceof ArrayBuffer}class z{constructor(){}installLoader(){const r=this,c={extension:w.Asset,loader:{extension:{type:w.LoadParser,priority:L.Normal},test(e){return g(e,".skel")},async load(e){return await(await j.ADAPTER.fetch(e)).arrayBuffer()},testParse(e,t){var n;const o=y(t.src,F)||g(t.src,B)&&M(e),u=g(t.src,".skel")&&q(e),d=((n=t.data)==null?void 0:n.spineAtlas)===!1;return Promise.resolve(o&&!d||u)},async parse(e,t,n){var o;const u=f.path.extname(t.src).toLowerCase(),d=f.path.basename(t.src,u);let l=f.path.dirname(t.src);l&&l.lastIndexOf("/")!==l.length-1&&(l+="/");const p=y(t.src,F)||g(t.src,B)&&M(e);let i=null,m=e;p?i=r.createJsonParser():(i=r.createBinaryParser(),m=new Uint8Array(e));const a=t.data||{},S=(o=a==null?void 0:a.spineSkeletonScale)!=null?o:null;S&&(i.scale=S);const x=a.spineAtlas;if(x&&x.pages)return r.parseData(i,x,m);let A=a.atlasRawData;if(y(a.spineAtlasFile,J)&&(A=Buffer.from(a.spineAtlasFile.split(",")[1],"base64").toString("binary")),A){let T=null,D=null;const E=new Promise((h,U)=>{T=h,D=U}),R=typeof a.image=="string"&&y(a.image,$)?a.image:null,I=new b(A,k(n,l,a.imageMetadata,R),h=>{h||D(`Something went terribly wrong loading a spine .atlas file
Most likely your texture failed to load.`),T(I)}),N=await E;return r.parseData(i,N,m)}let P=a.spineAtlasFile;P||(P=`${l+d}.atlas`);const O=await n.load({src:P,data:a,alias:a.spineAtlasAlias});return r.parseData(i,O,m)}}};return v.add(c),c}}export{z as SpineLoaderAbstract,k as makeSpineTextureAtlasLoaderFunctionFromPixiLoaderObject};
//# sourceMappingURL=loader-base.mjs.map
