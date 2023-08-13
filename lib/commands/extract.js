'use strict'

const sampleSize = require('lodash.samplesize')

/**
 * @param {import('fastify').FastifyInstance} app
 * @param {import('telegraf').Telegraf} bot
 */
module.exports = function build (app, bot) {
  bot.command('extract', async ctx => {
    const { user } = ctx
    const locale = user.lang

    const [, eventCode] = ctx.message.text.split(' ')

    const [event] = await app.platformatic.entities.event.find({
      where: {
        code: { eq: eventCode }
      }
    })

    if (!event) {
      return ctx.replyWithSafeMarkdown(app.i18n.__({ phrase: 'error_extract_not_found', locale }, { code: eventCode }))
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
