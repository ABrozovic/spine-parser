import { useState } from "react"
import { z } from "zod"

export type FileWithId = {
  id: string
  file: File & { readonly path?: string }
}

type FileInputProps = {
  onFilesChanged: (files: FileWithId[]) => void
  onError: (err: string) => void
  defaultFiles?: FileWithId[]
  validator?: <T extends FileWithId[]>(file: T) => FileWithId[]
}

const useFileInput = ({
  onFilesChanged,
  onError,
  defaultFiles = [],
  validator,
}: FileInputProps) => {
  const [files, setFiles] = useState<FileWithId[]>(defaultFiles)

  const reset = () => {
    setFiles(defaultFiles)
  }

  const handleDrop = (acceptedFiles: File[]) => {
    onError("")
    const newFilesWithIds = acceptedFiles
      .map((file) => {
        const id = `${file.name}-${file.lastModified}-${file.size}`
        return { id, file }
      })
      .filter(({ id }) => !files.map(({ id: mId }) => mId).includes(id))

    if (newFilesWithIds.length > 0) {
      try {
        const validatedFiles = validator
          ? validator(newFilesWithIds.concat(files))
          : newFilesWithIds.concat(files)
        setFiles(validatedFiles as FileWithId[])
        onFilesChanged(validatedFiles)
      } catch (err) {
        if (err instanceof z.ZodError) {
          if (err.issues[0]) {
            onError(err.issues.map((issue) => issue.message).join("\n"))
          } else if (err.message) {
            onError(err.message)
          }
        }
      }
    }
  }
  const handleRemove = (index: number) => {
    setFiles((prev) => {
      const files = prev.filter((_, i) => i !== index)
      onFilesChanged(files)
      return files
    })
  }

  return { files, handleDrop, onError, handleRemove, reset }
}
export default useFileInput
