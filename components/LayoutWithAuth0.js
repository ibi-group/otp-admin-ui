import Head from 'next/head'
import { withRouter } from 'next/router'
import React, { Component } from 'react'
import { SWRConfig } from 'swr'
import { withAuth } from 'use-auth0-hooks'

import VerifyEmailScreen from '../components/verify-email-screen'
import { getAuthRedirectUri } from '../util/auth'
import {
  ADMIN_USER_URL,
  API_USER_URL,
  AUTH0_SCOPE,
  DEFAULT_REFRESH_MILLIS
} from '../util/constants'
import { createOrUpdateUser, secureFetch } from '../util/middleware'
import { renderChildrenWithProps } from '../util/ui'
import Footer from './Footer'
import NavBar from './NavBar'

class LayoutWithAuth0 extends Component {
  constructor () {
    super()

    this.state = {
      adminUser: null,
      apiUser: null,
      isUserFetched: false,
      isUserRequested: false
    }
  }

  createUser = async (apiUser) => {
    const { auth, router } = this.props
    const { accessToken } = auth
    const newApiUser = await createOrUpdateUser(
      API_USER_URL,
      apiUser,
      true,
      accessToken
    )
    if (newApiUser) {
      this.setState({apiUser: newApiUser})
      // TODO: Push to a success page.
      router.push('/?newApiAccount=true')
    }
  }

  async componentDidUpdate () {
    const { auth } = this.props
    const { accessToken, isAuthenticated } = auth
    const state = this.state

    if (isAuthenticated && accessToken && !state.isUserRequested) {
      // Fetch and cache user data when the auth0 access token becomes available.

      // Set a flag to prevent duplicate fetches while awaiting the calls below to return.
      this.setState({
        ...state,
        isUserRequested: true
      })
      // TODO: Combine into a single fetch fromToken or use SWR
      const adminUser = await secureFetch(`${ADMIN_USER_URL}/fromtoken`, accessToken)
      const apiUser = await secureFetch(`${API_USER_URL}/fromtoken`, accessToken)

      this.setState({
        ...state,
        adminUser,
        apiUser,
        isUserFetched: true,
        isUserRequested: true
      })
    }
  }

  render () {
    const { auth, children, router } = this.props
    const { pathname, query } = router
    const { adminUser } = this.state
    const { accessToken, login, logout, user } = auth
    const handleLogin = () => login({ appState: { returnTo: { pathname, query } } })
    const handleLogout = () => logout({ returnTo: getAuthRedirectUri() })
    const handleSignup = () => login({
      appState: { returnTo: { pathname, query } },
      screen_hint: 'signup'
    })

    let contents
    if (user && !user.email_verified) {
      // If user is logged in, but email is not verified, force user to verify.
      contents = <VerifyEmailScreen />
    } else {
      // Otherwise, show component children.
      // TODO: find a better way to pass props to children.
      const extraProps = {
        ...this.state,
        createUser: this.createUser,
        handleSignup
      }
      contents = renderChildrenWithProps(children, extraProps)
    }
    return (
      <SWRConfig
        value={{
          fetcher: (url, method, ...props) => secureFetch(url, accessToken, method, props),
          refreshInterval: DEFAULT_REFRESH_MILLIS
        }}
      >
        <div>
          <Head>
            <title>{process.env.SITE_TITLE}</title>
          </Head>
          <NavBar
            adminUser={adminUser}
            handleLogin={handleLogin}
            handleLogout={handleLogout}
            handleSignup={handleSignup} />
          <main>
            <div className='container'>
              {contents}
            </div>
          </main>
          <Footer />
          <style jsx>{`
            .container {
              max-width: 42rem;
              min-height: 500px;
              margin: 1.5rem auto;
            }
          `}
          </style>
          <style jsx global>{`
            body {
              margin: 0;
              color: #333;
            }
          `}
          </style>
        </div>
      </SWRConfig>
    )
  }
}

export default withRouter(
  withAuth(LayoutWithAuth0, {
    audience: process.env.AUTH0_AUDIENCE,
    scope: AUTH0_SCOPE
  })
)
