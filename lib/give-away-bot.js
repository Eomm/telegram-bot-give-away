'use strict'

const { Telegraf, Markup } = require('telegraf')
const { message } = require('telegraf/filters')
const sampleSize = require('lodash.samplesize')

const { requestStatusMiddleware, userMiddleware } = require('./bot-middlewares')

const CREATE_EVENT_STEPS = [
  { i: 0, step: 'create_start_event_name', field: 'name' },
  { i: 1, step: 'create_event_description', field: 'description' },
  { i: 2, step: 'create_event_prize', field: 'prize' },
  { i: 3, step: 'create_event_winner', field: 'required_winners', validate: (value) => !isNaN(value) && value > 0 },
  { i: 4, step: 'create_event_code', field: 'code', validate: (value) => /^[a-z0-9-_.]{4,30}$/i.test(value) }
]

/** @param {import('fastify').FastifyInstance} app */
module.exports = function buildBot (app) {
  const bot = new Telegraf(app.appConfig.BOT_TOKEN)

  bot.use(requestStatusMiddleware())
  bot.use(userMiddleware(app))

  bot.catch(async (err, ctx) => {
    app.log.fatal(err, { input: ctx.update })
    await ctx.reply(app.i18n.__({ phrase: 'fatal_error', locale: ctx.user.lang }))
  })

  bot.start(async ctx => {
    const { user } = ctx
    const userLanguage = user.lang

    if (ctx.status.isNewUser) {
      ctx.reply(app.i18n.__({ phrase: 'welcome', locale: userLanguage }))
    } else {
      ctx.reply(app.i18n.__({ phrase: 'welcome_back', locale: userLanguage }, { username: user.username }))
    }
  })

  bot.help(async ctx => {
    const locale = ctx.user.lang
    await ctx.reply(app.i18n.__({ phrase: 'help', locale }))
  })

  bot.command('create', async ctx => {
    // todo block if user is not admin
    const { user } = ctx
    const locale = user.lang

    const createEventStep = CREATE_EVENT_STEPS[0].step

    await app.platformatic.entities.user.save({
      fields: ['id', 'title'],
      input: {
        id: user.id,
        currentAction: createEventStep,
        currentActionData: {},
        updatedAt: new Date()
      }
    })

    await ctx.reply(app.i18n.__({ phrase: createEventStep, locale }))
  })

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

    return ctx.reply(app.i18n.__({ phrase: 'event_info', locale: ctx.user.lang }, event))
  })

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
      return ctx.replyWithMarkdownV2(app.i18n.__({ phrase: 'error_event_not_found', locale }, { code: eventCode }))
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
      return ctx.replyWithMarkdownV2(app.i18n.__({ phrase: 'error_extract_not_found', locale }, { code: eventCode }))
    }

    if (event.endedAt) {
      return ctx.reply(app.i18n.__({ phrase: 'error_event_ended', locale }, { when: event.endedAt.toISOString() }))
    }

    const [eventOwner] = await app.platformatic.entities.user.find({
      where: { id: { eq: event.createdBy } }
    })

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

  bot.on(message('text'), async ctx => {
    const user = ctx.user
    const locale = user.lang

    if (!user.currentAction) {
      return ctx.reply(app.i18n.__({ phrase: 'not_supported', locale }))
    }

    const currentStep = CREATE_EVENT_STEPS.find(step => step.step === user.currentAction)
    const nextStep = CREATE_EVENT_STEPS[currentStep.i + 1]

    if (currentStep.validate?.(ctx.message.text) === false) {
      app.log.debug('Invalid value: [%s]', ctx.message.text)
      return ctx.reply(app.i18n.__({ phrase: 'error_invalid_value', locale }))
    }

    if (nextStep) {
      // The event is not finished yet
      await app.platformatic.entities.user.save({
        fields: ['id'],
        input: {
          id: user.id,
          currentAction: nextStep?.step || null,
          currentActionData: {
            ...user.currentActionData,
            [currentStep.field]: ctx.message.text
          },
          updatedAt: new Date()
        }
      })

      return ctx.reply(app.i18n.__({ phrase: nextStep.step, locale }))
    }

    const event = {
      ...user.currentActionData,
      [currentStep.field]: ctx.message.text,
      createdBy: user.id
    }

    try {
      app.log.info('Creating new event: %s', event.code)
      await app.platformatic.entities.event.insert({
        inputs: [event]
      })

      await app.platformatic.entities.user.save({
        fields: ['id'],
        input: {
          id: user.id,
          currentAction: nextStep?.step || null,
          currentActionData: null,
          updatedAt: new Date()
        }
      })

      await ctx.replyWithMarkdownV2(app.i18n.__({ phrase: 'create_event_done', locale }, { code: event.code }))
    } catch (error) {
      if (error.code === '23505') {
        return ctx.reply(app.i18n.__({ phrase: 'error_code_unique', locale }, { code: event.code }))
      }
      throw error
    }
  })

  return bot
}
