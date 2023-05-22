import { settings } from '../../../settings/dist/esm/settings.mjs';
export { isMobile } from '../../../settings/dist/esm/settings.mjs';
export { default as EventEmitter } from '../../node_modules/eventemitter3/index.mjs';
import '../../../../earcut/src/earcut.mjs';
import { parse, format, resolve } from 'url';
import { BLEND_MODES } from '../../../constants/dist/esm/constants.mjs';

/*!
 * @pixi/utils - v6.5.8
 * Compiled Sun, 23 Oct 2022 23:01:45 UTC
 *
 * @pixi/utils is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

/**
 * This file contains redeclared types for Node `url` and `querystring` modules. These modules
 * don't provide their own typings but instead are a part of the full Node typings. The purpose of
 * this file is to redeclare the required types to avoid having the whole Node types as a
 * dependency.
 */
var url = {
    parse: parse,
    format: format,
    resolve: resolve,
};

/**
 * The prefix that denotes a URL is for a retina asset.
 * @static
 * @name RETINA_PREFIX
 * @memberof PIXI.settings
 * @type {RegExp}
 * @default /@([0-9\.]+)x/
 * @example `@2x`
 */
settings.RETINA_PREFIX = /@([0-9\.]+)x/;
/**
 * Should the `failIfMajorPerformanceCaveat` flag be enabled as a context option used in the `isWebGLSupported` function.
 * If set to true, a WebGL renderer can fail to be created if the browser thinks there could be performance issues when
 * using WebGL.
 *
 * In PixiJS v6 this has changed from true to false by default, to allow WebGL to work in as many scenarios as possible.
 * However, some users may have a poor experience, for example, if a user has a gpu or driver version blacklisted by the
 * browser.
 *
 * If your application requires high performance rendering, you may wish to set this to false.
 * We recommend one of two options if you decide to set this flag to false:
 *
 * 1: Use the `pixi.js-legacy` package, which includes a Canvas renderer as a fallback in case high performance WebGL is
 *    not supported.
 *
 * 2: Call `isWebGLSupported` (which if found in the PIXI.utils package) in your code before attempting to create a PixiJS
 *    renderer, and show an error message to the user if the function returns false, explaining that their device & browser
 *    combination does not support high performance WebGL.
 *    This is a much better strategy than trying to create a PixiJS renderer and finding it then fails.
 * @static
 * @name FAIL_IF_MAJOR_PERFORMANCE_CAVEAT
 * @memberof PIXI.settings
 * @type {boolean}
 * @default false
 */
settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = false;

var saidHello = false;
var VERSION = '6.5.8';
/**
 * Logs out the version and renderer information for this running instance of PIXI.
 * If you don't want to see this message you can run `PIXI.utils.skipHello()` before
 * creating your renderer. Keep in mind that doing that will forever make you a jerk face.
 * @static
 * @function sayHello
 * @memberof PIXI.utils
 * @param {string} type - The string renderer type to log.
 */
function sayHello(type) {
    var _a;
    if (saidHello) {
        return;
    }
    if (settings.ADAPTER.getNavigator().userAgent.toLowerCase().indexOf('chrome') > -1) {
        var args = [
            "\n %c %c %c PixiJS " + VERSION + " - \u2730 " + type + " \u2730  %c  %c  http://www.pixijs.com/  %c %c \u2665%c\u2665%c\u2665 \n\n",
            'background: #ff66a5; padding:5px 0;',
            'background: #ff66a5; padding:5px 0;',
            'color: #ff66a5; background: #030307; padding:5px 0;',
            'background: #ff66a5; padding:5px 0;',
            'background: #ffc3dc; padding:5px 0;',
            'background: #ff66a5; padding:5px 0;',
            'color: #ff2424; background: #fff; padding:5px 0;',
            'color: #ff2424; background: #fff; padding:5px 0;',
            'color: #ff2424; background: #fff; padding:5px 0;' ];
        (_a = globalThis.console).log.apply(_a, args);
    }
    else if (globalThis.console) {
        globalThis.console.log("PixiJS " + VERSION + " - " + type + " - http://www.pixijs.com/");
    }
    saidHello = true;
}

