import { Router } from 'express'
import { check } from 'express-validator'
import { googleSignIn, login } from '../controllers/auth.controller'
import { isUserAvailable } from '../helpers'
import { fieldValidator } from '../middlewares'

export const authRouter = Router()

authRouter.post(
  '/login',
  [
    check('email', 'The email is required!').not().isEmpty(),
    check('password', 'The password is required!').not().isEmpty(),
    check('email').custom(isUserAvailable),
    fieldValidator,
  ],
  login,
)

authRouter.post(
  '/google',
  [check('id_token', 'Token is required!').not().isEmpty(), fieldValidator],
  googleSignIn,
)
