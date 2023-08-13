'use strict'

/**
 * @param {import('fastify').FastifyInstance} app
 * @param {import('telegraf').Telegraf} bot
 */
module.exports = function build (app, bot) {
  bot.command('abort', async (ctx) => {
    const locale = ctx.user.lang
    return ctx.reply(app.i18n.__({ phrase: 'not_implemented', locale }))
  })
}
