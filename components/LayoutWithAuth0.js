import Head from 'next/head'
import { withRouter } from 'next/router'
import React, { Component } from 'react'
import { withAuth } from 'use-auth0-hooks'

import VerifyEmailScreen from '../components/verify-email-screen'
import { ADMIN_USER_URL, API_USER_URL, AUTH0_SCOPE } from '../util/constants'
import { createOrUpdateUser, fetchUser } from '../util/middleware'
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
      // TODO: Combine into a single fetch fromToken.
      const adminUser = await fetchUser(ADMIN_USER_URL, process.env.API_KEY, auth)
      const apiUser = await fetchUser(API_USER_URL, process.env.API_KEY, auth)

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
    const { auth, children } = this.props
    const { adminUser } = this.state
    const { user } = auth

    let contents
    if (user && !user.email_verified) {
      contents = <VerifyEmailScreen />
    } else {
      // TODO: find a better way to pass props to children.
      contents = renderChildrenWithProps(children, {...this.state, createUser: this.createUser})
    }

    return (
      <div>
        <Head>
          <title>OTP Admin Dashboard</title>
        </Head>
        <NavBar adminUser={adminUser} />
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
    )
  }
}

export default withRouter(
  withAuth(LayoutWithAuth0, {
    audience: process.env.AUTH0_AUDIENCE,
    scope: AUTH0_SCOPE
  })
)
