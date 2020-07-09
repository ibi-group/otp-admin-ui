import Head from 'next/head'
import React, { Component } from 'react'
import { withAuth } from 'use-auth0-hooks'

import VerifyEmailScreen from '../components/verify-email-screen'
import { ADMIN_USER_PATH, API_USER_PATH, AUTH0_SCOPE } from '../util/constants'
import { fetchUser as fetchUserRaw } from '../util/middleware'
import { renderChildrenWithProps } from '../util/ui'
import NavBar from './NavBar'

/**
 * Fetches user preferences, or if none available, make an initial user preference object, and return the result.
 */
export async function fetchUser (route, proc, auth) {
  const { accessToken } = auth

  try {
    const result = await fetchUserRaw(route, proc, accessToken)

    // Beware! On AWS API gateway, if a user is not found in the middleware
    // (e.g. they just created their Auth0 password but have not completed the account setup form yet),
    // the call above will return, for example:
    // {
    //    status: 'success',
    //    data: {
    //      "result": "ERR",
    //      "message": "No user with id=000000 found.",
    //      "code": 404,
    //      "detail": null
    //    }
    // }
    //
    // The same call to a middleware instance that is not behind an API gateway
    // will return:
    // {
    //    status: 'error',
    //    message: 'Error get-ing user...'
    // }
    // TODO: Improve AWS response.

    const resultData = result.data
    const isNewAccount = result.status === 'error' || (resultData && resultData.result === 'ERR')

    if (!isNewAccount) {
      return resultData
    } else {
      return null
    }
  } catch (error) {
    // TODO: improve error handling.
    alert(`An error was encountered:\n${error}`)
  }
}

class MyLayout extends Component {
  constructor () {
    super()

    this.state = {
      adminUser: null,
      apiUser: null,
      isUserFetched: false,
      isUserRequested: false
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

      const adminUser = await fetchUser(`${process.env.API_BASE_URL}${ADMIN_USER_PATH}`, process.env.API_KEY, auth)
      const apiUser = await fetchUser(`${process.env.API_BASE_URL}${API_USER_PATH}`, process.env.API_KEY, auth)

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
    const { isAuthenticated, user } = auth

    let contents
    if (isAuthenticated && user && !user.email_verified) {
      contents = <VerifyEmailScreen />
    } else {
      contents = renderChildrenWithProps(children, this.state) // TODO: find a better way to pass props to children.
    }

    return (
      <div>
        <Head>
          <title>OTP Admin Dashboard</title>
        </Head>
        <NavBar />
        <main>
          <div className='container'>
            {contents}
          </div>
        </main>
        <style jsx>{`
          .container {
            max-width: 42rem;
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

export default withAuth(MyLayout, {
  audience: process.env.AUTH0_AUDIENCE,
  scope: AUTH0_SCOPE
})
