import 'dotenv/config'
import express, { Application } from 'express'
import cors from 'cors'
import { dbConnection } from '../db/config.db'
import userRouter from '../routes/users.route'

export class Server {
  private app: Application
  private port: string
  private env: string
  private paths = {
    users: '/api/v1/users',
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
  }

  async connectDB() {
    await dbConnection(this.env)
  }

  routes() {
    this.app.use(this.paths.users, userRouter)
  }

  listen() {
    this.app.listen(this.port, () =>
      console.log('Server running in port:', this.port),
    )
  }
}
