import { Request, Response } from 'express'
import { Product } from '../models'
import { productsSeed } from '../seeds'

export const getAllProducts = async (req: Request, res: Response) => {
  const { limit = 5, page = 1 } = req.query
  const query = { isDeleted: false }

  try {
    const [total, products] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query)
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit)),
    ])

    res.json({
      total,
      products,
    })
  } catch (error) {
    res.json({
      error: 'Internal Server Error',
    })
  }
}

export const getProductById = async (req: Request, res: Response) => {
  const id = req.params.id

  try {
    const product = await Product.findById(id)

    res.json({
      product,
    })
  } catch (error) {
    res.json({
      error: 'Internal Server Error',
    })
  }
}

export const createProduct = async (req: Request, res: Response) => {
  let { img, isDeleted, ...newProduct } = req.body

  const product = new Product({ ...newProduct })

  try {
    await product.save()

    res.status(201).json({
      product,
    })
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
    })
  }
}

export const editProduct = async (req: Request, res: Response) => {
  const id = req.params.id
  let { _id, isDeleted, img, ...prod } = req.body

  try {
    if (prod.price && prod.price < 0) {
      return res.status(400).json({
        msg: 'The price have to be greater than or equal to 0',
      })
    }

    if (prod.name) {
      const invalidName = await Product.findOne({ name: prod.name })
      if (invalidName) {
        return res.status(400).json({
          msg: 'The name already exist',
        })
      }
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { ...prod },
      { new: true },
    )

    res.status(202).json({
      product,
    })
  } catch (error) {
    res.json({
      error: 'Internal Server Error',
    })
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  const id = req.params.id
  const query = { isDeleted: true }

  try {
    const product = await Product.findByIdAndUpdate(id, query, { new: true })

    res.status(202).json({
      product,
    })
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
    })
  }
}

export const importProducts = async (req: Request, res: Response) => {
  try {
    await Product.remove({})
    console.log('aqui bien b')
    const products = await Product.insertMany(productsSeed)
    res.status(201).json({
      total: products.length,
      products,
    })
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
    })
  }
}
