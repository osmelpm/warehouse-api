import 'dotenv/config'
import { describe, expect, it, beforeAll } from '@jest/globals'

import { dbConnection } from '../db/config.db'
import { Models } from '../enums'

import {
  idExist,
  isUserAvailable,
  isValidData,
  validCategory,
  validRole,
} from './db-validators'
import { CustomError, ProductSchema } from '../types'
import mongoose, { ObjectId } from 'mongoose'
import { Product } from '../models'

let products: ProductSchema[]

beforeAll(async () => {
  const env = process.env.env
  await dbConnection(env || 'development')
  products = await Product.find()
})

afterAll(async () => {
  return await mongoose.disconnect()
})

describe('DB Validators Suite', () => {
  describe('isValidData: Check unique property by collection', () => {
    it('When property value allready exists, throw an error exception', async () => {
      let executionResult

      try {
        await isValidData('window 170x70', Models.Product, 'name')
      } catch (error) {
        const { message } = error as CustomError
        executionResult = message
      }

      expect(executionResult).toBe('The name: window 170x70 already exist!')
    }, 5000)

    it("When property doesn't exist, does not have return (undefined)", async () => {
      let executionResult

      try {
        await isValidData('anything', Models.Product, 'name')
      } catch (error) {
        const { message } = error as CustomError
        executionResult = message
      }

      expect(executionResult).toBeUndefined()
    }, 5000)
  })

  describe('idExist: Check existing ids by collections', () => {
    it('When id exists, does not have return (undefined)', async () => {
      let executionResult
      let productID = products[0].id as ObjectId

      try {
        await idExist(productID, Models.Product)
      } catch (error) {
        const { message } = error as CustomError
        executionResult = message
      }

      expect(executionResult).toBeUndefined()
    }, 5000)

    it("When id doesn't exist, throw an error exception", async () => {
      let executionResult
      let wrongID = ('63fa6aee1cd769a6b00953a5' as unknown) as ObjectId

      try {
        await idExist(wrongID, Models.Product)
      } catch (error) {
        const { message } = error as CustomError
        executionResult = message
      }

      expect(executionResult).toBe("ID: 63fa6aee1cd769a6b00953a5 doesn't exist")
    }, 5000)
  })

  describe('validCategory: Check if category is valid', () => {
    it('When category is valid, does not have return (undefined)', async () => {
      let executionResult

      try {
        await validCategory('hardware')
      } catch (error) {
        const { message } = error as CustomError
        executionResult = message
      }

      expect(executionResult).toBeUndefined()
    }, 5000)

    it('When category is not valid, throw an error exception', async () => {
      let executionResult

      try {
        await validCategory('anything')
      } catch (error) {
        const { message } = error as CustomError
        executionResult = message
      }

      expect(executionResult).toBe('The category: anything is not valid!')
    }, 5000)
  })

  describe('validRole: Check if the role is valid', () => {
    it('When the role is valid, does not have return (undefined)', async () => {
      let executionResult

      try {
        await validRole('admin')
      } catch (error) {
        const { message } = error as CustomError
        executionResult = message
      }

      expect(executionResult).toBeUndefined()
    }, 5000)

    it('When the role is not valid, throw an error exception', async () => {
      let executionResult

      try {
        await validRole('anything')
      } catch (error) {
        const { message } = error as CustomError
        executionResult = message
      }

      expect(executionResult).toBe('The role: anything is not valid!')
    }, 5000)
  })

  describe('isUserAvailable: Check if the user is available', () => {
    it('When the user is available, does not have return (undefined)', async () => {
      let executionResult

      try {
        await isUserAvailable('useradmin@gmail.com')
      } catch (error) {
        const { message } = error as CustomError
        executionResult = message
      }

      expect(executionResult).toBeUndefined()
    }, 5000)

    it('When the user is not available, throw an error exception', async () => {
      let executionResult

      try {
        await isUserAvailable('anything@gmail.com')
      } catch (error) {
        const { message } = error as CustomError
        executionResult = message
      }

      expect(executionResult).toBe('User unavailable!')
    }, 5000)
  })
})
