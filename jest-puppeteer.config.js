const PORT = 9999

module.exports = {
  browserContext: process.env.INCOGNITO ? 'incognito' : 'default',
  launch: {
    headless: process.env.CI === 'true'
  },
  server: {
    command: `yarn run dev --port ${PORT}`,
    port: PORT
  }
}
