// Auth0 scopes must now be separated by spaces (not commas).
// (See https://auth0.com/docs/flows/call-your-api-using-the-authorization-code-flow#parameters.)
export const AUTH0_SCOPE = 'admin-user api-user'

export const ADMIN_USER_URL = `${process.env.API_BASE_URL}/api/admin/user`
export const API_USER_URL = `${process.env.API_BASE_URL}/api/secure/application`
export const OTP_USER_URL = `${process.env.API_BASE_URL}/api/secure/user`
export const OTP_PLAN_URL = `${process.env.API_BASE_URL}/otp/routers/default/plan`

export const DEFAULT_REFRESH_MILLIS = 30000

export const USER_TYPES = [
  {value: 'api', label: 'API Users', url: API_USER_URL},
  {value: 'admin', label: 'Admin Users', url: ADMIN_USER_URL},
  {value: 'otp', label: 'OTP Users', url: OTP_USER_URL}
]
