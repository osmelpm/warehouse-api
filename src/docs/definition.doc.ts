export const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Warehouse API',
    version: '1.0.0',
    description:
      'This is a REST API application made with Express. Its a wharehouse manager, allows to create products, users, and warehouses. In the business logic exists two roles, admin and buyer roles. The admin can create, edit, retrieve and delete any of the collections, and he can add or withdraw products to or from any warehouse. In the other hands, a buyer only can retrive the data from a given product and withdraw the given product ',
    contact: {
      name: 'Osmel Pérez Milán',
      email: 'osmelpm95@gmail.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:8080/api/v1',
      description: 'Development Server',
    },
  ],
  tags: [
    {
      name: 'Authentication',
    },
    {
      name: 'Users',
    },
    {
      name: 'Products',
    },
    {
      name: 'Warehouses',
    },
    {
      name: 'Misc',
    },
  ],
  paths: {
    '/search/:collection/:term': {
      get: {
        tags: ['Misc'],
        summary: 'Search a wording from from a given collection',
        description:
          'Get the array of documents that match with the wording search. Authorized users: admin',
      },
    },
    '/uploads/:collection/:id': {
      put: {
        tags: ['Misc'],
        summary: 'Set product or user img',
        description:
          'Upload an image to cloudinary for a given user o product document',
      },
    },
    '/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Login with some of the created users',
        description:
          'With success login obtain a token in the headers for access to allowed endpoints in base to the role and the datails of the user. Authorized users: registered users',
      },
    },
    '/auth/google': {
      post: {
        tags: ['Authentication'],
        summary: 'Login with google sign in',
        description:
          'With success login obtain a token and register the user if doesnt exist. Authorized users: all users',
      },
    },
    '/users/import-data': {
      post: {
        tags: ['Users'],
        summary: 'Import users form seed',
        description:
          'Do an multi insert of user mock documents into the user collection. Not need authorization',
      },
    },
    '/users/': {
      get: {
        tags: ['Users'],
        summary: 'Retrieve all users',
        description:
          'Rerieve a list of all active users from database. Authorized users: admin users',
      },
    },
    '/users/:id': {
      get: {
        tags: ['Users'],
        summary: 'Retrieve an user by id',
        description: 'Retrieve an user by id. Authorized users: admin users',
      },
    },
    '/users': {
      post: {
        tags: ['Users'],
        summary: 'Create user',
        description:
          'Create a new user in the database. Authorized users: admin users',
      },
    },
    '/users/:id/': {
      put: {
        tags: ['Users'],
        summary: 'Update user by id',
        description:
          'Update the user given an id. Authorized users: admin users',
      },
    },
    '/users/:ID': {
      delete: {
        tags: ['Users'],
        summary: 'Delete user by id',
        description:
          'Change the property isDeleted to true to simulate a deletion without destroy the reference to deleted documents. Authorized users: admin users',
      },
    },
    '/products/import-data': {
      post: {
        tags: ['Products'],
        summary: 'Import products form seed',
        description:
          'Do an multi insert of products mock documents into the user collection. Not need authorization',
      },
    },
    '/products/': {
      get: {
        tags: ['Products'],
        summary: 'Retrieve all products',
        description:
          'Rerieve a list of all active products from database. Authorized users: admin users',
      },
    },
    '/products/:id': {
      get: {
        tags: ['Products'],
        summary: 'Retrieve a product by id',
        description:
          'Retrieve an product by id. Authorized users: admin and buyer users',
      },
    },
    '/products': {
      post: {
        tags: ['Products'],
        summary: 'Create product',
        description:
          'Create a new product in the database. Authorized users: admin users',
      },
    },
    '/products/:id/': {
      put: {
        tags: ['Products'],
        summary: 'Update product by id',
        description: 'Update the product given an id',
      },
    },
    '/products/:ID': {
      delete: {
        tags: ['Products'],
        summary: 'Delete product by id',
        description:
          'Change the property isDeleted to true to simulate a deletion without destroy the reference to deleted documents. Authorized users: admin users',
      },
    },
    '/warehouses/': {
      get: {
        tags: ['Warehouses'],
        summary: 'Retrieve all warehouses',
        description:
          'Rerieve a list of all active warehouses from database. Authorized users: admin users',
      },
    },
    '/warehouses/:id': {
      get: {
        tags: ['Warehouses'],
        summary: 'Retrieve a warehouse by id',
        description:
          'Retrieve an warehouse by id. Authorized users: admin users',
      },
    },
    '/warehouses': {
      post: {
        tags: ['Warehouses'],
        summary: 'Create warehouse',
        description:
          'Create a new warehouse in the database. Authorized users: admin users',
      },
    },
    '/warehouses/:id/': {
      put: {
        tags: ['Warehouses'],
        summary: 'Update warehouse by id',
        description:
          'Update the warehouse given an id. Authorized users: admin users',
      },
    },
    '/warehouses/:ID': {
      delete: {
        tags: ['Warehouses'],
        summary: 'Delete warehouse by id',
        description:
          'Change the property isDeleted to true to simulate a deletion without destroy the reference to deleted documents. Authorized users: admin users',
      },
    },
    '/warehouses/:id/add-product': {
      put: {
        tags: ['Warehouses'],
        summary: 'Add product to warehouse',
        description:
          'Increment the stock of a product of an existing product or add a new one to the warehouse. Authorized users: admin users',
      },
    },
    '/warehouses/:id/withdraw-product': {
      put: {
        tags: ['Warehouses'],
        summary: 'Withdraw product from warehouse',
        description:
          'Withdraw units of an existing product from the warehouse. Authorized users: admin and buyer users',
      },
    },
    '/warehouses/:whId/view-product/:itemId': {
      get: {
        tags: ['Warehouses'],
        summary: 'View product from warehouse',
        description:
          'Get the product view given a warehouse id and item id. Authorized users: admin and buyer users',
      },
    },
  },
  components: {
    schemas: {
      User: {
        required: ['name', 'email', 'password'],
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '63fa232d33808a5abfc26f18',
          },
          name: {
            type: 'string',
            example: 'theUser',
          },
          img: {
            type: 'string',
            example:
              'https://res.cloudinary.com/diytebt5p/image/upload/v1677474250/warehouse/uploads/users/b6wunzvunmbwukzmqkki.png',
          },
          email: {
            type: 'string',
            example: 'john@email.com',
          },
          password: {
            type: 'hash',
            example: 'iakdasdj312ee.afjajfoad',
          },
          role: {
            type: 'string',
            example: 'admin',
          },
          google: {
            type: 'boolean',
            example: false,
          },
          isDeleted: {
            type: 'boolean',
            example: false,
          },
        },
        xml: {
          name: 'user',
        },
      },
      Product: {
        type: 'object',
        required: ['name', 'desc', 'price'],
        properties: {
          id: {
            type: 'string',
            example: '63fa232d33808a5abfc26f18',
          },
          name: {
            type: 'string',
            example: 'the Product Name',
          },
          img: {
            type: 'string',
            example:
              'https://res.cloudinary.com/diytebt5p/image/upload/v1677474250/warehouse/uploads/products/b6wunzvunmbwukzmqkki.png',
          },
          desc: {
            type: 'string',
            example: 'Some description',
          },
          price: {
            type: 'number',
            example: 50,
          },
          isDeleted: {
            type: 'boolean',
            example: false,
          },
        },
        xml: {
          name: 'product',
        },
      },
      Warehouse: {
        type: 'object',
        required: ['name', 'category', 'price'],
        properties: {
          id: {
            type: 'string',
            example: '63fa232d33808a5abfc26f18',
          },
          name: {
            type: 'string',
            example: 'the Warehouse Name',
          },
          category: {
            type: 'string',
            example: 'hardware or electronics',
          },
          desc: {
            type: 'string',
            example: 'Some description',
          },
          items: {
            type: 'array',
            xml: {
              name: 'items',
              wrapped: true,
            },
            $ref: '#/components/schemas/Product',
          },
          isDeleted: {
            type: 'boolean',
            example: false,
          },
        },
      },
    },
  },
}
