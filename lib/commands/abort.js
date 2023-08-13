'use strict'

/**
 * @param {import('fastify').FastifyInstance} app
 * @param {import('telegraf').Telegraf} bot
 */
module.exports = function build (app, bot) {
  bot.command('abort', async (ctx) => {
    const { user } = ctx

    if (user.currentAction) {
      app.log.debug('Aborting current action', { user: user.id, action: user.currentAction })
      await app.platformatic.entities.user.save({
        fields: ['id'],
        input: {
          id: user.id,
          currentAction: null,
          currentActionData: null,
          updatedAt: new Date()
        }
      })
    }

    return ctx.reply(app.i18n.__({ phrase: 'abort_done', locale: user.lang }))
  })
}
