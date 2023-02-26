import { Request, Response } from 'express'
import { v2 as cloudinary } from 'cloudinary'
cloudinary.config(process.env.CLOUDINARY_URL as string)
import { loadFile } from '../helpers'
import { Product, User } from '../models'
import { CustomError, File } from '../types'

export const uploadImg = async (req: Request, res: Response) => {
  const { id, collection } = req.params
  const file = req.files?.file as File
  console.log(id, collection)

  let model

  switch (collection) {
    case 'products':
      model = await Product.findById(id)
      break

    case 'users':
      model = await User.findById(id)
      break

    default:
      return res.status(400).json({
        msg: `Request to collection: ${collection} isn't implemented yet`,
      })
  }

  if (!model) {
    return res.status(400).json({
      msg: `Resource with id ${id} not found in ${collection}`,
    })
  }

  if (model.img) {
    const urlArray = model.img.split('/')
    const img = urlArray[urlArray.length - 1]
    const [public_id] = img.split('.')
    cloudinary.uploader.destroy(`warehouse/uploads/${collection}/${public_id}`)
  }

  try {
    const validExtensions = ['jpg', 'jpeg', 'png']
    if (file) {
      model.img = await loadFile(file, validExtensions, collection)
    }
    await model.save()
  } catch (error) {
    if (error) {
      const { message } = error as CustomError
      return res.status(400).json({
        msg: message,
      })
    }
  }
  res.json(model)
}
