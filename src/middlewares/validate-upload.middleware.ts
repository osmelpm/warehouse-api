import { Request, Response } from 'express'

export const validateUpload = (
  req: Request,
  res: Response,
  next: () => void,
) => {
  console.log(req.files)

  if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
    return res.status(400).json({
      msg: 'No files were uploaded.',
    })
  }

  next()
}
