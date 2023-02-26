import { Router } from 'express'
import { search } from '../controllers/search.controller'
import { isAdmin, validateJWT } from '../middlewares'

export const searchRouter = Router()

searchRouter.get('/:collection/:term', [validateJWT, isAdmin], search)
