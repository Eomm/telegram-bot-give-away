'use strict'

const { Markup } = require('telegraf')

/**
 * @param {import('fastify').FastifyInstance} app
 * @param {import('telegraf').Telegraf} bot
 */
module.exports = function build (app, bot) {
  bot.command('list', async ctx => {
    const { user } = ctx

    const sql = app.platformatic.sql
    const events = await app.platformatic.db.query(sql`
      SELECT e.*, null as is_winner
      FROM events e
      WHERE e.created_by = ${user.id}
        UNION
      SELECT e.*, p.is_winner
      FROM events e INNER JOIN users_events p ON e.id = p.event_id
      WHERE p.user_id = ${user.id}
    `)

    const clean = events.map(event => {
      return {
        ...app.platformatic.entities.event.fixOutput(event),
        ...app.platformatic.entities.usersEvent.fixOutput(event)
      }
    })

    if (clean.length === 0) {
      return ctx.reply(app.i18n.__({ phrase: 'list_no_events', locale: user.lang }))
    }

    return ctx.reply(app.i18n.__({ phrase: 'list_events', locale: user.lang }),
      Markup.inlineKeyboard(
        clean.map(event => {
          const isMine = event.createdBy === Number(user.id)
          const displayName = `${event.name} ${isMine ? '🔑' : ''} ${event.isWinner ? '🏆' : ''}`
          return [Markup.button.callback(displayName, `event:${event.id}`)]
        })
      ))
  })

  bot.action(/^event:.+/, async ctx => {
    const eventCbData = ctx.update.callback_query.data
    const [, eventId] = eventCbData.split(':')

    const [event] = await app.platformatic.entities.event.find({
      where: { id: { eq: eventId } }
    })

    if (!event.endedAt) {
      event.endedAt = '⏳'
    }

    const msg = app.i18n.__({ phrase: 'event_info', locale: ctx.user.lang }, event)
    return ctx.replyWithSafeMarkdown(msg)
  })
}
