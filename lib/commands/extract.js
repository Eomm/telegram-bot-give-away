'use strict'

const { Markup } = require('telegraf')
const sampleSize = require('lodash.samplesize')

const EXTRACT_EVENT_STEP = 'extract_event'

/**
 * @param {import('fastify').FastifyInstance} app
 * @param {import('telegraf').Telegraf} bot
 */
module.exports = function build (app, bot) {
  bot.command('extract', async ctx => {
    const { user } = ctx
    const locale = user.lang

    const events = await app.platformatic.entities.event.find({
      where: {
        createdBy: { eq: user.id }
      }
    })

    if (events.length === 0) {
      return ctx.reply(app.i18n.__({ phrase: 'list_no_events', locale: user.lang }))
    }

    await app.platformatic.entities.user.save({
      fields: ['id', 'title'],
      input: {
        id: user.id,
        currentAction: EXTRACT_EVENT_STEP,
        currentActionData: {},
        updatedAt: new Date()
      }
    })

    return ctx.reply(app.i18n.__({ phrase: 'extract_start', locale }),
      Markup.inlineKeyboard(
        events.map(event => {
          const displayName = `${event.name} (${event.code}) ${event.endedAt ? '🔒' : ''}`
          return [Markup.button.callback(displayName, `extract:${event.id}`)]
        })
      ))
  })

  bot.action(/^extract:.+/, async (ctx, next) => {
    const user = ctx.user
    const locale = user.lang

    await ctx.answerCbQuery()

    if (user.currentAction !== EXTRACT_EVENT_STEP) {
      // skip this middleware
      return next()
    }

    const eventCbData = ctx.update.callback_query.data
    const [, eventId] = eventCbData.split(':')

    const [event] = await app.platformatic.entities.event.find({
      where: {
        id: { eq: eventId }
      }
    })

    if (!event) {
      return ctx.replyWithSafeMarkdown(app.i18n.__({ phrase: 'error_event_not_found', locale }, { code: eventId }))
    }

    if (event.endedAt) {
      return ctx.reply(app.i18n.__({ phrase: 'error_event_ended', locale }, { when: event.endedAt.toISOString() }))
    }

    const [eventOwner] = await app.platformatic.entities.user.find({
      where: { id: { eq: event.createdBy } }
    })

    if (eventOwner.id !== user.id) {
      return ctx.reply(app.i18n.__({ phrase: 'error_extract_not_owner', locale }))
    }

    const rawParticipants = await app.platformatic.entities.usersEvent.find({
      where: { eventId: { eq: event.id } }
    })

    if (rawParticipants.length === 0) {
      return ctx.reply(app.i18n.__({ phrase: 'error_event_no_participants', locale }, { name: event.name }))
    }

    const participants = await app.platformatic.entities.user.find({
      where: { id: { in: rawParticipants.map(p => p.userId) } }
    })

    const winners = sampleSize(participants, event.requiredWinners)

    await app.platformatic.db.tx(async tx => {
      const winnerIds = winners.map(winner => winner.id)
      await app.platformatic.entities.usersEvent.updateMany({
        tx,
        where: { userId: { in: winnerIds }, eventId: { eq: event.id } },
        input: { isWinner: true }
      })

      await app.platformatic.entities.usersEvent.updateMany({
        tx,
        where: { userId: { nin: winnerIds }, eventId: { eq: event.id } },
        input: { isWinner: false }
      })

      await app.platformatic.entities.event.save({
        tx,
        fields: ['id'],
        input: {
          id: event.id,
          endedAt: new Date()
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
    })

    const msg = app.i18n.__({ phrase: 'extract_winners', locale }, {
      requiredWinners: event.requiredWinners,
      count: winners.length
    })

    for (const winner of winners) {
      try {
        app.log.info({ winner: winner.id, event: event.id }, 'Sending winner message')
        const winnerMsg = app.i18n.__({ phrase: 'extract_winner', locale }, {
          name: event.name,
          owner: eventOwner.username
        })
        await ctx.telegram.sendMessage(winner.chatId, winnerMsg)
      } catch (error) {
        app.log.error(error, 'Error sending winner message')
      }
    }

    await ctx.reply(`${msg} ${winners.map(winner => `- @${winner.username}`).join('\n')}`)
  })
}