var supported;
/**
 * Helper for checking for WebGL support.
 * @memberof PIXI.utils
 * @function isWebGLSupported
 * @returns {boolean} Is WebGL supported.
 */
function isWebGLSupported() {
    if (typeof supported === 'undefined') {
        supported = (function supported() {
            var contextOptions = {
                stencil: true,
                failIfMajorPerformanceCaveat: settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT,
            };
            try {
                if (!settings.ADAPTER.getWebGLRenderingContext()) {
                    return false;
                }
                var canvas = settings.ADAPTER.createCanvas();
                var gl = (canvas.getContext('webgl', contextOptions)
                    || canvas.getContext('experimental-webgl', contextOptions));
                var success = !!(gl && gl.getContextAttributes().stencil);
                if (gl) {
                    var loseContext = gl.getExtension('WEBGL_lose_context');
                    if (loseContext) {
                        loseContext.loseContext();
                    }
                }
                gl = null;
                return success;
            }
            catch (e) {
                return false;
            }
        })();
    }
    return supported;
}

/**
 * Converts a hexadecimal color number to an [R, G, B] array of normalized floats (numbers from 0.0 to 1.0).
 * @example
 * PIXI.utils.hex2rgb(0xffffff); // returns [1, 1, 1]
 * @memberof PIXI.utils
 * @function hex2rgb
 * @param {number} hex - The hexadecimal number to convert
 * @param  {number[]} [out=[]] - If supplied, this array will be used rather than returning a new one
 * @returns {number[]} An array representing the [R, G, B] of the color where all values are floats.
 */
function hex2rgb(hex, out) {
    if (out === void 0) { out = []; }
    out[0] = ((hex >> 16) & 0xFF) / 255;
    out[1] = ((hex >> 8) & 0xFF) / 255;
    out[2] = (hex & 0xFF) / 255;
    return out;
}
/**
 * Converts a hexadecimal color number to a string.
 * @example
 * PIXI.utils.hex2string(0xffffff); // returns "#ffffff"
 * @memberof PIXI.utils
 * @function hex2string
 * @param {number} hex - Number in hex (e.g., `0xffffff`)
 * @returns {string} The string color (e.g., `"#ffffff"`).
 */
function hex2string(hex) {
    var hexString = hex.toString(16);
    hexString = '000000'.substring(0, 6 - hexString.length) + hexString;
    return "#" + hexString;
}
/**
 * Converts a color as an [R, G, B] array of normalized floats to a hexadecimal number.
 * @example
 * PIXI.utils.rgb2hex([1, 1, 1]); // returns 0xffffff, which is 16777215 as an integer
 * @memberof PIXI.utils
 * @function rgb2hex
 * @param {number[]} rgb - Array of numbers where all values are normalized floats from 0.0 to 1.0.
 * @returns {number} Number in hexadecimal.
 */
function rgb2hex(rgb) {
    return (((rgb[0] * 255) << 16) + ((rgb[1] * 255) << 8) + (rgb[2] * 255 | 0));
}

/**
 * Corrects PixiJS blend, takes premultiplied alpha into account
 * @memberof PIXI.utils
 * @function mapPremultipliedBlendModes
 * @private
 * @returns {Array<number[]>} Mapped modes.
 */
function mapPremultipliedBlendModes() {
    var pm = [];
    var npm = [];
    for (var i = 0; i < 32; i++) {
        pm[i] = i;
        npm[i] = i;
    }
    pm[BLEND_MODES.NORMAL_NPM] = BLEND_MODES.NORMAL;
    pm[BLEND_MODES.ADD_NPM] = BLEND_MODES.ADD;
    pm[BLEND_MODES.SCREEN_NPM] = BLEND_MODES.SCREEN;
    npm[BLEND_MODES.NORMAL] = BLEND_MODES.NORMAL_NPM;
    npm[BLEND_MODES.ADD] = BLEND_MODES.ADD_NPM;
    npm[BLEND_MODES.SCREEN] = BLEND_MODES.SCREEN_NPM;
    var array = [];
    array.push(npm);
    array.push(pm);
    return array;
}
/**
 * maps premultiply flag and blendMode to adjusted blendMode
 * @memberof PIXI.utils
 * @constant premultiplyBlendMode
 * @type {Array<number[]>}
 */
