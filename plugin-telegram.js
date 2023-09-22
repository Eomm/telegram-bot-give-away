/// <reference path="./global.d.ts" />
'use strict'

const i18nPlugin = require('./lib/plugin-i18n')
const buildGiveAwayBot = require('./lib/give-away-bot')

/** @param {import('fastify').FastifyInstance} app */
module.exports = async function (app) {
  app.register(i18nPlugin)

  const webhookDomain = app.appConfig.PLT_BASE_URL

  const bot = buildGiveAwayBot(app)

  // Long polling mode
  if (webhookDomain === 'POLLING') {
    app.log.info('Telegram long polling mode')
    bot.launch({ webhook: undefined })

    app.addHook('onClose', async function hook (app) {
      await bot.stop()
    })

    return
  }

  // Webhook mode
  const webhook = await bot.createWebhook({
    domain: webhookDomain,
    secret_token: app.appConfig.PLT_JWT_SECRET
  })

  const routePath = `/telegraf/${bot.secretPathComponent()}`
  app.log.info({ webhookRoutePath: routePath }, `Telegram webhook path: ${routePath}`)

  app.post(routePath, async (request, reply) => {
    request.log.info('Telegram webhook request')
    reply.hijack()

    request.raw.body = request.body
    await webhook(request.raw, reply.raw)
  })
}
