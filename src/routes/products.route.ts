import { Router } from 'express'
import { check } from 'express-validator'
import {
  createProduct,
  deleteProduct,
  editProduct,
  getAllProducts,
  getProductById,
  importProducts,
} from '../controllers/products.controler'
import { Models } from '../enums'
import { idExist } from '../helpers'
import { fieldValidator, isAdmin, validateJWT } from '../middlewares'

export const productRouter = Router()

// GET ALL PRODUCTS - PRIVATE --ADMIN
productRouter.get('/', [validateJWT, isAdmin, fieldValidator], getAllProducts)

// GET PRODUCT BY ID - PRIVATE
productRouter.get(
  '/:id',
  [
    validateJWT,
    check('id').isMongoId(),
    check('id').custom((id) => idExist(id, Models.Product)),
    fieldValidator,
  ],
  getProductById,
)

// CREATE PRODUCT -PRIVATE --ADMIN
productRouter.post(
  '/',
  [
    validateJWT,
    isAdmin,
    check('name', 'The product name is required').not().isEmpty(),
    check('desc', 'Description is required').not().isEmpty(),
    check('price', 'The price is required').not().isEmpty(),
    check('price', 'The price have to be a number').isFloat({ min: 0 }),
    fieldValidator,
  ],
  createProduct,
)

// UPDATE PRODUCT -PRIVATE --ADMIN
productRouter.put(
  '/:id',
  [
    validateJWT,
    isAdmin,
    check('id').isMongoId(),
    check('id').custom((id) => idExist(id, Models.Product)),
    fieldValidator,
  ],
  editProduct,
)

//DELETE PRODUCT -PRIVATE --ADMIN
productRouter.delete(
  '/:id',
  [
    validateJWT,
    isAdmin,
    check('id').isMongoId(),
    check('id').custom((id) => idExist(id, Models.Product)),
    fieldValidator,
  ],
  deleteProduct,
)

// IMPORT PRODUCTS FROM SEED
productRouter.post('/import-data', importProducts)
