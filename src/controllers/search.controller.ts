import { Request, Response } from 'express'
import { isValidObjectId } from 'mongoose'
import { Warehouse, Product, User } from '../models'
import { UserSchema, WarehouseSchema, ProductSchema } from '../types'

const searchProduct = async (term: string) => {
  let result
  const isMongoId = isValidObjectId(term)

  try {
    if (isMongoId) {
      const product = await Product.findById(term)
      result = product ? [product] : []
    } else {
      const regex = new RegExp(term, 'i')
      result = await Product.find({ name: regex, isDeleted: false })
    }

    return {
      total: result.length,
      result,
    }
  } catch (error) {
    console.log(error)
    return []
  }
}

const searchUser = async (term: string) => {
  let result
  const isMongoId = isValidObjectId(term)

  try {
    if (isMongoId) {
      const user = await User.findById(term)

      result = user ? [user] : []
    } else {
      const regex = new RegExp(term, 'i')

      result = await User.find({
        $or: [{ name: regex }, { email: regex }, { role: regex }],
        $and: [{ isDeleted: false }],
      })
    }

    return {
      total: result.length,
      result,
    }
  } catch (error) {
    console.log(error)
    return []
  }
}

const searchWarehouse = async (term: string) => {
  let result
  const isMongoId = isValidObjectId(term)

  try {
    if (isMongoId) {
      const warehouse = await Warehouse.findById(term)
        .populate('items.product', ['name', 'desc', 'price'])
        .populate('items.user', 'name')

      result = warehouse ? [warehouse] : []
    } else {
      const regex = new RegExp(term, 'i')

      result = await Warehouse.find({
        $or: [{ name: regex }],
        $and: [{ isDeleted: false }],
      })
        .populate('items.product', ['name', 'desc', 'price'])
        .populate('items.user', 'name')
    }

    return {
      total: result.length,
      result,
    }
  } catch (error) {
    console.log(error)
    return []
  }
}

const collections = ['products', 'warehouses', 'users']

export const search = async (req: Request, res: Response) => {
  const { collection, term } = req.params
  let result = []

  if (!collections.includes(collection)) {
    return res.status(400).json({
      msg: `These are the available collections: ${collections}`,
    })
  }

  try {
    switch (collection) {
      case 'products':
        result = (await searchProduct(term)) as ProductSchema[]
        break

      case 'users':
        result = (await searchUser(term)) as UserSchema[]
        break

      case 'warehouses':
        result = (await searchWarehouse(term)) as WarehouseSchema[]
        break

      default:
        return res.status(400).json({
          msg: `The search don't support the collection: ${collection}`,
        })
    }

    res.json(result)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Internal Server Error',
    })
  }
}
