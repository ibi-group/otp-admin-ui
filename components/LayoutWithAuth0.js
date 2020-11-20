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
import {
  getUserUrl,
  secureFetch,
  secureFetchHandleErrors
} from '../util/middleware'
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

  createApiUser = async (apiUser) => {
    const { auth, router } = this.props
    const { accessToken } = auth
    const result = await secureFetchHandleErrors(
      getUserUrl('api'),
      accessToken,
      'POST',
      { body: JSON.stringify(apiUser) }
    )
    if (result.status === 'error') {
      window.alert(result.message)
    } else {
      this.setState({apiUser: result})
      // TODO: Push to a success page.
      router.push('/?newApiAccount=true')
    }
  }

  _fetchUsers = async () => {
    const { accessToken } = this.props.auth
    // TODO: Combine into a single fetch fromToken or use SWR
    const adminUserResult = await secureFetchHandleErrors(`${ADMIN_USER_URL}/fromtoken`, accessToken)
    const apiUserResult = await secureFetchHandleErrors(`${API_USER_URL}/fromtoken`, accessToken)
    this.setState({
      adminUser: adminUserResult.data,
      apiUser: apiUserResult.data,
      isUserFetched: true
    })
  }

  updateUser = async ({user, type, isSelf}) => {
    const { accessToken } = this.props.auth
    const result = await secureFetchHandleErrors(
      `${getUserUrl(type)}/${user.id}`,
      accessToken,
      'PUT',
      { body: JSON.stringify(user) }
    )
    // Ensure user object gets updated at top level if updating self.
    if (isSelf) this._fetchUsers()
    if (result.status === 'error') {
      window.alert(result.message)
    }
  }

  async componentDidUpdate () {
    const { auth } = this.props
    const { accessToken, isAuthenticated } = auth
    const { isUserRequested } = this.state

    if (isAuthenticated && accessToken && !isUserRequested) {
      // Set a flag to prevent duplicate fetches while awaiting the calls below to return.
      this.setState({ isUserRequested: true })
      // Fetch and cache user data when the auth0 access token becomes available.
      this._fetchUsers()
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
        createUser: this.createApiUser,
        handleSignup,
        updateUser: this.updateUser
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
