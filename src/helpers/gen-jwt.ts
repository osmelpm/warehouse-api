import jwt from 'jsonwebtoken'
import { MongoID } from '../types'

export const genJWT = (uid: MongoID) => {
  return new Promise((resolve, reject) => {
    if (!uid) resolve('No uid present')

    const payload = { uid }

    jwt.sign(
      payload,
      process.env.SECRET_KEY || '',
      {
        expiresIn: '4h',
      },
      (err, token) => {
        if (err) {
          reject('Some error avoid the jwt generation')
        } else resolve(token)
      },
    )
  })
}
