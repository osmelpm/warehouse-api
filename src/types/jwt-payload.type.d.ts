import { Schema } from 'mongoose'

export interface JwtPayload {
  uid: Schema.Types.ObjectId
}