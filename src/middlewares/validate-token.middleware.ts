import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models'
import { UserSchema } from '../types'
import { JwtPayload } from '../types'

export const validateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.header('x-token')

  if (!token) {
    return res.status(401).json({
      msg: 'No token in the request',
    })
  }

  try {
    const { uid } = jwt.verify(
      token,
      process.env.SECRET_KEY || '',
    ) as JwtPayload

    const user = (await User.findById(uid)) as UserSchema

    req.user = user

    next()
  } catch (error) {
    console.log(error)

    return res.status(403).json({
      msg: 'Invalid Token',
    })
  }
}
