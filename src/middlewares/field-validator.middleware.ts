import { validationResult } from 'express-validator'
import { Request, Response } from 'express'

export const fieldValidator = (
  req: Request,
  res: Response,
  next: () => void,
) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json(errors)
  }

  next()
}
