const { PHASE_PRODUCTION_BUILD } =
  process.env.NODE_ENV === 'development'
    ? {} // We're never in "production server" phase when in development mode
    : !process.env.NOW_REGION
      ? require('next/constants') // Get values from `next` package when building locally
      : require('next-server/constants') // Get values from `next-server` package when building on now v2

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
  let env = {
    API_BASE_URL: 'http://localhost:4567',
    API_KEY: 'your_api_key',
    AUTH0_AUDIENCE: 'https://otp-middleware',
    AUTH0_DOMAIN: 'YOUR_DOMAIN.auth0.com',
    AUTH0_CLIENT_ID: 'AUTH0_CLIENT_ID',
    AUTH0_SCOPE: '',
    REDIRECT_URI: 'http://localhost:3000/',
    POST_LOGOUT_REDIRECT_URI: 'http://localhost:3000/'
  }
  if (phase === PHASE_PRODUCTION_BUILD) {
    // Config used to run in production (now).
    env = {
      API_BASE_URL: 'https://PROD_API_URI',
      API_KEY: 'your_api_key',
      AUTH0_AUDIENCE: 'https://otp-middleware',
      AUTH0_DOMAIN: 'YOUR_DOMAIN.auth0.com',
      AUTH0_CLIENT_ID: 'AUTH0_CLIENT_ID',
      AUTH0_SCOPE: '',
      REDIRECT_URI: 'https://PROD_UI_URI',
      POST_LOGOUT_REDIRECT_URI: 'https://PROD_UI_URI'
    }
  }
  // Return webpack configurations.
  return {
    env,
    webpack
  }
}
