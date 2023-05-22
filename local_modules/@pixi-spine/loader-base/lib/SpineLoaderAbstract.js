'use strict';

var base = require('@pixi-spine/base');
var assets = require('@pixi/assets');
var core = require('@pixi/core');
var atlasLoader = require('./atlasLoader.js');

const validJSONExtension = ".json";
const validJSONMIME = "application/json";
const validAtlasSMIME = "application/octet-stream";
const validImageMIMEs = [
  "image/jpeg",
  "image/png"
];
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
      extension: core.ExtensionType.Asset,
      loader: {
        extension: {
          type: core.ExtensionType.LoadParser,
          priority: assets.LoaderParserPriority.Normal
        },
        // #region Downloading skel buffer data
        test(url) {
          return assets.checkExtension(url, ".skel");
        },
        async load(url) {
          const response = await core.settings.ADAPTER.fetch(url);
          const buffer = await response.arrayBuffer();
          return buffer;
        },
        // #endregion
        // #region Parsing spine data
        testParse(asset, options) {
          const isJsonSpineModel = assets.checkDataUrl(options.src, validJSONMIME) || assets.checkExtension(options.src, validJSONExtension) && isJson(asset);
          const isBinarySpineModel = assets.checkExtension(options.src, ".skel") && isBuffer(asset);
          const isMetadataAngry = options.data?.spineAtlas === false;
          return Promise.resolve(isJsonSpineModel && !isMetadataAngry || isBinarySpineModel);
        },
        async parse(asset, loadAsset, loader) {
          const fileExt = core.utils.path.extname(loadAsset.src).toLowerCase();
          const fileName = core.utils.path.basename(loadAsset.src, fileExt);
          let basePath = core.utils.path.dirname(loadAsset.src);
          if (basePath && basePath.lastIndexOf("/") !== basePath.length - 1) {
            basePath += "/";
          }
          const isJsonSpineModel = assets.checkDataUrl(loadAsset.src, validJSONMIME) || assets.checkExtension(loadAsset.src, validJSONExtension) && isJson(asset);
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
          const isSpineAtlasFileURI = assets.checkDataUrl(metadata.spineAtlasFile, validAtlasSMIME);
          if (isSpineAtlasFileURI) {
            textAtlas = Buffer.from(metadata.spineAtlasFile.split(",")[1], "base64").toString("binary");
          }
          if (textAtlas) {
            let auxResolve = null;
            let auxReject = null;
            const atlasPromise = new Promise((resolve, reject) => {
              auxResolve = resolve;
              auxReject = reject;
            });
            const imageURI = typeof metadata.image === "string" && assets.checkDataUrl(metadata.image, validImageMIMEs) ? metadata.image : null;
            const atlas = new base.TextureAtlas(textAtlas, atlasLoader.makeSpineTextureAtlasLoaderFunctionFromPixiLoaderObject(loader, basePath, metadata.imageMetadata, imageURI), (newAtlas) => {
              if (!newAtlas) {
                auxReject("Something went terribly wrong loading a spine .atlas file\nMost likely your texture failed to load.");
              }
              auxResolve(atlas);
            });
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
    core.extensions.add(spineLoaderExtension);
    return spineLoaderExtension;
  }
}

exports.SpineLoaderAbstract = SpineLoaderAbstract;
//# sourceMappingURL=SpineLoaderAbstract.js.map
