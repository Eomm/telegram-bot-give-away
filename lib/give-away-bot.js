'use strict'

const { Telegraf } = require('telegraf')
const { message } = require('telegraf/filters')

const registerExtract = require('./commands/extract')
const registerList = require('./commands/list')
const registerJoin = require('./commands/join')
const registerCreate = require('./commands/create')
const registerPromote = require('./commands/promote')
const registerAbort = require('./commands/abort')

const { middlewares } = require('./bot-middlewares')

/** @param {import('fastify').FastifyInstance} app */
module.exports = function buildBot (app) {
  const bot = new Telegraf(app.appConfig.PLT_BOT_TOKEN)

  middlewares.forEach(middleware => bot.use(middleware(app)))

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

  registerList(app, bot)
  registerExtract(app, bot)
  registerJoin(app, bot)
  registerPromote(app, bot)
  registerAbort(app, bot)
  registerCreate(app, bot)

  bot.on(message('text'), async ctx => {
    const locale = ctx.user.lang
    await ctx.reply(app.i18n.__({ phrase: 'not_supported', locale }))
  })

  return bot
}
