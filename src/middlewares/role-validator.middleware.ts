import { Request, Response, NextFunction } from 'express'
import { UserSchema } from '../types'

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { role } = req.user as UserSchema

  if (role !== 'admin') {
    return res.status(403).json({
      msg: 'This user is not Admin',
    })
  }

  next()
}
