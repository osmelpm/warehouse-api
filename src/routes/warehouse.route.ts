import { Router } from 'express'
import { check } from 'express-validator'
import {} from '../controllers/users.controller'
import {
  addProduct,
  createWarehouse,
  deleteWarehouse,
  editWarehouse,
  getAllWarehouse,
  getWarehouseById,
  viewProductStock,
  withdrawProduct,
} from '../controllers/warehouse.controller'
import { Models } from '../enums'
import { isValidData, idExist, validCategory } from '../helpers'
import { validateJWT, fieldValidator, isAdmin } from '../middlewares'

export const warehouseRouter = Router()

// GET ALL WAREHOUSE - PRIVATE --ADMIN
warehouseRouter.get(
  '/',
  [validateJWT, isAdmin, fieldValidator],
  getAllWarehouse,
)

// GET WAREHOUSE BY ID - PRIVATE --ADMIN
warehouseRouter.get(
  '/:id',
  [
    validateJWT,
    isAdmin,
    check('id', 'The id is not valid!').isMongoId(),
    check('id').custom((id) => idExist(id, Models.Warehouse)),
    fieldValidator,
  ],
  getWarehouseById,
)

// CREATE WAREHOUSE -PRIVATE --ADMIN
warehouseRouter.post(
  '/',
  [
    validateJWT,
    isAdmin,
    check('name', 'The name is required').not().isEmpty(),
    check('name', 'The name already exist!').custom((name) =>
      isValidData(name, Models.Warehouse, 'name'),
    ),
    check('category', 'The category is required').not().isEmpty(),
    check('category', 'The category is not valid').custom(validCategory),
    fieldValidator,
  ],
  createWarehouse,
)

// UPDATE WAREHOUSE -PRIVATE --ADMIN
warehouseRouter.put(
  '/:id',
  [
    validateJWT,
    isAdmin,
    check('id', 'The id is not valid!').isMongoId(),
    check('id').custom((id) => idExist(id, Models.Warehouse)),
    fieldValidator,
  ],
  editWarehouse,
)

// DELETE WAREHOUSE -PRIVATE --ADMIN
warehouseRouter.delete(
  '/:id',
  [
    validateJWT,
    isAdmin,
    check('id', 'The id is not valid!').isMongoId(),
    check('id').custom((id) => idExist(id, Models.Warehouse)),
    fieldValidator,
  ],
  deleteWarehouse,
)

// ADD PRODUCT TO WAREHOUSE -PRIVATE --ADMIN
warehouseRouter.put(
  '/:id/add-product',
  [
    validateJWT,
    isAdmin,
    check('id', 'The id is not valid!').isMongoId(),
    check('id').custom((id) => idExist(id, Models.Warehouse)),
    check('product', 'The product is required').not().isEmpty(),
    check('product', 'The product is not valid!').isMongoId(),
    check('product').custom((product) => idExist(product, Models.Product)),
    check('quantity', 'The quantity is required').not().isEmpty(),
    check(
      'quantity',
      'The quantity have to be a number greater than one',
    ).isNumeric(),
    fieldValidator,
  ],
  addProduct,
)

// WITHDRAW PRODUCT TO WAREHOUSE -PRIVATE
warehouseRouter.put(
  '/:id/withdraw-product',
  [
    validateJWT,
    check('id', 'The id is not valid!').isMongoId(),
    check('id').custom((id) => idExist(id, Models.Warehouse)),
    check('product', 'The product is required').not().isEmpty(),
    check('product', 'The product is not valid!').isMongoId(),
    check('product').custom((product) => idExist(product, Models.Product)),
    check('quantity', 'The quantity is required').not().isEmpty(),
    check(
      'quantity',
      'The quantity have to be a number greater than one',
    ).isNumeric(),
    fieldValidator,
  ],
  withdrawProduct,
)

// VIEW PRODUCT STOCK -PRIVATE
warehouseRouter.get(
  '/:whId/view-product/:itemId',
  [
    validateJWT,
    check('whId', 'The warehouse ID is not valid!').isMongoId(),
    check('whId', "Wharehouse doesn't exist").custom((id) =>
      idExist(id, Models.Warehouse),
    ),
    check('itemId', 'The Item Id is not valid!').isMongoId(),
    fieldValidator,
  ],
  viewProductStock,
)
