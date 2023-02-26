import { UploadedFile } from 'express-fileupload'

export interface File extends UploadedFile {
  name: string
  tempFilePath: string
}