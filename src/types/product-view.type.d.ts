import { Schema } from 'mongoose'
export interface ProductView {
  product: Schema.Types.ObjectId
  stock: number
}

type product = {
  name: string
  desc: string
  price: number
  _id: Schema.Types.ObjectId
}

export interface Product {
  product: product
  stock: number
}
