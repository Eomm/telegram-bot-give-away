'use strict'

const { message } = require('telegraf/filters')

const JOIN_EVENT_STEP = 'join_event'

/**
 * @param {import('fastify').FastifyInstance} app
 * @param {import('telegraf').Telegraf} bot
 */
module.exports = function build (app, bot) {
  bot.command('join', async ctx => {
    const { user } = ctx
    const locale = user.lang

    await app.platformatic.entities.user.save({
      fields: ['id', 'title'],
      input: {
        id: user.id,
        currentAction: JOIN_EVENT_STEP,
        currentActionData: {},
        updatedAt: new Date()
      }
    })

    await ctx.reply(app.i18n.__({ phrase: 'join_start', locale }))
  })

  bot.on(message('text'), async (ctx, next) => {
    const user = ctx.user
    const locale = user.lang

    if (user.currentAction !== JOIN_EVENT_STEP) {
      // skip this middleware
      return next()
    }

    const eventCode = ctx.message.text

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

    await app.platformatic.entities.user.save({
      fields: ['id'],
      input: {
        id: user.id,
        currentAction: null,
        currentActionData: null,
        updatedAt: new Date()
      }
    })

    await ctx.reply(app.i18n.__({ phrase: 'join_done', locale }, { name: event.name }))
  })
}
