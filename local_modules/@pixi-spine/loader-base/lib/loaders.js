'use strict';

var loaders = require('@pixi/loaders');
var core = require('@pixi/core');
var base = require('@pixi-spine/base');
var constants = require('@pixi/constants');

function isJson(resource) {
  return resource.type === loaders.LoaderResource.TYPE.JSON;
}
function isBuffer(resource) {
  return resource.xhrType === loaders.LoaderResource.XHR_RESPONSE_TYPE.BUFFER;
}
loaders.LoaderResource.setExtensionXhrType("skel", loaders.LoaderResource.XHR_RESPONSE_TYPE.BUFFER);
class AbstractSpineParser {
  genMiddleware() {
    const self = this;
    return {
      use(resource, next) {
        if (!resource.data) {
          return next();
        }
        const isJsonSpineModel = isJson(resource) && resource.data.bones;
        const isBinarySpineModel = isBuffer(resource) && (resource.extension === "skel" || resource.metadata && resource.metadata.spineMetadata);
        if (!isJsonSpineModel && !isBinarySpineModel) {
          return next();
        }
        let parser = null;
        let dataToParse = resource.data;
        if (isJsonSpineModel) {
          parser = self.createJsonParser();
        } else {
          parser = self.createBinaryParser();
          if (resource.data instanceof ArrayBuffer) {
            dataToParse = new Uint8Array(resource.data);
          }
        }
        const metadata = resource.metadata || {};
        const metadataSkeletonScale = metadata ? metadata.spineSkeletonScale : null;
        if (metadataSkeletonScale) {
          parser.scale = metadataSkeletonScale;
        }
        const metadataAtlas = metadata.spineAtlas;
        if (metadataAtlas === false) {
          return next();
        }
        if (metadataAtlas && metadataAtlas.pages) {
          self.parseData(resource, parser, metadataAtlas, dataToParse);
          return next();
        }
        const metadataAtlasSuffix = metadata.spineAtlasSuffix || ".atlas";
        let atlasPath = resource.url;
        const queryStringPos = atlasPath.indexOf("?");
        if (queryStringPos > 0) {
          atlasPath = atlasPath.substr(0, queryStringPos);
        }
        atlasPath = atlasPath.substr(0, atlasPath.lastIndexOf(".")) + metadataAtlasSuffix;
        if (metadata.spineAtlasFile) {
          atlasPath = metadata.spineAtlasFile;
        }
        atlasPath = atlasPath.replace(this.baseUrl, "");
        const atlasOptions = {
          crossOrigin: resource.crossOrigin,
          xhrType: loaders.LoaderResource.XHR_RESPONSE_TYPE.TEXT,
          metadata: metadata.spineMetadata || null,
          parentResource: resource
        };
        const imageOptions = {
          crossOrigin: resource.crossOrigin,
          metadata: metadata.imageMetadata || null,
          parentResource: resource
        };
        let baseUrl = resource.url.substr(0, resource.url.lastIndexOf("/") + 1);
        baseUrl = baseUrl.replace(this.baseUrl, "");
        const namePrefix = metadata.imageNamePrefix || `${resource.name}_atlas_page_`;
        let adapter;
        if (metadata.images)
          adapter = staticImageLoader(metadata.images);
        else if (metadata.image)
          adapter = staticImageLoader({ default: metadata.image });
        else if (metadata.imageLoader)
          adapter = metadata.imageLoader(this, namePrefix, baseUrl, imageOptions);
        else
          adapter = imageLoaderAdapter(this, namePrefix, baseUrl, imageOptions);
        const createSkeletonWithRawAtlas = (rawData) => {
          new base.TextureAtlas(rawData, adapter, (spineAtlas) => {
            if (spineAtlas) {
              self.parseData(resource, parser, spineAtlas, dataToParse);
            }
            next();
          });
        };
        if (metadata.atlasRawData) {
          createSkeletonWithRawAtlas(metadata.atlasRawData);
        } else {
          this.add(`${resource.name}_atlas`, atlasPath, atlasOptions, (atlasResource) => {
            if (!atlasResource.error) {
              createSkeletonWithRawAtlas(atlasResource.data);
            } else {
              next();
            }
          });
        }
      }
    };
  }
}
function imageLoaderAdapter(loader, namePrefix, baseUrl, imageOptions) {
  if (baseUrl && baseUrl.lastIndexOf("/") !== baseUrl.length - 1) {
    baseUrl += "/";
  }
  return (line, callback) => {
    const name = namePrefix + line;
    const url = baseUrl + line;
    const cachedResource = loader.resources[name];
    if (cachedResource) {
      const done = () => {
        callback(cachedResource.texture.baseTexture);
      };
      if (cachedResource.texture) {
        done();
      } else {
        cachedResource.onAfterMiddleware.add(done);
      }
    } else {
      loader.add(name, url, imageOptions, (resource) => {
        if (!resource.error) {
          if (line.indexOf("-pma.") >= 0) {
            resource.texture.baseTexture.alphaMode = constants.ALPHA_MODES.PMA;
          }
          callback(resource.texture.baseTexture);
        } else {
          callback(null);
        }
      });
    }
  };
}
function syncImageLoaderAdapter(baseUrl, crossOrigin) {
  if (baseUrl && baseUrl.lastIndexOf("/") !== baseUrl.length - 1) {
    baseUrl += "/";
  }
  return (line, callback) => {
    callback(core.BaseTexture.from(line, crossOrigin));
  };
}
function staticImageLoader(pages) {
  return (line, callback) => {
    const page = pages[line] || pages.default;
    if (page && page.baseTexture)
      callback(page.baseTexture);
    else
      callback(page);
  };
}

exports.AbstractSpineParser = AbstractSpineParser;
exports.imageLoaderAdapter = imageLoaderAdapter;
exports.staticImageLoader = staticImageLoader;
exports.syncImageLoaderAdapter = syncImageLoaderAdapter;
//# sourceMappingURL=loaders.js.map
