import { withRouter } from 'next/router'
import { Component } from 'react'
import { Button } from 'react-bootstrap'
import { withAuth } from 'use-auth0-hooks'

import { API_USER_URL, AUTH0_SCOPE } from '../util/constants'
import { secureFetch } from '../util/middleware'

/**
 * This component contains the prompt for the user to verify their email address.
 * It also contains a button that lets the user finish account setup.
 *
 * (One way to make sure the parent page fetches the latest email verification status
 * is to simply reload the page.)
 */
class VerifyEmailScreen extends Component {
  resendVerificationEmail = () => {
    const { accessToken } = this.props.auth
    if (!accessToken) {
      console.warn('No access token found.')
      return
    }
    secureFetch(`${API_USER_URL}/verification-email`, accessToken)
      .then(json => window.alert('Verification email resent!'))
  }

  _handleClick = () => window.location.reload()

  render () {
    return (
      <div>
        <h1>Verify your email address</h1>
        <p>
          Please check your email inbox and follow the link in the message
          to verify your email address before finishing your account setup.
        </p>
        <p>
          Once you're verified, click the button below to continue.
        </p>
        <Button
          size='lg'
          variant='primary'
          onClick={this._handleClick}
        >
          My email is verified!
        </Button>
        {' '}
        <Button
          size='lg'
          variant='outline-primary'
          onClick={this.resendVerificationEmail}
        >
          Resend verification email
        </Button>
      </div>
    )
  }
}

export default withRouter(withAuth(VerifyEmailScreen, {
  audience: process.env.AUTH0_AUDIENCE,
  scope: AUTH0_SCOPE
}))
