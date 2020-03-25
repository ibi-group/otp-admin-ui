import { REDIRECT_URI } from './constants'

/**
 * Handle logging out with Auth0 and return to the provided path.
 */
export function logout (path = '') {
  const returnTo = encodeURIComponent(`${REDIRECT_URI}${path}`)
  window.location.href =`https://${process.env.AUTH0_DOMAIN}/v2/logout?returnTo=${returnTo}&client_id=${process.env.AUTH0_CLIENT_ID}`
}
