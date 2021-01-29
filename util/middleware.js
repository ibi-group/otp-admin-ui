import { USER_TYPES } from './constants'

if (typeof (fetch) === 'undefined') require('isomorphic-fetch')

export function getUserUrl (type) {
  const selectedType = USER_TYPES.find(t => t.value === type)
  if (!selectedType) throw new Error(`Type: ${type} does not exist!`)
  return selectedType.url
}

/**
 * This method obtains an Auth0 token and passes it as header, along with the app's API key,
 * to the fetch method using the provided URL and parameters.
 * @param {string} url The URL to call.
 * @param {string} auth0 the auth0 object used to obtain an accessToken for secure APIs.
 * @param {string} method The HTTP method to execute.
 * @param {*} options Extra fetch options to pass to fetch.
 * @returns An object with the operation's status and data or error.
 */
export async function secureFetch (url, auth0, method = 'get', options = {}) {
  console.log(`Received call to secureFetch with params`, url, method, options)

  const { getAccessTokenSilently } = auth0
  let accessToken
  try {
    // Get the Auth0 access token.
    // Note: repeated calls do not generate extra web requests to Auth0
    // (the cached token is used first if available).
    accessToken = await getAccessTokenSilently()
  } catch (error) {
    // Log occurrences of errors obtaining a token.
    console.error('Error obtaining access token.', error)

    return {
      status: 'error',
      message: 'Error obtaining access token'
    }
  }

  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'x-api-key': process.env.API_KEY
    },
    ...options
  })

  if ((res.status && res.status >= 400) || (res.code && res.code >= 400)) {
    const result = await res.json()
    let message = `Error: ${result.message}`
    if (result.detail) message += `  (${result.detail})`

    return {
      status: 'error',
      message
    }
  }
  const data = await res.json()
  return {
    status: 'success',
    data
  }
}
