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
      required: true,
      default: 0.0,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    user: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: 'User',
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
