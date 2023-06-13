function enumValue(type: any, name: string) {
  return type[name[0].toUpperCase() + name.slice(1)]
}
enum TextureFilter {
  Nearest = 9728, // WebGLRenderingContext.NEAREST
  Linear = 9729, // WebGLRenderingContext.LINEAR
  MipMap = 9987, // WebGLRenderingContext.LINEAR_MIPMAP_LINEAR
  MipMapNearestNearest = 9984, // WebGLRenderingContext.NEAREST_MIPMAP_NEAREST
  MipMapLinearNearest = 9985, // WebGLRenderingContext.LINEAR_MIPMAP_NEAREST
  MipMapNearestLinear = 9986, // WebGLRenderingContext.NEAREST_MIPMAP_LINEAR
  MipMapLinearLinear = 9987, // WebGLRenderingContext.LINEAR_MIPMAP_LINEAR
}

enum TextureWrap {
  MirroredRepeat = 33648, // WebGLRenderingContext.MIRRORED_REPEAT
  ClampToEdge = 33071, // WebGLRenderingContext.CLAMP_TO_EDGE
  Repeat = 10497, // WebGLRenderingContext.REPEAT
}
export interface StringMap<T> {
  [key: string]: T
}

class TextureRegion {
  u = 0
  v = 0
  u2 = 0
  v2 = 0
  width = 0
  height = 0
  degrees = 0
  offsetX = 0
  offsetY = 0
  originalWidth = 0
  originalHeight = 0
}
export class AtlasReader {
  pages = new Array<TextureAtlasPage>()
  regions = new Array<TextureAtlasRegion>()

  constructor(atlasText: string) {
    const reader = new TextureAtlasReader(atlasText)
    const entry = new Array<string>(4)

    const pageFields: StringMap<(page: TextureAtlasPage) => void> = {}
    pageFields["size"] = (page: TextureAtlasPage) => {
      if (entry[1] && entry[2]) {
        page.width = parseInt(entry[1])
        page.height = parseInt(entry[2])
      }
    }
    pageFields["format"] = () => {
      // page.format = Format[tuple[0]]; we don't need format in WebGL
    }
    pageFields["filter"] = (page: TextureAtlasPage) => {
      if (entry[1] && entry[2]) {
        page.minFilter = enumValue(TextureFilter, entry[1]) as TextureFilter
        page.magFilter = enumValue(TextureFilter, entry[2]) as TextureFilter
      }
    }
    pageFields["repeat"] = (page: TextureAtlasPage) => {
      if (entry[1] && entry[2]) {
        if (entry[1].indexOf("x") != -1) page.uWrap = TextureWrap.Repeat
        if (entry[1].indexOf("y") != -1) page.vWrap = TextureWrap.Repeat
      }
    }
    pageFields["pma"] = (page: TextureAtlasPage) => {
      page.pma = entry[1] == "true"
    }

    const regionFields: StringMap<(region: TextureAtlasRegion) => void> = {}
    regionFields["xy"] = (region: TextureAtlasRegion) => {
      if (entry[1] && entry[2]) {
        region.x = parseInt(entry[1])
        region.y = parseInt(entry[2])
      }
    }
    regionFields["size"] = (region: TextureAtlasRegion) => {
      if (entry[1] && entry[2]) {
        region.width = parseInt(entry[1])
        region.height = parseInt(entry[2])
      }
    }
    regionFields["bounds"] = (region: TextureAtlasRegion) => {
      if (entry[1] && entry[2] && entry[3] && entry[4]) {
        region.x = parseInt(entry[1])
        region.y = parseInt(entry[2])
        region.width = parseInt(entry[3])
        region.height = parseInt(entry[4])
      }
    }
    regionFields["offset"] = (region: TextureAtlasRegion) => {
      if (entry[1] && entry[2]) {
        region.offsetX = parseInt(entry[1])
        region.offsetY = parseInt(entry[2])
      }
    }
    regionFields["orig"] = (region: TextureAtlasRegion) => {
      if (entry[1] && entry[2]) {
        region.originalWidth = parseInt(entry[1])
        region.originalHeight = parseInt(entry[2])
      }
    }
    regionFields["offsets"] = (region: TextureAtlasRegion) => {
      if (entry[1] && entry[2] && entry[3] && entry[4]) {
        region.offsetX = parseInt(entry[1])
        region.offsetY = parseInt(entry[2])
        region.originalWidth = parseInt(entry[3])
        region.originalHeight = parseInt(entry[4])
      }
    }
    regionFields["rotate"] = (region: TextureAtlasRegion) => {
      const value = entry[1]
      if (value == "true") region.degrees = 90
      else if (value != "false" && value) region.degrees = parseInt(value)
    }
    regionFields["index"] = (region: TextureAtlasRegion) => {
      if (entry[1]) {
        region.index = parseInt(entry[1])
      }
    }

    let line = reader.readLine()
    // Ignore empty lines before first entry.
    while (line && line.trim().length == 0) line = reader.readLine()
    // Header entries.
    while (true) {
      if (!line || line.trim().length == 0) break
      if (reader.readEntry(entry, line) == 0) break // Silently ignore all header fields.
      line = reader.readLine()
    }

    // Page and region entries.
    let page: TextureAtlasPage | null = null
    let names: string[] | null = null
    let values: number[][] | null = null
    while (true) {
      if (line === null) break
      if (line.trim().length == 0) {
        page = null
        line = reader.readLine()
      } else if (!page) {
        page = new TextureAtlasPage(line.trim())
        while (true) {
          if (
            reader.readEntry(entry, (line = reader.readLine())) == 0 &&
            entry[0]
          )
            break
          const field = pageFields[entry[0]]
          if (field) field(page)
        }
        this.pages.push(page)
      } else {
        const region = new TextureAtlasRegion(page, line)

        while (true) {
          const count = reader.readEntry(entry, (line = reader.readLine()))
          if (count == 0) break
          const field = regionFields[entry[0]]
          if (field) field(region)
          else {
            if (!names) names = []
            if (!values) values = []
            names.push(entry[0])
            const entryValues: number[] = []
            for (let i = 0; i < count; i++)
              entryValues.push(parseInt(entry[i + 1]))
            values.push(entryValues)
          }
        }
        if (region.originalWidth == 0 && region.originalHeight == 0) {
          region.originalWidth = region.width
          region.originalHeight = region.height
        }
        if (names && names.length > 0 && values && values.length > 0) {
          region.names = names
          region.values = values
          names = null
          values = null
        }
        region.u = region.x / page.width
        region.v = region.y / page.height
        if (region.degrees == 90) {
          region.u2 = (region.x + region.height) / page.width
          region.v2 = (region.y + region.width) / page.height
        } else {
          region.u2 = (region.x + region.width) / page.width
          region.v2 = (region.y + region.height) / page.height
        }
        this.regions.push(region)
      }
    }
  }

