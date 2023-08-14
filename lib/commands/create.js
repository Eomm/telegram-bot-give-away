'use strict'

const { message } = require('telegraf/filters')

const CREATE_EVENT_STEPS = [
  { i: 0, step: 'create_start_event_name', field: 'name' },
  { i: 1, step: 'create_event_description', field: 'description' },
  { i: 2, step: 'create_event_prize', field: 'prize' },
  { i: 3, step: 'create_event_winner', field: 'required_winners', validate: (value) => !isNaN(value) && value > 0 },
  { i: 4, step: 'create_event_code', field: 'code', validate: (value) => /^[a-z0-9-_.]{4,30}$/i.test(value) }
]

/**
 * @param {import('fastify').FastifyInstance} app
 * @param {import('telegraf').Telegraf} bot
 */
module.exports = function build (app, bot) {
  bot.command('create', async ctx => {
    const { user } = ctx
    const locale = user.lang

    // todo block if user is not admin
    if (user.role !== 'creator') {
      await ctx.reply('⚠️ You are not allowed to create events, but it is DEV mode, so you can continue...')
    }

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

  bot.on(message('text'), async (ctx, next) => {
    const user = ctx.user
    const locale = user.lang

    const currentStep = CREATE_EVENT_STEPS.find(step => step.step === user.currentAction)
    if (!currentStep || ctx.message.text.startsWith('/')) {
      // skip this middleware if user is not creating an event
      return next()
    }

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

      await ctx.replyWithSafeMarkdown(app.i18n.__({ phrase: 'create_event_done', locale }, { code: event.code }))
    } catch (error) {
      if (error.code === '23505') {
        return ctx.reply(app.i18n.__({ phrase: 'error_code_unique', locale }, { code: event.code }))
      }
      throw error
    }
  })
}
