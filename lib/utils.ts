import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getFileExtension = (filename: string): string => {
  const lastDotIndex = filename.lastIndexOf(".")
  if (lastDotIndex === -1) {
    return ""
  }

  const extension = filename.slice(lastDotIndex + 1)
  return extension
}
