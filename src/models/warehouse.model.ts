import { model, Schema } from 'mongoose'

const WarehouseSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    category: {
      type: String,
      require: true,
      enum: ['hardware', 'electronics'],
    },
    desc: String,
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          require: true,
          ref: 'Product',
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
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

WarehouseSchema.methods.toJSON = function () {
  const { __v, isDeleted, ...warehouse } = this.toObject()
  return warehouse
}

export const Warehouse = model('Warehouse', WarehouseSchema)
