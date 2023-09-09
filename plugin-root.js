/// <reference path="./global.d.ts" />
'use strict'

const fp = require('fastify-plugin')
const fastifyEnv = require('@fastify/env')

/** @param {import('fastify').FastifyInstance} app */
module.exports = fp(async function (app) {
  app.register(fastifyEnv, {
    confKey: 'appConfig',
    dotenv: true,
    schema: {
      type: 'object',
      required: ['PLT_BASE_URL', 'PLT_BOT_TOKEN', 'PLT_JWT_SECRET', 'PLT_BETTERSTACK_API_KEY'],
      properties: {
        PLT_BASE_URL: { type: 'string' },
        PLT_BOT_TOKEN: { type: 'string' },
        PLT_JWT_SECRET: { type: 'string' },
        PLT_BETTERSTACK_API_KEY: { type: 'string' }
      }
    }
  })
})
