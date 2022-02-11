import { Auth0ContextInterface, WithAuth0Props } from '@auth0/auth0-react'

import { USER_TYPES } from './constants'
import type { USER_TYPE } from './constants'

if (typeof fetch === 'undefined') require('isomorphic-fetch')

export function getUserUrl(type: USER_TYPE): string {
  const selectedType = USER_TYPES.find((t) => t.value === type)
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
export async function secureFetch(
  url: string,
  auth0: Auth0ContextInterface,
  method: FetchOptions['method'] = 'GET',
  // TODO: import fetch options type
  options: RequestInit & FetchOptions = {}
): Promise<{ data?: any; message?: string; status?: string; error?: string }> {
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
      message: 'Error obtaining access token',
      status: 'error'
    }
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'x-api-key': process.env.API_KEY
    },
    method,
    ...options
  })

  if ((res.status && res.status >= 400) || (res.code && res.code >= 400)) {
    const result: JSON & { message?: string; detail?: string } =
      await res.json()
    let message = `Error: ${result.message}`
    if (result.detail) message += `  (${result.detail})`

    return {
      message,
      status: 'error'
    }
  }
  const data = await res.json()
  return {
    data,
    status: 'success'
  }
}
