module.exports = (phase, { defaultConfig }) => {
  // Add raw loader for markdown files.
  const webpack = (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader'
    })
    return config
  }
  // If running in a development environment, API_BASE_URL will be undefined
  // so we use dotenv to load the env file. Otherwise, these are assigned in
  // now.json to secrets stored within the zeit.co environment.
  if (process.env.API_BASE_URL === undefined) {
    require('dotenv').config({ path: '.env.build' })
  }
  // Assign all values from .env.build file here.
  // NOTE: If any values are added to .env.build, they must be applied here.
  // TODO: Find a better way to handle this.
  const env = {
    API_BASE_URL: process.env.API_BASE_URL,
    API_DOCUMENTATION_URL: process.env.API_DOCUMENTATION_URL,
    API_KEY: process.env.API_KEY,
    API_MANAGER_ENABLED: process.env.API_MANAGER_ENABLED,
    API_NAME: process.env.API_NAME,
    AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    CDP_MANAGER_ENABLED: process.env.CDP_MANAGER_ENABLED,
    HOMEPAGE_NAME: process.env.HOMEPAGE_NAME,
    OTP_FORUM_URL: process.env.OTP_FORUM_URL,
    OTP_UI_URL: process.env.OTP_UI_URL,
    PRIMARY_COLOR: process.env.PRIMARY_COLOR,
    PRIVACY_POLICY_URL: process.env.PRIVACY_POLICY_URL,
    SECONDARY_COLOR: process.env.SECONDARY_COLOR,
    SIGN_UP_ENABLED: process.env.SIGN_UP_ENABLED,
    SITE_LOGO: process.env.SITE_LOGO,
    SITE_TITLE: process.env.SITE_TITLE,
    STATUS_PAGE_URL: process.env.STATUS_PAGE_URL,
    SUPPORT_EMAIL: process.env.SUPPORT_EMAIL,
    TERMS_CONDITIONS_URL: process.env.TERMS_CONDITIONS_URL,
    USAGE_ID: process.env.USAGE_ID
  }
  // Return config with environment variables and webpack configuration.
  return {
    env,
    webpack
  }
}
