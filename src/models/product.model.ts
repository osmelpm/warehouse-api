import { model, Schema } from 'mongoose'

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
    },
    desc: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
      default: 0.0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

ProductSchema.methods.toJSON = function () {
  const { __v, isDeleted, ...product } = this.toObject()
  return product
}

export const Product = model('Product', ProductSchema)
