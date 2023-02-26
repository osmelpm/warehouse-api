import { Request, Response } from 'express'
import { Types } from 'mongoose'
import { Warehouse } from '../models'
import { Product, UserInterface, WarehouseInterface } from '../types'
import { ProductView } from '../types'

export const getAllWarehouse = async (req: Request, res: Response) => {
  const { limit = 5, page = 1 } = req.query
  const query = { isDeleted: false }

  try {
    const [total, warehouses] = await Promise.all([
      Warehouse.countDocuments(query),
      Warehouse.find(query)
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit))
        .populate('items.product', ['name', 'desc', 'price'])
        .populate('items.user', 'name'),
    ])

    res.json({
      total,
      warehouses,
    })
  } catch (error) {
    console.log(error)

    res.json({
      error: 'Internal Server Error',
    })
  }
}

export const getWarehouseById = async (req: Request, res: Response) => {
  const id = req.params.id

  try {
    const warehouse = await Warehouse.findById(id)
      .populate('items.product', ['name', 'desc', 'price'])
      .populate('items.user', 'name')

    res.json({
      warehouse,
    })
  } catch (error) {
    res.json({
      error: 'Internal Server Error',
    })
  }
}

export const createWarehouse = async (req: Request, res: Response) => {
  const { isDeleted, items, ...newWarehouse } = req.body

  const warehouse = new Warehouse({
    ...newWarehouse,
  })

  try {
    await warehouse.save()

    res.status(201).json({
      warehouse,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: 'Internal Server Error',
    })
  }
}

export const editWarehouse = async (req: Request, res: Response) => {
  const id = req.params.id
  let { _id, isDeleted, ...body } = req.body

  if (body.name) {
    const invalidName = await Warehouse.findOne({ name: body.name })
      .populate('items.product', ['name', 'desc', 'price'])
      .populate('items.user', 'name')

    if (invalidName) {
      return res.status(400).json({
        error: `The name ${body.name} already exist!`,
      })
    }
  }

  if (body.category) {
    const categories = ['hardware', 'electronics']
    const validCategory = categories.includes(body.category)

    if (!validCategory) {
      return res.status(400).json({
        error: 'The category is not valid!',
      })
    }
  }

  try {
    const warehouse = await Warehouse.findByIdAndUpdate(
      id,
      { ...body },
      { new: true },
    )
    //.populate('role', 'role')

    res.status(202).json({
      warehouse,
    })
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
    })
  }
}

export const deleteWarehouse = async (req: Request, res: Response) => {
  const id = req.params.id

  try {
    const warehouse = await Warehouse.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    )
      .populate('items.product', ['name', 'desc', 'price'])
      .populate('items.user', 'name')

    res.status(202).json({
      warehouse,
    })
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
    })
  }
}

export const addProduct = async (req: Request, res: Response) => {
  const id = req.params.id
  let { _id, isDeleted, product, quantity } = req.body
  const user = req.user as UserInterface

  try {
    const wharehouseTarget = (await Warehouse.findById(
      id,
    )) as WarehouseInterface
    const { items } = wharehouseTarget

    if (items) {
      const itemIdx = items.findIndex((item) => item.product == product)

      if (itemIdx !== -1) {
        const modify = {
          product,
          stock: items[itemIdx].stock + quantity,
          user: user.id,
        }
        items[itemIdx] = {
          ...items[itemIdx],
          ...modify,
        }
      } else {
        const add = {
          product,
          stock: quantity,
          user: user.id,
        }

        items.push({
          ...add,
        })
      }
    }

    const warehouse = await Warehouse.findByIdAndUpdate(
      id,
      { items },
      { new: true },
    )
      .populate('items.product', ['name', 'desc', 'price'])
      .populate('items.user', 'name')

    res.status(202).json({
      warehouse,
    })
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
    })
  }
}

export const withdrawProduct = async (req: Request, res: Response) => {
  const id = req.params.id
  let itemIdx
  let { _id, isDeleted, product, quantity } = req.body
  const user = req.user as UserInterface

  try {
    const wharehouseTarget = (await Warehouse.findById(
      id,
    )) as WarehouseInterface
    let { items } = wharehouseTarget

    if (items) {
      itemIdx = items.findIndex((item) => item.product == product)

      if (
        itemIdx !== -1 &&
        items[itemIdx] &&
        items[itemIdx].stock >= quantity
      ) {
        items[itemIdx] = {
          product,
          stock: items[itemIdx].stock - quantity,
          user: user.id,
        }

        items = items.filter((item) => item.stock !== 0)
      } else {
        const message =
          items.length && items[itemIdx]
            ? `The amount required is greater than the stock: ${items[itemIdx].stock}!`
            : 'Product is not stored'

        return res.status(400).json({
          error: message,
        })
      }
    }

    let warehouse = await Warehouse.findByIdAndUpdate(
      id,
      { items },
      { new: true },
    )
      .populate('items.product', ['name', 'desc', 'price'])
      .populate('items.user', 'name')

    if (user.role === 'buyer') {
      const productModify =
        typeof itemIdx !== 'undefined' && itemIdx !== -1
          ? warehouse?.items[itemIdx]
          : null
      ;(productModify as unknown) as Product

      return res.status(202).json({
        product: productModify?.product,
        stock: productModify?.stock,
      })
    }

    res.status(202).json({
      warehouse,
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      error: 'Internal Server Error',
    })
  }
}

export const viewProductStock = async (req: Request, res: Response) => {
  const { whId, itemId } = req.params
  let productID = new Types.ObjectId(itemId)

  try {
    const warehouse = (await Warehouse.findById(whId)) as WarehouseInterface
    //.populate('role', 'role')

    const items = warehouse?.items || []
    if (items.length) {
      const item = items.find((item) => item.id == productID) as ProductView

      if (item) {
        const { product, stock } = item

        return res.json({
          product,
          stock,
        })
      }

      res.status(404).json({
        error: 'Product is not stored',
      })
    }
  } catch (error) {
    console.log(error)

    res.json({
      error: 'Internal Server Error',
    })
  }
}
