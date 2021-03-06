import { withAuth0 } from '@auth0/auth0-react'
import Head from 'next/head'
import { withRouter } from 'next/router'
import React, { Component } from 'react'
import { SWRConfig } from 'swr'

import VerifyEmailScreen from './verify-email-screen'
import { getAuthRedirectUri } from '../util/auth'
import {
  ADMIN_USER_URL,
  API_USER_URL,
  AUTH0_SCOPE,
  DEFAULT_REFRESH_MILLIS
} from '../util/constants'
import {
  getUserUrl,
  secureFetch
} from '../util/middleware'
import { renderChildrenWithProps } from '../util/ui'
import Footer from './Footer'
import NavBar from './NavBar'

/**
 * @class
 * @description This component manages the overall UI layout
 * and forwards API access and logged-in user data to components it renders.
 */
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

  /**
   * Determines whether user data should be fetched.
   * @returns true if the logged-in user has passed Auth0 authentication
   *   and isUserFetched has not been set in the component state; false otherwise.
   */
  loggedInUserIsUnfetched = () => {
    const { auth0 } = this.props
    const { isUserFetched } = this.state
    return auth0 && auth0.isAuthenticated && !isUserFetched
  }

  createApiUser = async (apiUser) => {
    const { auth0, router } = this.props
    const result = await secureFetch(
      getUserUrl('api'),
      auth0,
      'POST',
      { body: JSON.stringify(apiUser) }
    )
    if (result.status === 'error') {
      window.alert(result.message)
    } else {
      // Refresh users.
      await this.fetchUsers()
      // TODO: Push to a success page.
      router.push('/?newApiAccount=true')
    }
  }

  fetchUsers = async () => {
    const { auth0 } = this.props
    const { isUserRequested } = this.state
    if (!isUserRequested) {
      // Set requested flag to avoid multiple requests, and void the previous user fetched state.
      // TODO: useEffect?
      this.setState({
        isUserFetched: false,
        isUserRequested: true
      })

      // TODO: Combine into a single fetch fromToken or use SWR
      const adminUserResult = await secureFetch(`${ADMIN_USER_URL}/fromtoken`, auth0)
      const apiUserResult = await secureFetch(`${API_USER_URL}/fromtoken`, auth0)
      this.setState({
        adminUser: adminUserResult.data,
        apiUser: apiUserResult.data,
        isUserFetched: true,
        isUserRequested: false
      })
    }
  }

  updateUser = async ({user, type, isSelf}) => {
    const { auth0 } = this.props
    const result = await secureFetch(
      `${getUserUrl(type)}/${user.id}`,
      auth0,
      'PUT',
      { body: JSON.stringify(user) }
    )
    // Ensure user object gets updated at top level if updating self.
    if (isSelf) this.fetchUsers()
    if (result.status === 'error') {
      window.alert(result.message)
    }
  }

  componentDidUpdate () {
    if (this.loggedInUserIsUnfetched()) {
      // Fetch and cache user data when the auth0 access token becomes available.
      this.fetchUsers()
    }
  }

  render () {
    const { auth0, children, router } = this.props
    const { pathname, query } = router
    const { adminUser, apiUser } = this.state
    const { loginWithRedirect, logout, user } = auth0
    const handleLogin = () => loginWithRedirect({ appState: { returnTo: { pathname, query } } })
    const handleLogout = () => logout({ returnTo: getAuthRedirectUri() })
    const handleSignup = () => loginWithRedirect({
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
        adminUser,
        apiUser,
        createApiUser: this.createApiUser,
        handleSignup,
        updateUser: this.updateUser
      }

      if (this.loggedInUserIsUnfetched()) {
        contents = <h1>Loading...</h1>
      } else {
        contents = renderChildrenWithProps(children, extraProps)
      }
    }

    return (
      <SWRConfig
        value={{
          fetcher: (url, method, ...props) => secureFetch(url, auth0, method, props),
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
  withAuth0(LayoutWithAuth0, {
    audience: process.env.AUTH0_AUDIENCE,
    scope: AUTH0_SCOPE
  })
)
