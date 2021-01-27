import { USER_TYPES } from './constants'

if (typeof (fetch) === 'undefined') require('isomorphic-fetch')

export function getUserUrl (type) {
  const selectedType = USER_TYPES.find(t => t.value === type)
  if (!selectedType) throw new Error(`Type: ${type} does not exist!`)
  return selectedType.url
}

/**
 * This method wraps a fetch call to the specified URL
 * with the auth0 object and api key added (if provided) to the HTTP request header.
 * In case of an error obtaining a token, this method returns a response that
 * mimics the fetch response for an unauthorized request (HTTP 401).
 * @param {string} url The URL to call.
 * @param {string} auth0 the auth0 object used to obtain an accessToken for secure APIs.
 * @param {string} method The HTTP method to execute.
 * @param {*} options Extra fetch options to pass to fetch.
 */
async function secureFetchInternal (url, auth0, method = 'get', options = {}) {
  const { getAccessTokenSilently } = auth0
  let accessToken
  try {
    accessToken = await getAccessTokenSilently()
  } catch (error) {
    // Log occurrences of errors obtaining a token.
    console.error('Error obtaining access token.', error)

    // Return a response mimicking the 401-Unauthorized status, so that
    // code that calls secureFetch and secureFetchHandleErrors can handle as needed.
    return {
      code: 401,
      json: new Promise((resolve, reject) => {
        resolve('{"message": "Error obtaining access token."}')
      }),
      status: 401
    }
  }

  return fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'x-api-key': process.env.API_KEY
    },
    ...options
  })
}

/**
 * Wraps secureFetchInternal above, returning the result as JSON.
 */
export async function secureFetch (url, auth0, method = 'get', options = {}) {
  const res = await secureFetchInternal(url, auth0, method, options)
  const json = await res.json()
  return json
}

/**
 * Alternative to secureFetch that adds error handling.
 */
export async function secureFetchHandleErrors (url, auth0, method = 'get', options = {}) {
  const res = await secureFetchInternal(url, auth0, method, options)

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
