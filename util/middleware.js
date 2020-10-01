if (typeof (fetch) === 'undefined') require('isomorphic-fetch')

/**
 * This convenience method wraps a fetch call to the specified URL
 * with the token and api key added (if provided) to the HTTP request header.
 * @param {string} url The URL to call.
 * @param {string} accessToken If non-null, the Authorization token to add to request header.
 * @param {string} apiKey If non-null, the API key to add to the Authorization header.
 * @param {string} method The HTTP method to execute.
 * @param {*} options Extra fetch options to pass to fetch.
 */
export async function secureFetch (url, accessToken, method = 'get', options = {}) {
  const headers = {
    Authorization: `Bearer ${accessToken}`
  }
  if (process.env.API_KEY) headers['x-api-key'] = process.env.API_KEY
  const res = await fetch(url, {
    method,
    headers,
    ...options
  })
  return {
    data: await res.json(),
    timestamp: new Date()
  }
}

export async function addUser (url, token, data) {
  const requestUrl = `${url}`
  return secureFetch(requestUrl, token, 'POST', {
    body: JSON.stringify(data)
  })
}

/**
 * Updates (or creates) a user entry in the middleware.
 */
export async function createOrUpdateUser (url, userData, isNew, accessToken) {
  let result
  if (isNew) {
    result = await addUser(url, accessToken, userData)
  } else {
    result = await updateUser(url, accessToken, userData)
  }

  // TODO: improve the UI feedback messages for this.
  // A successful call has the user record (with id) in the data field.
  if (result.data.id) {
    return result.data
  } else {
    alert(`An error was encountered:\n${JSON.stringify(result)}`)
    return false
  }
}

export async function updateUser (url, token, data) {
  const { id } = data // Middleware ID, NOT auth0 (or similar) id.
  const requestUrl = `${url}/${id}`

  if (id) {
    return secureFetch(requestUrl, token, 'PUT', {
      body: JSON.stringify(data)
    })
  } else {
    return {
      status: 'error',
      message: 'Corrupted state: User ID not available for exiting user.'
    }
  }
}
