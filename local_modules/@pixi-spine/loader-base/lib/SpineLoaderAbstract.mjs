import { TextureAtlas } from '@pixi-spine/base';
import { LoaderParserPriority, checkExtension, checkDataUrl } from '@pixi/assets';
import { ExtensionType, settings, utils, extensions } from '@pixi/core';
import { makeSpineTextureAtlasLoaderFunctionFromPixiLoaderObject } from './atlasLoader.mjs';

const validJSONExtension = ".json";
const validJSONMIME = "application/json";
const validAtlasMIMEs = ["application/octet-stream", "text/plain"];
const validImageMIMEs = ["image/jpeg", "image/png"];
function isJson(resource) {
  return resource.hasOwnProperty("bones");
}
function isBuffer(resource) {
  return resource instanceof ArrayBuffer;
}
class SpineLoaderAbstract {
  constructor() {
  }
  installLoader() {
    const spineAdapter = this;
    const spineLoaderExtension = {
      extension: ExtensionType.Asset,
      loader: {
        extension: {
          type: ExtensionType.LoadParser,
          priority: LoaderParserPriority.Normal
        },
        // #region Downloading skel buffer data
        test(url) {
          return checkExtension(url, ".skel");
        },
        async load(url) {
          const isSpineSkelFileURL = checkDataUrl(url, validAtlasMIMEs);
          const buffer = isSpineSkelFileURL ? dataURLToArrayBuffer(url.slice(0, url.lastIndexOf("."))) : await (await settings.ADAPTER.fetch(url)).arrayBuffer();
          return buffer;
        },
        // #endregion
        // #region Parsing spine data
        testParse(asset, options) {
          const isJsonSpineModel = checkDataUrl(options.src, validJSONMIME) || checkExtension(options.src, validJSONExtension) && isJson(asset);
          const isBinarySpineModel = checkExtension(options.src, ".skel") && isBuffer(asset);
          const isMetadataAngry = options.data?.spineAtlas === false;
          return Promise.resolve(isJsonSpineModel && !isMetadataAngry || isBinarySpineModel);
        },
        async parse(asset, loadAsset, loader) {
          const fileExt = utils.path.extname(loadAsset.src).toLowerCase();
          const fileName = utils.path.basename(loadAsset.src, fileExt);
          let basePath = utils.path.dirname(loadAsset.src);
          if (basePath && basePath.lastIndexOf("/") !== basePath.length - 1) {
            basePath += "/";
          }
          const isJsonSpineModel = checkDataUrl(loadAsset.src, validJSONMIME) || checkExtension(loadAsset.src, validJSONExtension) && isJson(asset);
          let parser = null;
          let dataToParse = asset;
          if (isJsonSpineModel) {
            parser = spineAdapter.createJsonParser();
          } else {
            parser = spineAdapter.createBinaryParser();
            dataToParse = new Uint8Array(asset);
          }
          const metadata = loadAsset.data || {};
          const metadataSkeletonScale = metadata?.spineSkeletonScale ?? null;
          if (metadataSkeletonScale) {
            parser.scale = metadataSkeletonScale;
          }
          const metadataAtlas = metadata.spineAtlas;
          if (metadataAtlas && metadataAtlas.pages) {
            return spineAdapter.parseData(parser, metadataAtlas, dataToParse);
          }
          let textAtlas = metadata.atlasRawData;
          const isSpineAtlasFileURL = checkDataUrl(metadata.spineAtlasFile, validAtlasMIMEs);
          if (isSpineAtlasFileURL) {
            textAtlas = atob(metadata.spineAtlasFile.split(",")[1]);
          }
          if (textAtlas) {
            let auxResolve = null;
            let auxReject = null;
            const atlasPromise = new Promise((resolve, reject) => {
              auxResolve = resolve;
              auxReject = reject;
            });
            const imageURL = typeof metadata.image === "string" && checkDataUrl(metadata.image, validImageMIMEs) ? metadata.image : null;
            const atlas = new TextureAtlas(
              textAtlas,
              makeSpineTextureAtlasLoaderFunctionFromPixiLoaderObject(loader, basePath, metadata.imageMetadata, imageURL),
              (newAtlas) => {
                if (!newAtlas) {
                  auxReject("Something went terribly wrong loading a spine .atlas file\nMost likely your texture failed to load.");
                }
                auxResolve(atlas);
              }
            );
            const textureAtlas2 = await atlasPromise;
            return spineAdapter.parseData(parser, textureAtlas2, dataToParse);
          }
          let atlasPath = metadata.spineAtlasFile;
          if (!atlasPath) {
            atlasPath = `${basePath + fileName}.atlas`;
          }
          const textureAtlas = await loader.load({ src: atlasPath, data: metadata, alias: metadata.spineAtlasAlias });
          return spineAdapter.parseData(parser, textureAtlas, dataToParse);
        }
        // #endregion
        // unload(asset: ISpineResource<SKD>, loadAsset, loader) {
        // 	???
        // },
      }
    };
    extensions.add(spineLoaderExtension);
    return spineLoaderExtension;
  }
}
function dataURLToArrayBuffer(dataURL) {
  const base64 = dataURL.split(",")[1];
  const binaryString = atob(base64);
  const length = binaryString.length;
  const arrayBuffer = new ArrayBuffer(length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }
  return arrayBuffer;
}

export { SpineLoaderAbstract };
//# sourceMappingURL=SpineLoaderAbstract.mjs.map
