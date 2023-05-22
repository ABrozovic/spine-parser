import { z } from "zod"

import type { CommonMimeType } from "./mime-types"

export function verifyMimeType(
  file: any,
  ctx: z.RefinementCtx,
  i: number,
  acceptedMimeTypes: CommonMimeType[] | string[]
) {
  if (!acceptedMimeTypes.includes(file?.type as CommonMimeType)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `${
        i > 1 ? `File at index ${i}` : `File `
      } must have a mime-type of: "${acceptedMimeTypes.join(", ")}" but was ${
        file?.type
      }`,
    })
  }
}

export function verifySize(
  file: any,
  ctx: z.RefinementCtx,
  i: number,
  maxFileSizePerItem: number
) {
  if (file && file.size > maxFileSizePerItem) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_big,
      type: "array",
      message: `The file at index ${i} must not be larger than ${maxFileSizePerItem} bytes: ${file.size}`,
      maximum: maxFileSizePerItem,
      inclusive: true,
    })
  }
}
