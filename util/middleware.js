if (typeof (fetch) === 'undefined') require('isomorphic-fetch')

/**
 * This method builds the options object for call to the fetch method.
 * @param {string} accessToken If non-null, a bearer Authorization header will be added with the specified token.
 * @param {string} apiKey If non-null, an x-api-key header will be added with the specified key.
 * @param {string} method The HTTP method to execute.
 * @param {*} options Extra options to pass to fetch.
 */
export function getSecureFetchOptions (accessToken, apiKey, method = 'get', options = {}) {
  const headers = {
    // JSON request bodies only.
    'Content-Type': 'application/json'
  }
  if (apiKey) {
    headers['x-api-key'] = apiKey
  }
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  return {
    method,
    mode: 'cors', // Middleware is at a different URL.
    headers,
    ...options
  }
}

/**
 * This convenience method wraps a fetch call to the specified URL
 * with the token and api key added (if provided) to the HTTP request header,
 * and wraps the response by adding the success/error status of the call.
 * @param {string} url The URL to call.
 * @param {string} accessToken If non-null, the Authorization token to add to request header.
 * @param {string} apiKey If non-null, the API key to add to the Authorization header.
 * @param {string} method The HTTP method to execute.
 * @param {*} options Extra options to pass to fetch.
 */
export async function secureFetch (url, accessToken, apiKey, method = 'get', options = {}) {
  const res = await fetch(url, getSecureFetchOptions(accessToken, apiKey, method, options))

  if ((res.status && res.status >= 400) || (res.code && res.code >= 400)) {
    const result = await res.json()
    let message = `Error ${method}-ing user: ${result.message}`
    if (result.detail) message += `  (${result.detail})`

    return {
      status: 'error',
      message
    }
  }
  return {
    status: 'success',
    data: await res.json()
  }
}

export async function fetchUser (url, apiKey, token) {
  const requestUrl = `${url}/fromtoken`
  return secureFetch(requestUrl, token, apiKey)
}

export async function addUser (url, apiKey, token, data) {
  const requestUrl = `${url}`
  return secureFetch(requestUrl, token, apiKey, 'POST', {
    body: JSON.stringify(data)
  })
}

export async function updateUser (url, apiKey, token, data) {
  const { id } = data // Middleware ID, NOT auth0 (or similar) id.
  const requestUrl = `${url}/${id}`

  if (id) {
    return secureFetch(requestUrl, token, apiKey, 'PUT', {
      body: JSON.stringify(data)
    })
  } else {
    return {
      status: 'error',
      message: 'Corrupted state: User ID not available for exiting user.'
    }
  }
}
