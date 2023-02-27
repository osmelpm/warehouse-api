import { Router } from 'express'
import { serve, setup } from 'swagger-ui-express'
import { swaggerSpec } from '../docs/swagger.doc'

export const docsRouter = Router()

docsRouter.use('/', serve)
docsRouter.get('/', setup(swaggerSpec))