var premultiplyBlendMode = mapPremultipliedBlendModes();
/**
 * premultiplies tint
 * @memberof PIXI.utils
 * @function premultiplyTint
 * @param {number} tint - integer RGB
 * @param {number} alpha - floating point alpha (0.0-1.0)
 * @returns {number} tint multiplied by alpha
 */
function premultiplyTint(tint, alpha) {
    if (alpha === 1.0) {
        return (alpha * 255 << 24) + tint;
    }
    if (alpha === 0.0) {
        return 0;
    }
    var R = ((tint >> 16) & 0xFF);
    var G = ((tint >> 8) & 0xFF);
    var B = (tint & 0xFF);
    R = ((R * alpha) + 0.5) | 0;
    G = ((G * alpha) + 0.5) | 0;
    B = ((B * alpha) + 0.5) | 0;
    return (alpha * 255 << 24) + (R << 16) + (G << 8) + B;
}
/**
 * converts integer tint and float alpha to vec4 form, premultiplies by default
 * @memberof PIXI.utils
 * @function premultiplyTintToRgba
 * @param {number} tint - input tint
 * @param {number} alpha - alpha param
 * @param {Float32Array} [out] - output
 * @param {boolean} [premultiply=true] - do premultiply it
 * @returns {Float32Array} vec4 rgba
 */
function premultiplyTintToRgba(tint, alpha, out, premultiply) {
    out = out || new Float32Array(4);
    out[0] = ((tint >> 16) & 0xFF) / 255.0;
    out[1] = ((tint >> 8) & 0xFF) / 255.0;
    out[2] = (tint & 0xFF) / 255.0;
    if (premultiply || premultiply === undefined) {
        out[0] *= alpha;
        out[1] *= alpha;
        out[2] *= alpha;
    }
    out[3] = alpha;
    return out;
}

function getBufferType(array) {
    if (array.BYTES_PER_ELEMENT === 4) {
        if (array instanceof Float32Array) {
            return 'Float32Array';
        }
        else if (array instanceof Uint32Array) {
            return 'Uint32Array';
        }
        return 'Int32Array';
    }
    else if (array.BYTES_PER_ELEMENT === 2) {
        if (array instanceof Uint16Array) {
            return 'Uint16Array';
        }
    }
    else if (array.BYTES_PER_ELEMENT === 1) {
        if (array instanceof Uint8Array) {
            return 'Uint8Array';
        }
    }
    // TODO map out the rest of the array elements!
    return null;
}

// Taken from the bit-twiddle package
/**
 * Rounds to next power of two.
 * @function nextPow2
 * @memberof PIXI.utils
 * @param {number} v - input value
 * @returns {number} - next rounded power of two
 */
function nextPow2(v) {
    v += v === 0 ? 1 : 0;
    --v;
    v |= v >>> 1;
    v |= v >>> 2;
    v |= v >>> 4;
    v |= v >>> 8;
    v |= v >>> 16;
    return v + 1;
}
/**
 * Checks if a number is a power of two.
 * @function isPow2
 * @memberof PIXI.utils
 * @param {number} v - input value
 * @returns {boolean} `true` if value is power of two
 */
function isPow2(v) {
    return !(v & (v - 1)) && (!!v);
}
/**
 * Computes ceil of log base 2
 * @function log2
 * @memberof PIXI.utils
 * @param {number} v - input value
 * @returns {number} logarithm base 2
 */
function log2(v) {
    var r = (v > 0xFFFF ? 1 : 0) << 4;
    v >>>= r;
    var shift = (v > 0xFF ? 1 : 0) << 3;
    v >>>= shift;
    r |= shift;
    shift = (v > 0xF ? 1 : 0) << 2;
    v >>>= shift;
    r |= shift;
    shift = (v > 0x3 ? 1 : 0) << 1;
    v >>>= shift;
    r |= shift;
    return r | (v >> 1);
}

