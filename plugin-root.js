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
      required: ['BASE_URL', 'BOT_TOKEN'],
      properties: {
        BASE_URL: { type: 'string' },
        BOT_TOKEN: { type: 'string' }
      }
    }
  })
})
