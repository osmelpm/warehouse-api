import { Schema, Types } from 'mongoose'
import { CATEGORIES } from '../enums/categories.enum'

interface Items {
  id?: Types.ObjectId
  product: Schema.Types.ObjectId
  stock: number
  user: Schema.Types.ObjectId
}

export interface WarehouseInterface {
  id: Schema.Types.ObjectId
  name: string
  category: CATEGORIES
  desc?: string
  items?: Array<Items>
  isDeleted: boolean
  save?: () => Promise<void>
}
