import { Router } from 'express'
import { check } from 'express-validator'
import {
  createUser,
  deleteUser,
  editUser,
  getAllUsers,
  getUserById,
  importUsers,
} from '../controllers/users.controller'
import { Models } from '../enums'
import { isValidData, idExist, validRole } from '../helpers'
import { validateJWT, fieldValidator, isAdmin } from '../middlewares'

export const userRouter = Router()

// GET ALL USERS - PRIVATE --ADMIN
userRouter.get('/', [validateJWT, isAdmin, fieldValidator], getAllUsers)

// GET USER BY ID - PRIVATE --ADMIN
userRouter.get(
  '/:id',
  [
    validateJWT,
    isAdmin,
    check('id', 'The id is not valid!').isMongoId(),
    check('id').custom((id) => idExist(id, Models.User)),
    fieldValidator,
  ],
  getUserById,
)

// CREATE USER -PRIVATE --ADMIN
userRouter.post(
  '/',
  [
    validateJWT,
    isAdmin,
    check('name', 'The username is required').not().isEmpty(),
    check('name', 'The username already exist!').custom((user) =>
      isValidData(user, Models.User, 'name'),
    ),
    check('email', 'The email is required').not().isEmpty(),
    check('email', 'The email is not valid!').isEmail(),
    check('email', 'The email is already registered!').custom((email) =>
      isValidData(email, Models.User, 'email'),
    ),
    check('password', 'The pasword is required').not().isEmpty(),
    check('password', 'The password have to more than 8 characters').isLength({
      min: 8,
    }),
    check('role', "The role doesn't exist").custom(validRole),
    fieldValidator,
  ],
  createUser,
)

// UPDATE USER -PRIVATE --ADMIN
userRouter.put(
  '/:id',
  [
    validateJWT,
    isAdmin,
    check('id', 'The id is not valid!').isMongoId(),
    check('id').custom((id) => idExist(id, Models.User)),
    fieldValidator,
  ],
  editUser,
)

// DELETE USER -PRIVATE --ADMIN
userRouter.delete(
  '/:id',
  [
    validateJWT,
    isAdmin,
    check('id', 'The id is not valid!').isMongoId(),
    check('id').custom((id) => idExist(id, Models.User)),
    fieldValidator,
  ],
  deleteUser,
)
// IMPORT USERS FROM SEED
userRouter.post('/import-data', importUsers)
