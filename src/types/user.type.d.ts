import { Schema } from 'mongoose'
import { ROLES } from '../enums/roles.enum'

export interface UserSchema {
  id: Schema.Types.ObjectId
  name: string
  email: string
  img?: string
  password: string
  role: ROLES
  google: boolean
  isDeleted: boolean
  save?: () => Promise<void>
}
