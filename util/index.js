import fetch from 'isomorphic-unfetch'

/**
 * Make an authenticated request to the backend.
 */
export async function secureFetch (url, accessToken, method = 'get', options = {}) {
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'x-api-key': process.env.API_KEY
    },
    ...options
  })
  if (res.status >= 400) {
    const result = await res.json()
    let message = `Error ${method}-ing user: ${result.message}`
    if (result.detail) message += `  (${result.detail})`
    return window.alert(message)
  }
  return res.json()
}
