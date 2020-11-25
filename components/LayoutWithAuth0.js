import { withAuth0 } from '@auth0/auth0-react'
import Head from 'next/head'
import { withRouter } from 'next/router'
import { Component } from 'react'
import { SWRConfig } from 'swr'

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
      // Allows to fetch the Auth0 access token once and pass it where needed.
      accessToken: null,
      adminUser: null,
      apiUser: null,
      isUserFetched: false,
      isUserRequested: false
    }
  }

  /**
   * Determines whether an auth0 token should be fetched.
   * @returns true if the logged-in user has passed Auth0 authentication
   *   and accessToken has not been set in the component state; false otherwise.
   */
  acccessTokenIsUnfetched = () => {
    const { auth0 } = this.props
    const { accessToken } = this.state
    return auth0 && auth0.isAuthenticated && !accessToken
  }

  /**
   * Determines whether user data should be fetched.
   * @returns true if the logged-in user has passed Auth0 authentication
   *   and isUserRequested has not been set in the component state; false otherwise.
   */
  loggedInUserIsUnfetched = () => {
    const { auth0 } = this.props
    const { isUserRequested } = this.state
    return auth0 && auth0.isAuthenticated && !isUserRequested
  }

  createApiUser = async (apiUser) => {
    const { router } = this.props
    const { accessToken } = this.state
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
    const { accessToken } = this.state
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
    const { accessToken } = this.state
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
    const { auth0 } = this.props

    if (this.acccessTokenIsUnfetched()) {
      const accessToken = await auth0.getAccessTokenSilently()
      this.setState({ accessToken })
    } else if (this.loggedInUserIsUnfetched()) {
      // Set a flag to prevent duplicate fetches while awaiting the calls below to return.
      this.setState({ isUserRequested: true })
      // Fetch and cache user data when the auth0 access token becomes available.
      this._fetchUsers()
    }
  }

  render () {
    const { auth0, children, router } = this.props
    const { pathname, query } = router
    const { accessToken, adminUser } = this.state
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

export default withRouter(withAuth0(LayoutWithAuth0))