/**
 * Remove items from a javascript array without generating garbage
 * @function removeItems
 * @memberof PIXI.utils
 * @param {Array<any>} arr - Array to remove elements from
 * @param {number} startIdx - starting index
 * @param {number} removeCount - how many to remove
 */
function removeItems(arr, startIdx, removeCount) {
    var length = arr.length;
    var i;
    if (startIdx >= length || removeCount === 0) {
        return;
    }
    removeCount = (startIdx + removeCount > length ? length - startIdx : removeCount);
    var len = length - removeCount;
    for (i = startIdx; i < len; ++i) {
        arr[i] = arr[i + removeCount];
    }
    arr.length = len;
}

/**
 * Returns sign of number
 * @memberof PIXI.utils
 * @function sign
 * @param {number} n - the number to check the sign of
 * @returns {number} 0 if `n` is 0, -1 if `n` is negative, 1 if `n` is positive
 */
function sign(n) {
    if (n === 0)
        { return 0; }
    return n < 0 ? -1 : 1;
}

var nextUid = 0;
/**
 * Gets the next unique identifier
 * @memberof PIXI.utils
 * @function uid
 * @returns {number} The next unique identifier to use.
 */
function uid() {
    return ++nextUid;
}

// A map of warning messages already fired
var warnings = {};
/**
 * Helper for warning developers about deprecated features & settings.
 * A stack track for warnings is given; useful for tracking-down where
 * deprecated methods/properties/classes are being used within the code.
 * @memberof PIXI.utils
 * @function deprecation
 * @param {string} version - The version where the feature became deprecated
 * @param {string} message - Message should include what is deprecated, where, and the new solution
 * @param {number} [ignoreDepth=3] - The number of steps to ignore at the top of the error stack
 *        this is mostly to ignore internal deprecation calls.
 */
function deprecation(version, message, ignoreDepth) {
    if (ignoreDepth === void 0) { ignoreDepth = 3; }
    // Ignore duplicat
    if (warnings[message]) {
        return;
    }
    /* eslint-disable no-console */
    var stack = new Error().stack;
    // Handle IE < 10 and Safari < 6
    if (typeof stack === 'undefined') {
        console.warn('PixiJS Deprecation Warning: ', message + "\nDeprecated since v" + version);
    }
    else {
        // chop off the stack trace which includes PixiJS internal calls
        stack = stack.split('\n').splice(ignoreDepth).join('\n');
        if (console.groupCollapsed) {
            console.groupCollapsed('%cPixiJS Deprecation Warning: %c%s', 'color:#614108;background:#fffbe6', 'font-weight:normal;color:#614108;background:#fffbe6', message + "\nDeprecated since v" + version);
            console.warn(stack);
            console.groupEnd();
        }
        else {
            console.warn('PixiJS Deprecation Warning: ', message + "\nDeprecated since v" + version);
            console.warn(stack);
        }
    }
    /* eslint-enable no-console */
    warnings[message] = true;
}

/**
 * @todo Describe property usage
 * @static
 * @name ProgramCache
 * @memberof PIXI.utils
 * @type {object}
 */
var ProgramCache = {};
/**
 * @todo Describe property usage
 * @static
 * @name TextureCache
 * @memberof PIXI.utils
 * @type {object}
 */
var TextureCache = Object.create(null);
/**
 * @todo Describe property usage
 * @static
 * @name BaseTextureCache
 * @memberof PIXI.utils
 * @type {object}
 */
var BaseTextureCache = Object.create(null);

/**
 * Creates a Canvas element of the given size to be used as a target for rendering to.
 * @class
 * @memberof PIXI.utils
 */
