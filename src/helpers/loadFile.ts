import { v2 as cloudinary } from 'cloudinary'
cloudinary.config(process.env.CLOUDINARY_URL || '')
import { File } from '../types'

export const loadFile = async (
  file: File,
  validExtensions: string[],
  collection: string,
) => {
  const [, extension] = file.name.split('.')

  if (!validExtensions.includes(extension)) {
    throw new Error(
      `The extension ${extension} isn't alowed. Allowed: ${validExtensions}`,
    )
  }

  const { tempFilePath } = file

  const { secure_url } = await cloudinary.uploader.upload(tempFilePath, {
    folder: `sales-report-api/uploads/${collection}/`,
  })

  return secure_url
}
