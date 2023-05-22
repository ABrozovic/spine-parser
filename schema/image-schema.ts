import type { CommonMimeType } from "@/utils/mime-types"
import { verifyMimeType, verifySize } from "@/utils/schema-utils"
import { z } from "zod"

const MB_BYTES = 1000000
const maxFileSizePerFileInMB = 1
const acceptedMimeTypes: CommonMimeType[] = ["image/jpeg", "image/png"]
const maxNumberOfFiles = 1
const maxFileSizePerItem = maxFileSizePerFileInMB * MB_BYTES

export const imageSchema = z
  .array(z.any())
  .max(maxNumberOfFiles, {
    message: `You can only add up to ${maxNumberOfFiles} files`,
  })
  .superRefine((f, ctx) => {
    for (let i = 0; i < f.length; i += 1) {
      const { file } = f[i]
      verifyMimeType(file, ctx, i, acceptedMimeTypes)
      verifySize(file, ctx, i, maxFileSizePerItem)
    }
  })
