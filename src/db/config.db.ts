import 'dotenv/config'
import mongoose from 'mongoose'

export const dbConnection = async (env: string) => {
  let conn_string

  switch (env) {
    case 'development':
      conn_string = process.env.MONGO_DB_DEV
      break
    case 'production':
      conn_string = process.env.MONGO_DB_PDT
      break
  }

  try {
    mongoose.set('strictQuery', false)
    await mongoose.connect(conn_string as string)
    console.log('Success connection')
  } catch (error) {
    console.log('Bad connection')
    throw new Error(error as string)
  }
}
