module.exports = (phase, { defaultConfig }) => {
  // Add loader for markdown files.
  const webpack = (config) => {
    config.module.rules.push(
      {
        test: /\.md$/,
        use: 'raw-loader'
      }
    )
    return config
  }
  if (process.env.API_URL === undefined) {
    require('dotenv').config({path: '.env.build'})
  }
  const env = {
    API_BASE_URL: process.env.API_BASE_URL,
    API_KEY: process.env.API_KEY,
    AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_SCOPE: process.env.AUTH0_SCOPE,
    REDIRECT_URI: process.env.REDIRECT_URI,
    POST_LOGOUT_REDIRECT_URI: process.env.POST_LOGOUT_REDIRECT_URI
  }
  // Return webpack configurations.
  return {
    env,
    webpack
  }
}
