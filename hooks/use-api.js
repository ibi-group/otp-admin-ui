import { useCallback, useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

import { AUTH0_SCOPE } from '../util/constants'

export const useFetchData = (url, method = 'get', options) => {
  const [state, setState] = useState({data: null, error: null, isLoading: false})
  // const [error, setError]
  // You POST method here
  const callAPI = useCallback(() => {
    setState(prevState => ({...prevState, isLoading: true}))
    secureFetch(url, options)
      .then(res => {
        setState({data: res.data, isLoading: false, error: null})
      }).catch((error) => {
        setState({data: null, isLoading: false, error})
      })
  }, [url])
  return [state, callAPI]
}

export const useApi = (url, method = 'get', options = {}) => {
  const { getAccessTokenSilently } = useAuth0()
  const [state, setState] = useState({
    error: null,
    loading: true,
    data: null
  })
  const [refreshIndex, setRefreshIndex] = useState(0)

  useEffect(() => {
    (async () => {
      try {
        const accessToken = await getAccessTokenSilently({
          audience: process.env.AUTH0_AUDIENCE,
          scope: AUTH0_SCOPE
        })
        const res = await secureFetch(url, method, {
          ...options,
          headers: {
            ...options.headers,
            // Add the Authorization header to the existing headers
            Authorization: `Bearer ${accessToken}`,
            'x-api-key': process.env.API_KEY
          }
        })
        setState({
          ...state,
          data: await res.json(),
          error: null,
          loading: false
        })
      } catch (error) {
        setState({
          ...state,
          error,
          loading: false
        })
      }
    })()
  }, [refreshIndex])

  return [{
    ...state,
    refresh: () => setRefreshIndex(refreshIndex + 1)
  }, ]
}

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
  try {
    const res = await fetch(url, {
      method,
      ...options,
      headers: {
        ...options.headers,
        // Add the Authorization header to the existing headers
        Authorization: `Bearer ${accessToken}`,
        'x-api-key': process.env.API_KEY
      }
    })
    return {
      data: await res.json(),
      error: null,
      loading: false
    }
  } catch (error) {
    return {
      error,
      loading: false
    }
  }
}
