'use strict'

/**
 * @param {import('fastify').FastifyInstance} app
 * @param {import('telegraf').Telegraf} bot
 */
module.exports = function build (app, bot) {
  bot.command('join', async ctx => {
    const { user } = ctx
    const locale = user.lang

    const [, eventCode] = ctx.message.text.split(' ')

    const [event] = await app.platformatic.entities.event.find({
      fields: ['id', 'name', 'endedAt'],
      where: {
        code: { eq: eventCode }
      }
    })

    if (!event) {
      return ctx.replyWithSafeMarkdown(app.i18n.__({ phrase: 'error_event_not_found', locale }, { code: eventCode }))
    }

    if (event.endedAt) {
      return ctx.reply(app.i18n.__({ phrase: 'error_event_ended', locale }, { when: event.endedAt.toISOString() }))
    }

    await app.platformatic.entities.usersEvent.save({
      input: {
        userId: user.id,
        eventId: event.id
      }
    })

    await ctx.reply(app.i18n.__({ phrase: 'join_done', locale }, { name: event.name }))
  })
}
