import { withAuth0 } from '@auth0/auth0-react'
import { withRouter } from 'next/router'
import { Component } from 'react'
import { Button } from 'react-bootstrap'

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
  resendVerificationEmail = async () => {
    const { getAccessTokenSilently } = this.props.auth0
    const accessToken = await getAccessTokenSilently()
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
        <p className='mt-5'>
          Please check your email inbox and follow the link in the message
          to verify your email address before finishing your account setup.
        </p>
        <p>
          Once you're verified, click the button below to continue.
        </p>
        <div className='mt-5'>
          <Button
            size='lg'
            variant='primary'
            onClick={this._handleClick}
          >
            My email is verified!
          </Button>
        </div>
        <div className='mt-4'>
          <Button
            size='sm'
            style={{padding: '0px'}}
            variant='link'
            onClick={this.resendVerificationEmail}
          >
            Resend verification email
          </Button>
        </div>
      </div>
    )
  }
}

export default withRouter(withAuth0(VerifyEmailScreen, {
  audience: process.env.AUTH0_AUDIENCE,
  scope: AUTH0_SCOPE
}))
