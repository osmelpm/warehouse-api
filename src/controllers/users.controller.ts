import { Request, Response } from 'express'
import { genSaltSync, hashSync } from 'bcrypt'
import { User } from '../models'
import usersSeed from '../seeds/users.seed'

export const getAllUsers = async (req: Request, res: Response) => {
  const { limit = 5, next = 1 } = req.query
  const query = { isDeleted: false }

  try {
    const [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query)
        .limit(Number(limit))
        .skip((Number(next) - 1) * Number(limit)),
    ])

    res.json({
      total,
      users,
    })
  } catch (error) {
    res.json({
      error: 'Internal Server Error',
    })
  }
}

export const getUserById = async (req: Request, res: Response) => {
  const id = req.params.id

  try {
    const user = await User.findById(id)

    res.json({
      user,
    })
  } catch (error) {
    res.json({
      error: 'Internal Server Error',
    })
  }
}

export const createUser = async (req: Request, res: Response) => {
  const { name, email, img, password, role } = req.body

  const user = new User({
    name,
    email,
    img,
    password,
    role,
  })

  if (password) {
    const salt = genSaltSync()
    user.password = hashSync(password, salt)
  }

  try {
    await user.save()

    res.status(201).json({
      user,
    })
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
    })
  }
}

export const editUser = async (req: Request, res: Response) => {
  const id = req.params.id
  let { _id, google, password, ...body } = req.body

  if (body.name) {
    const invalidUser = await User.findOne({ name: body.name })
    if (invalidUser) {
      return res.status(400).json({
        error: `The username ${body.name} already exist!`,
      })
    }
  }

  if (body.role) {
    const roles = ['buyer', 'admin']
    const validRole = roles.includes(body.role)

    if (!validRole) {
      return res.status(400).json({
        error: `The role: ${body.role} is not valid!`,
      })
    }
  }

  if (body.email) {
    const isInvalid = await User.findOne({ email: body.email })
    if (isInvalid) {
      return res.status(400).json({
        error: 'The email already exist!',
      })
    }
  }

  if (password) {
    const salt = genSaltSync()
    password = hashSync(password, salt)
  }

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { password, ...body },
      { new: true },
    )

    res.status(202).json({
      user,
    })
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
    })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    )

    res.status(202).json({
      user,
    })
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
    })
  }
}

export const importUsers = async (req: Request, res: Response) => {
  try {
    await User.remove({})
    const users = await User.insertMany(usersSeed)
    res.status(201).json({
      total: users.length,
      users,
    })
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
    })
  }
}
