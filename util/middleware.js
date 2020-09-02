if (typeof (fetch) === 'undefined') require('isomorphic-fetch')

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
export async function secureFetch (url, accessToken, method = 'get', options = {}) {
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
  return {
    status: 'success',
    data: await res.json()
  }
}

export async function addUser (url, token, data) {
  const requestUrl = `${url}`
  return secureFetch(requestUrl, token, 'POST', {
    body: JSON.stringify(data)
  })
}

/**
 * Fetches user preferences, or if none available, make an initial user
 * preference object, and return the result.
 */
export async function fetchUser (route, apiKey, auth) {
  const { accessToken } = auth
  const requestUrl = `${route}/fromtoken`

  try {
    const result = await secureFetch(requestUrl, accessToken)

    // Beware! On AWS API gateway, if a user is not found in the middleware
    // (e.g. they just created their Auth0 password but have not completed the account setup form yet),
    // the call above will return, for example:
    // {
    //    status: 'success',
    //    data: {
    //      "result": "ERR",
    //      "message": "No user with id=000000 found.",
    //      "code": 404,
    //      "detail": null
    //    }
    // }
    //
    // The same call to a middleware instance that is not behind an API gateway
    // will return:
    // {
    //    status: 'error',
    //    message: 'Error get-ing user...'
    // }
    // TODO: Improve AWS response.

    const resultData = result.data
    const isNewAccount = result.status === 'error' || (resultData && resultData.result === 'ERR')

    if (!isNewAccount) {
      return resultData
    } else {
      return null
    }
  } catch (error) {
    // TODO: improve error handling.
    alert(`An error was encountered:\n${error}`)
  }
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
  if (result.status === 'success' && result.data) {
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