  findRegion(name: string): TextureAtlasRegion | null {
    for (let i = 0; i < this.regions.length; i++) {
      if (this.regions[i].name == name) {
        return this.regions[i]
      }
    }
    return null
  }
}

class TextureAtlasReader {
  lines: Array<string>
  index = 0

  constructor(text: string) {
    this.lines = text.split(/\r\n|\r|\n/)
  }

  readLine(): string | null {
    if (this.index >= this.lines.length) return null
    return this.lines[this.index++]
  }

  readEntry(entry: string[], line: string | null): number {
    if (!line) return 0
    line = line.trim()
    if (line.length == 0) return 0

    const colon = line.indexOf(":")
    if (colon == -1) return 0
    entry[0] = line.substr(0, colon).trim()
    for (let i = 1, lastMatch = colon + 1; ; i++) {
      const comma = line.indexOf(",", lastMatch)
      if (comma == -1) {
        entry[i] = line.substr(lastMatch).trim()
        return i
      }
      entry[i] = line.substr(lastMatch, comma - lastMatch).trim()
      lastMatch = comma + 1
      if (i == 4) return 4
    }
  }
}

export class TextureAtlasPage {
  name: string
  minFilter: TextureFilter = TextureFilter.Nearest
  magFilter: TextureFilter = TextureFilter.Nearest
  uWrap: TextureWrap = TextureWrap.ClampToEdge
  vWrap: TextureWrap = TextureWrap.ClampToEdge
  width = 0
  height = 0
  pma = false
  regions = new Array<TextureAtlasRegion>()

  constructor(name: string) {
    this.name = name
  }
}

export class TextureAtlasRegion extends TextureRegion {
  page: TextureAtlasPage
  name: string
  x = 0
  y = 0
  offsetX = 0
  offsetY = 0
  originalWidth = 0
  originalHeight = 0
  index = 0
  degrees = 0
  names: string[] | null = null
  values: number[][] | null = null

  constructor(page: TextureAtlasPage, name: string) {
    super()
    this.page = page
    this.name = name
    page.regions.push(this)
  }
}
