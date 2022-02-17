/**
 * Handle logging out with Auth0 and return to the provided path.
 */
export function logout(path = ''): void {
  const returnTo = encodeURIComponent(`${getAuthRedirectUri()}${path}`)
  window.location.href = `https://${process.env.AUTH0_DOMAIN}/v2/logout?returnTo=${returnTo}&client_id=${process.env.AUTH0_CLIENT_ID}`
}

export const getAuthRedirectUri = (): string => {
  if (typeof window !== 'undefined') {
    const url = `${window.location.protocol}//${window.location.host}`
    return url
  }
  return 'http://localhost:3000'
}
