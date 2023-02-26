import { Models } from '../enums'
import { User, Product, Warehouse } from '../models'
import { MongoID } from '../types'

export const isValidData = async (
  value: string,
  model: Models,
  prop: string,
) => {
  let dataExist

  switch (model) {
    case Models.User:
      dataExist = await User.findOne({ [prop]: value })
      break
    case Models.Product:
      dataExist = await Product.findOne({ [prop]: value })
      break
    case Models.Warehouse:
      dataExist = await Warehouse.findOne({ [prop]: value })
      break
  }

  if (dataExist) {
    throw new Error(`The ${prop}: ${value} already exist!`)
  }
}

export const idExist = async (id: MongoID, model: Models) => {
  let idExist

  switch (model) {
    case Models.User:
      idExist = await User.findById(id)
      break
    case Models.Product:
      idExist = await Product.findById(id)
      break
    case Models.Warehouse:
      idExist = await Warehouse.findById(id)
      break
  }

  if (!idExist) {
    throw new Error(`ID: ${id} doesn't exist`)
  }
}

export const validCategory = async (category: string) => {
  const categories = ['hardware', 'electronics']
  const validCategory = categories.includes(category)

  if (!validCategory) {
    throw new Error(`The category: ${category} is not valid!`)
  }
}

export const validRole = async (role: string) => {
  const roles = ['buyer', 'admin']
  const validRole = roles.includes(role)

  if (!validRole) {
    throw new Error(`The role: ${role} is not valid!`)
  }
}

export const isUserAvailable = async (email: string) => {
  if (!email) throw new Error('Empty field!')

  const user = await User.findOne({ email, isDeleted: false })

  if (!user) {
    throw new Error('User unavailable!')
  }
}
