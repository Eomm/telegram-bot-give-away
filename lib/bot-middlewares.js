'use strict'

exports.requestStatusMiddleware = function requestStatusMiddleware () {
  return async function requestStatus (ctx, next) {
    ctx.status = {
      isNewUser: false
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
      const [newUser] = await app.platformatic.entities.user.insert({
        inputs: [
          {
            id: userId,
            chatId,
            username: ctx.update.message.from.username,
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
