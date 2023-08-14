'use strict'

exports.requestStatusMiddleware = function requestStatusMiddleware () {
  return async function requestStatus (ctx, next) {
    ctx.status = {
      isNewUser: false
    }
    return await next()
  }
}

exports.replyWith = function helpMiddleware () {
  return async function requestStatus (ctx, next) {
    ctx.replyWithSafeMarkdown = function (text, extra) {
      return ctx.replyWithMarkdownV2(escapeMarkdown(text), extra)
    }

    return await next()
  }
}

/** @param {import('fastify').FastifyInstance} app */
exports.userMiddleware = function userMiddleware (app) {
  return async function upsertUser (ctx, next) {
    const userId = ctx.update.message?.from.id || ctx.update.callback_query?.from.id
    const chatId = ctx.update.message?.chat.id || ctx.update.callback_query?.message?.chat.id

    const [user] = await app.platformatic.entities.user.find({
      where: {
        id: { eq: userId }
      }
    })

    if (user) {
      ctx.user = user
    } else {
      app.log.info('Creating new user', ctx.update.message.from)

      const fullName = ctx.update.message.from.first_name + (ctx.update.message.from.last_name ? ` ${ctx.update.message.from.last_name}` : '')
      const [newUser] = await app.platformatic.entities.user.insert({
        inputs: [
          {
            id: userId,
            chatId,
            username: ctx.update.message.from.username || fullName,
            lang: ctx.update.message.from.language_code
          }
        ]
      })

      ctx.user = newUser
      ctx.status.isNewUser = true
    }

    return await next()
  }
}

// https://core.telegram.org/bots/api#markdownv2-style
const SPECIAL_CHARS = [
  '\\', '_', '*', '[', ']', '(', ')', '~', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!'
]
const regex = new RegExp(`[${SPECIAL_CHARS.join('\\')}]`, 'ig')
function escapeMarkdown (text) {
  return text.replace(regex, '\\$&')
}

module.exports.middlewares = [
  exports.requestStatusMiddleware,
  exports.replyWith,
  exports.userMiddleware
]
