import swaggerJsdoc from 'swagger-jsdoc'
import { swaggerDefinition } from './definition.doc'

const options = {
  swaggerDefinition,
  apis: ['./routes/*.route.js'],
}

export const swaggerSpec = swaggerJsdoc(options)
