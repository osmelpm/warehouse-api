import 'dotenv/config'
import express, { Application } from 'express'
import fileUpload from 'express-fileupload'
import cors from 'cors'
import { dbConnection } from '../db/config.db'
import {
  userRouter,
  authRouter,
  productRouter,
  warehouseRouter,
  searchRouter,
  uploadRouter,
  docsRouter,
} from '../routes'
import { UserSchema } from '../types'

export class Server {
  private app: Application
  private port: string
  private env: string
  private paths = {
    users: '/api/v1/users',
    auth: '/api/v1/auth',
    products: '/api/v1/products',
    warehouse: '/api/v1/warehouses',
    search: '/api/v1/search',
    uploads: '/api/v1/uploads',
    docs: '/api/v1/docs',
  }

  constructor() {
    this.app = express()
    this.port = process.env.PORT || '8080'
    this.env = this.app.get('env')

    this.connectDB()
    this.middlewares()
    this.routes()
  }

  middlewares() {
    this.app.use(cors())
    this.app.use(express.json())
    this.app.use(express.static('public'))
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp/',
      }),
    )
  }

  async connectDB() {
    await dbConnection(this.env)
  }

  routes() {
    this.app.use(this.paths.users, userRouter)
    this.app.use(this.paths.auth, authRouter)
    this.app.use(this.paths.products, productRouter)
    this.app.use(this.paths.warehouse, warehouseRouter)
    this.app.use(this.paths.search, searchRouter)
    this.app.use(this.paths.uploads, uploadRouter)
    this.app.use(this.paths.docs, docsRouter)
  }

  listen() {
    this.app.listen(this.port, () =>
      console.log('Server running in port:', this.port),
    )
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: UserSchema
      files?: fileUpload.FileArray | null
    }
  }
}
