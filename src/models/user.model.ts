import { model, Schema } from 'mongoose'

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    img: String,
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'buyer',
      enum: ['buyer', 'admin'],
    },
    google: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

UserSchema.methods.toJSON = function () {
  const { __v, _id, isDeleted, password, ...user } = this.toObject()
  user.uid = _id
  return user
}

export const User = model('User', UserSchema)
