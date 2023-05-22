/// <reference path="./global.d.ts" />

import { ISkeletonData, ISkeletonParser, TextureAtlas } from "@pixi-spine/base"
import { Loader } from "@pixi/assets"
import { BaseTexture, Texture } from "@pixi/core"

/**
 * Metadata for loading spine assets
 * @public
 */
export declare interface ISpineMetadata {
  spineSkeletonScale?: number
  spineAtlas?: Partial<TextureAtlas>
  spineAtlasAlias?: string[]
  spineAtlasFile?: string
  atlasRawData?: string
  imageLoader?: (
    loader: Loader,
    path: string
  ) => (path: string, callback: (tex: BaseTexture) => any) => any
  imageMetadata?: any
  images?: Record<string, Texture | BaseTexture>
  image?: Texture | BaseTexture | string
}

/**
 * The final spineData+spineAtlas object that can be used to create a Spine.
 * @public
 */
export declare interface ISpineResource<SKD extends ISkeletonData> {
  spineData: SKD
  spineAtlas: TextureAtlas
}

/**
 * Ugly function to promisify the spine texture atlas loader function.
 * @public
 */
export declare const makeSpineTextureAtlasLoaderFunctionFromPixiLoaderObject: (
  loader: Loader,
  atlasBasePath: string,
  imageMetadata: any,
  imageURI?: string
) => (
  pageName: string,
  textureLoadedCallback: (tex: BaseTexture) => any
) => Promise<void>

/**
 * This abstract class is used to create a spine loader specifically for a needed version
 * @public
 */
export declare abstract class SpineLoaderAbstract<SKD extends ISkeletonData> {
  constructor()
  abstract createJsonParser(): ISkeletonParser
  abstract createBinaryParser(): ISkeletonParser
  abstract parseData(
    parser: ISkeletonParser,
    atlas: TextureAtlas,
    dataToParse: any
  ): ISpineResource<SKD>
  installLoader(): any
}

export {}
