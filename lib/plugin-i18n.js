'use strict'

const path = require('node:path')

const fp = require('fastify-plugin')
const { I18n } = require('i18n')

module.exports = fp(async function buildI18n (app) {
  const i18n = new I18n({
    locales: ['en', 'it'],
    defaultLocale: 'it',
    updateFiles: false,
    staticCatalog: {
      it: require(path.join(__dirname, 'locales', 'it.js')),
      en: require(path.join(__dirname, 'locales', 'en.js'))
    },
    fallbacks: { it: 'en', en: 'it' }
  })

  app.decorate('i18n', i18n)
})
