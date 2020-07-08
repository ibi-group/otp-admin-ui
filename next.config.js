module.exports = (phase, { defaultConfig }) => {
  // Add raw loader for markdown files.
  const webpack = (config) => {
    config.module.rules.push(
      {
        test: /\.md$/,
        use: 'raw-loader'
      }
    )
    return config
  }
  // If running in a development environment, API_BASE_URL will be undefined
  // so we use dotenv to load the env file. Otherwise, these are assigned in
  // now.json to secrets stored within the zeit.co environment.
  if (process.env.API_BASE_URL === undefined) {
    require('dotenv').config({path: '.env.build'})
  }
  const env = {
    API_BASE_URL: process.env.API_BASE_URL,
    API_KEY: process.env.API_KEY,
    AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID
  }
  // Return config with environment variables and webpack configuration.
  return {
    env,
    webpack
  }
}
