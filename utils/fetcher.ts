import axios from "axios"

const REPO_URL =
  "https://raw.githubusercontent.com/TortasDolly/LangrisserSpine/main/"
export const fetchFiles = async (
  files: { atlas?: string; png?: string; skel?: string } | undefined
) => {
  if (!files) return { atlasUrl: "", imageUrl: "", skelUrl: "" }
  const filePromises: Promise<any>[] = []
  const fetchedFiles: {
    atlasUrl?: string
    imageUrl?: string
    skelUrl?: string
  } = {}

  if (files.atlas) {
    const atlasPromise = axios.get(REPO_URL + files.atlas, {
      responseType: "arraybuffer",
    })
    filePromises.push(atlasPromise)
  }

  if (files.png) {
    const pngPromise = axios.get(REPO_URL + files.png, {
      responseType: "arraybuffer",
    })
    filePromises.push(pngPromise)
  }

  if (files.skel) {
    const skelPromise = axios.get(REPO_URL + files.skel, {
      responseType: "arraybuffer",
    })
    filePromises.push(skelPromise)
  }

  const responses = await Promise.all(filePromises)
  responses.forEach((response, index) => {
    const mimeType = response.headers["content-type"]
    const buffer = Buffer.from(response.data, "binary")
    const dataURL = `data:${mimeType};base64,${buffer.toString("base64")}`
    if (index === 0) {
      fetchedFiles.atlasUrl = dataURL
    } else if (index === 1) {
      fetchedFiles.imageUrl = dataURL
    } else if (index === 2) {
      fetchedFiles.skelUrl = `${dataURL}.skel`
    }
  })

  return fetchedFiles
}
