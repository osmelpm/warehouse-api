import { Router } from 'express'
import { check } from 'express-validator'
import { uploadImg } from '../controllers/uploads.controller'
import { validateCollection } from '../helpers'
import { fieldValidator, validateJWT, validateUpload } from '../middlewares'

export const uploadRouter = Router()

uploadRouter.put(
  '/:collection/:id',
  [
    validateJWT,
    check('id', 'Not is a mongo ID').isMongoId(),
    check('collection').custom((c) =>
      validateCollection(c, ['users', 'products']),
    ),
    validateUpload,
    fieldValidator,
  ],
  uploadImg,
)
