/// <reference path="./global.d.ts" />
'use strict'

const fp = require('fastify-plugin')
const fastifyInvincible = require('fastify-invincible')

/** @param {import('fastify').FastifyInstance} app */
module.exports = fp(async function (app) {
  const pollingUrl = new URL(app.appConfig.PLT_BASE_URL)
  pollingUrl.pathname = '/monitoring'

  app.get(pollingUrl.pathname, (request, reply) => {
    reply.send('OK: ' + new Date().toISOString())
  })

  const env = app.appConfig.PLT_DEV_MODE ? 'dev' : 'prod'

  app.register(fastifyInvincible, {
    name: `telegram-bot-giveaway-${env}`,
    pollingUrl: pollingUrl.toString(),
    pollingIntervalSeconds: 1800, // 30 minutes
    betterstackOptions: {
      key: app.appConfig.PLT_BETTERSTACK_API_KEY
    }
  })
})
