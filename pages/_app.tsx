import React from 'react'
import { AppState, Auth0Provider } from '@auth0/auth0-react'
import App from 'next/app'
import Router from 'next/router'

import LayoutWithAuth0 from '../components/LayoutWithAuth0'
import { getAuthRedirectUri } from '../util/auth'
import { AUTH0_SCOPE } from '../util/constants'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-vis/dist/style.css'
import { AuthError } from '../types/user'

/**
 * Where to send the user after they have signed in.
 */
const onRedirectCallback = (appState: AppState) => {
  if (appState && appState.returnTo) {
    Router.push(appState.returnTo)
  }
}

/**
 * When it hasn't been possible to retrieve a new access token.
 * @param {Error} err
 * @param {AccessTokenRequestOptions} options
 */
const onAccessTokenError = (err: string) => {
  console.error('Failed to retrieve access token: ', err)
}

/**
 * When signing in fails for some reason, we want to show it here.
 * @param {Error} err
 */
const onLoginError = (err: AuthError) => {
  Router.push({
    pathname: '/oops',
    query: {
      message: err.error_description || err.message
    }
  })
}

/**
 * When redirecting to the login page you'll end up in this state where the login page is still loading.
 * You can render a message to show that the user is being redirected.
 */
const onRedirecting = () => {
  return (
    <div>
      <h1>Signing you in</h1>
      <p>
        In order to access this page you will need to sign in. Please wait while
        we redirect you to the login page...
      </p>
    </div>
  )
}

/**
 * Create a page which wraps the Auth0 provider.
 */
export default class Root extends App {
  render(): JSX.Element {
    const { Component, pageProps } = this.props

    if (!process.env.AUTH0_CLIENT_ID) {
      return (
        <>
          Missing important env variable <code>AUTH0_CLIENT_ID</code>!
        </>
      )
    }

    if (!process.env.AUTH0_DOMAIN) {
      return (
        <>
          Missing important env variable <code>AUTH0_DOMAIN</code>!
        </>
      )
    }

    return (
      <Auth0Provider
        audience={process.env.AUTH0_AUDIENCE}
        clientId={process.env.AUTH0_CLIENT_ID}
        domain={process.env.AUTH0_DOMAIN}
        onAccessTokenError={onAccessTokenError}
        onLoginError={onLoginError}
        onRedirectCallback={onRedirectCallback}
        onRedirecting={onRedirecting}
        redirectUri={getAuthRedirectUri()}
        scope={AUTH0_SCOPE}
      >
        <LayoutWithAuth0>
          <Component {...pageProps} />
          <style global jsx>
            {`
              * {
                font-family: -apple-system, BlinkMacSystemFont, avenir next,
                  avenir, segoe ui, helvetica neue, helvetica, Ubuntu, roboto,
                  noto, arial, sans-serif;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }
            `}
          </style>
        </LayoutWithAuth0>
      </Auth0Provider>
    )
  }
}
