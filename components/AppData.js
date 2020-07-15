import { withRouter } from 'next/router'
import { Component } from 'react'
import { withAuth } from 'use-auth0-hooks'

import { ADMIN_USER_URL, API_USER_URL, AUTH0_SCOPE } from '../util/constants'
import { createOrUpdateUser, fetchUser } from '../util/middleware'
import { renderChildrenWithProps } from '../util/ui'

class AppData extends Component {
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
      // TODO: Combine into a single fetch fromToken.
      const adminUser = await fetchUser(ADMIN_USER_URL, process.env.API_KEY, auth)
      const apiUser = await fetchUser(API_USER_URL, process.env.API_KEY, auth)

      this.setState({
        ...state,
        adminUser,
        apiUser,
        // auth,
        isUserFetched: true,
        isUserRequested: true
      })
    }
  }

  render () {
    // TODO: find a better way to pass props to children.
    return renderChildrenWithProps(this.props.children, {...this.state, createUser: this.createUser})
  }
}

export default withRouter(
  withAuth(AppData, {
    audience: process.env.AUTH0_AUDIENCE,
    scope: AUTH0_SCOPE
  })
)
