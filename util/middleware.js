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
export function secureFetch (url, accessToken, method = 'get', options = {}) {
  const headers = {
    Authorization: `Bearer ${accessToken}`
  }
  if (process.env.API_KEY) headers['x-api-key'] = process.env.API_KEY
  return fetch(url, {
    method,
    headers,
    ...options
  }).then(res => res.json())
}
