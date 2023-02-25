import { Request, Response } from 'express'
import { compareSync } from 'bcrypt'
import { User } from '../models'
import { genJWT, verifyGoogle } from '../helpers'
import { UserInterface } from '../types'

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const user = (await User.findOne({ email })) as UserInterface

    const validate = user ? compareSync(password, user.password) : false

    if (!validate) {
      return res.status(403).json({
        msg: 'User or password incorrect!',
      })
    }

    if (user) {
      const token = (await genJWT(user.id)) as string

      res.setHeader('x-token', token).json({
        user,
      })
    }
  } catch (error) {
    console.log(error)

    res.status(500).json({
      msg: 'Internal error',
    })
  }
}

export const googleSignIn = async (req: Request, res: Response) => {
  const { id_token } = req.body

  try {
    const { email, name, picture } = await verifyGoogle(id_token)

    let user = await User.findOne({ email })

    if (!user) {
      const userInfo = {
        name,
        email,
        img: picture,
        password: ':p',
        google: true,
      }
      user = new User(userInfo)
      await user.save()
    }

    if (user.isDeleted) {
      return res.status(401).json({
        msg: 'User has been blocked, contact to the administrator',
      })
    }

    if (!user.google) {
      user = await User.findByIdAndUpdate(user.id, { google: true })
    }
    if (user) {
      const token = (await genJWT(user.id)) as string

      res.setHeader('x-token', token).json({
        user,
      })
    }
  } catch (error) {
    console.log(error)

    res.status(401).json({
      msg: 'Invalid Token',
    })
  }
}
