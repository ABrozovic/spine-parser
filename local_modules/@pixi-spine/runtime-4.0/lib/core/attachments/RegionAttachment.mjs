import { Attachment } from './Attachment.mjs';
import { AttachmentType, Color, Utils } from '@pixi-spine/base';
import { Slot } from '../Slot.mjs';

const _RegionAttachment = class extends Attachment {
  constructor(name) {
    super(name);
    this.type = AttachmentType.Region;
    /** The local x translation. */
    this.x = 0;
    /** The local y translation. */
    this.y = 0;
    /** The local scaleX. */
    this.scaleX = 1;
    /** The local scaleY. */
    this.scaleY = 1;
    /** The local rotation. */
    this.rotation = 0;
    /** The width of the region attachment in Spine. */
    this.width = 0;
    /** The height of the region attachment in Spine. */
    this.height = 0;
    /** The color to tint the region attachment. */
    this.color = new Color(1, 1, 1, 1);
    /** For each of the 4 vertices, a pair of <code>x,y</code> values that is the local position of the vertex.
     *
     * See {@link #updateOffset()}. */
    this.offset = Utils.newFloatArray(8);
    this.uvs = Utils.newFloatArray(8);
    this.tempColor = new Color(1, 1, 1, 1);
  }
  /** Calculates the {@link #offset} using the region settings. Must be called after changing region settings. */
  updateOffset() {
    const regionScaleX = this.width / this.region.originalWidth * this.scaleX;
    const regionScaleY = this.height / this.region.originalHeight * this.scaleY;
    const localX = -this.width / 2 * this.scaleX + this.region.offsetX * regionScaleX;
    const localY = -this.height / 2 * this.scaleY + this.region.offsetY * regionScaleY;
    const localX2 = localX + this.region.width * regionScaleX;
    const localY2 = localY + this.region.height * regionScaleY;
    const radians = this.rotation * Math.PI / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const localXCos = localX * cos + this.x;
    const localXSin = localX * sin;
    const localYCos = localY * cos + this.y;
    const localYSin = localY * sin;
    const localX2Cos = localX2 * cos + this.x;
    const localX2Sin = localX2 * sin;
    const localY2Cos = localY2 * cos + this.y;
    const localY2Sin = localY2 * sin;
    const offset = this.offset;
    offset[_RegionAttachment.OX1] = localXCos - localYSin;
    offset[_RegionAttachment.OY1] = localYCos + localXSin;
    offset[_RegionAttachment.OX2] = localXCos - localY2Sin;
    offset[_RegionAttachment.OY2] = localY2Cos + localXSin;
    offset[_RegionAttachment.OX3] = localX2Cos - localY2Sin;
    offset[_RegionAttachment.OY3] = localY2Cos + localX2Sin;
    offset[_RegionAttachment.OX4] = localX2Cos - localYSin;
    offset[_RegionAttachment.OY4] = localYCos + localX2Sin;
  }
  setRegion(region) {
    this.region = region;
    const uvs = this.uvs;
    if (region.degrees == 90) {
      uvs[2] = region.u;
      uvs[3] = region.v2;
      uvs[4] = region.u;
      uvs[5] = region.v;
      uvs[6] = region.u2;
      uvs[7] = region.v;
      uvs[0] = region.u2;
      uvs[1] = region.v2;
    } else {
      uvs[0] = region.u;
      uvs[1] = region.v2;
      uvs[2] = region.u;
      uvs[3] = region.v;
      uvs[4] = region.u2;
      uvs[5] = region.v;
      uvs[6] = region.u2;
      uvs[7] = region.v2;
    }
  }
  /** Transforms the attachment's four vertices to world coordinates.
   *
   * See [World transforms](http://esotericsoftware.com/spine-runtime-skeletons#World-transforms) in the Spine
   * Runtimes Guide.
   * @param worldVertices The output world vertices. Must have a length >= `offset` + 8.
   * @param offset The `worldVertices` index to begin writing values.
   * @param stride The number of `worldVertices` entries between the value pairs written. */
  computeWorldVertices(bone, worldVertices, offset, stride) {
    const vertexOffset = this.offset;
    const mat = bone instanceof Slot ? bone.bone.matrix : bone.matrix;
    const x = mat.tx;
    const y = mat.ty;
    const a = mat.a;
    const b = mat.c;
    const c = mat.b;
    const d = mat.d;
    let offsetX = 0;
    let offsetY = 0;
    offsetX = vertexOffset[_RegionAttachment.OX1];
    offsetY = vertexOffset[_RegionAttachment.OY1];
    worldVertices[offset] = offsetX * a + offsetY * b + x;
    worldVertices[offset + 1] = offsetX * c + offsetY * d + y;
    offset += stride;
    offsetX = vertexOffset[_RegionAttachment.OX2];
    offsetY = vertexOffset[_RegionAttachment.OY2];
    worldVertices[offset] = offsetX * a + offsetY * b + x;
    worldVertices[offset + 1] = offsetX * c + offsetY * d + y;
    offset += stride;
    offsetX = vertexOffset[_RegionAttachment.OX3];
    offsetY = vertexOffset[_RegionAttachment.OY3];
    worldVertices[offset] = offsetX * a + offsetY * b + x;
    worldVertices[offset + 1] = offsetX * c + offsetY * d + y;
    offset += stride;
    offsetX = vertexOffset[_RegionAttachment.OX4];
    offsetY = vertexOffset[_RegionAttachment.OY4];
    worldVertices[offset] = offsetX * a + offsetY * b + x;
    worldVertices[offset + 1] = offsetX * c + offsetY * d + y;
  }
  copy() {
    const copy = new _RegionAttachment(this.name);
    copy.region = this.region;
    copy.rendererObject = this.rendererObject;
    copy.path = this.path;
    copy.x = this.x;
    copy.y = this.y;
    copy.scaleX = this.scaleX;
    copy.scaleY = this.scaleY;
    copy.rotation = this.rotation;
    copy.width = this.width;
    copy.height = this.height;
    Utils.arrayCopy(this.uvs, 0, copy.uvs, 0, 8);
    Utils.arrayCopy(this.offset, 0, copy.offset, 0, 8);
    copy.color.setFromColor(this.color);
    return copy;
  }
};
let RegionAttachment = _RegionAttachment;
RegionAttachment.OX1 = 0;
RegionAttachment.OY1 = 1;
RegionAttachment.OX2 = 2;
RegionAttachment.OY2 = 3;
RegionAttachment.OX3 = 4;
RegionAttachment.OY3 = 5;
RegionAttachment.OX4 = 6;
RegionAttachment.OY4 = 7;
RegionAttachment.X1 = 0;
RegionAttachment.Y1 = 1;
RegionAttachment.C1R = 2;
RegionAttachment.C1G = 3;
RegionAttachment.C1B = 4;
RegionAttachment.C1A = 5;
RegionAttachment.U1 = 6;
RegionAttachment.V1 = 7;
RegionAttachment.X2 = 8;
RegionAttachment.Y2 = 9;
RegionAttachment.C2R = 10;
RegionAttachment.C2G = 11;
RegionAttachment.C2B = 12;
RegionAttachment.C2A = 13;
RegionAttachment.U2 = 14;
RegionAttachment.V2 = 15;
RegionAttachment.X3 = 16;
RegionAttachment.Y3 = 17;
RegionAttachment.C3R = 18;
RegionAttachment.C3G = 19;
RegionAttachment.C3B = 20;
RegionAttachment.C3A = 21;
RegionAttachment.U3 = 22;
RegionAttachment.V3 = 23;
RegionAttachment.X4 = 24;
RegionAttachment.Y4 = 25;
RegionAttachment.C4R = 26;
RegionAttachment.C4G = 27;
RegionAttachment.C4B = 28;
RegionAttachment.C4A = 29;
RegionAttachment.U4 = 30;
RegionAttachment.V4 = 31;

export { RegionAttachment };
//# sourceMappingURL=RegionAttachment.mjs.map