/** @class */ ((function () {
    /**
     * @param width - the width for the newly created canvas
     * @param height - the height for the newly created canvas
     * @param {number} [resolution=PIXI.settings.RESOLUTION] - The resolution / device pixel ratio of the canvas
     */
    function CanvasRenderTarget(width, height, resolution) {
        this.canvas = settings.ADAPTER.createCanvas();
        this.context = this.canvas.getContext('2d');
        this.resolution = resolution || settings.RESOLUTION;
        this.resize(width, height);
    }
    /**
     * Clears the canvas that was created by the CanvasRenderTarget class.
     * @private
     */
    CanvasRenderTarget.prototype.clear = function () {
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    /**
     * Resizes the canvas to the specified width and height.
     * @param desiredWidth - the desired width of the canvas
     * @param desiredHeight - the desired height of the canvas
     */
    CanvasRenderTarget.prototype.resize = function (desiredWidth, desiredHeight) {
        this.canvas.width = Math.round(desiredWidth * this.resolution);
        this.canvas.height = Math.round(desiredHeight * this.resolution);
    };
    /** Destroys this canvas. */
    CanvasRenderTarget.prototype.destroy = function () {
        this.context = null;
        this.canvas = null;
    };
    Object.defineProperty(CanvasRenderTarget.prototype, "width", {
        /**
         * The width of the canvas buffer in pixels.
         * @member {number}
         */
        get: function () {
            return this.canvas.width;
        },
        set: function (val) {
            this.canvas.width = Math.round(val);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CanvasRenderTarget.prototype, "height", {
        /**
         * The height of the canvas buffer in pixels.
         * @member {number}
         */
        get: function () {
            return this.canvas.height;
        },
        set: function (val) {
            this.canvas.height = Math.round(val);
        },
        enumerable: false,
        configurable: true
    });
    return CanvasRenderTarget;
})());

var tempAnchor;
/**
 * Sets the `crossOrigin` property for this resource based on if the url
 * for this resource is cross-origin. If crossOrigin was manually set, this
 * function does nothing.
 * Nipped from the resource loader!
 * @ignore
 * @param {string} url - The url to test.
 * @param {object} [loc=window.location] - The location object to test against.
 * @returns {string} The crossOrigin value to use (or empty string for none).
 */
function determineCrossOrigin(url$1, loc) {
    if (loc === void 0) { loc = globalThis.location; }
    // data: and javascript: urls are considered same-origin
    if (url$1.indexOf('data:') === 0) {
        return '';
    }
    // default is window.location
    loc = loc || globalThis.location;
    if (!tempAnchor) {
        tempAnchor = document.createElement('a');
    }
    // let the browser determine the full href for the url of this resource and then
    // parse with the node url lib, we can't use the properties of the anchor element
    // because they don't work in IE9 :(
    tempAnchor.href = url$1;
    var parsedUrl = url.parse(tempAnchor.href);
    var samePort = (!parsedUrl.port && loc.port === '') || (parsedUrl.port === loc.port);
    // if cross origin
    if (parsedUrl.hostname !== loc.hostname || !samePort || parsedUrl.protocol !== loc.protocol) {
        return 'anonymous';
    }
    return '';
}

/**
 * get the resolution / device pixel ratio of an asset by looking for the prefix
 * used by spritesheets and image urls
 * @memberof PIXI.utils
 * @function getResolutionOfUrl
 * @param {string} url - the image path
 * @param {number} [defaultValue=1] - the defaultValue if no filename prefix is set.
 * @returns {number} resolution / device pixel ratio of an asset
 */
function getResolutionOfUrl(url, defaultValue) {
    var resolution = settings.RETINA_PREFIX.exec(url);
    if (resolution) {
        return parseFloat(resolution[1]);
    }
    return defaultValue !== undefined ? defaultValue : 1;
}

export { BaseTextureCache, ProgramCache, TextureCache, deprecation, determineCrossOrigin, getBufferType, getResolutionOfUrl, hex2rgb, hex2string, isPow2, isWebGLSupported, log2, nextPow2, premultiplyBlendMode, premultiplyTint, premultiplyTintToRgba, removeItems, rgb2hex, sayHello, sign, uid, url };
//# sourceMappingURL=utils.mjs.map
