import 'dotenv/config'
import express, { Application } from 'express'
import cors from 'cors'
import { dbConnection } from '../db/config.db'
import { userRouter, authRouter } from '../routes'
import { UserInterface } from '../types'

export class Server {
  private app: Application
  private port: string
  private env: string
  private paths = {
    users: '/api/v1/users',
    auth: '/api/v1/auth',
  }

  constructor() {
    this.app = express()
    this.port = process.env.PORT || '8000'
    this.env = this.app.get('env')

    this.connectDB()
    this.middlewares()
    this.routes()
  }

  middlewares() {
    this.app.use(cors())
    this.app.use(express.json())
    this.app.use(express.static('public'))
  }

  async connectDB() {
    await dbConnection(this.env)
  }

  routes() {
    this.app.use(this.paths.users, userRouter)
    this.app.use(this.paths.auth, authRouter)
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
      user?: UserInterface
    }
  }
}
