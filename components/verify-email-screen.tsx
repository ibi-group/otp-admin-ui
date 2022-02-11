import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { withRouter } from 'next/router'
import { Button } from 'react-bootstrap'

import { API_USER_URL } from '../util/constants'
import { secureFetch } from '../util/middleware'

/**
 * This component contains the prompt for the user to verify their email address.
 * It also contains a button that lets the user finish account setup.
 *
 * (One way to make sure the parent page fetches the latest email verification status
 * is to simply reload the page.)
 */
const VerifyEmailScreen = () => {
  const auth0 = useAuth0()

  const handleResendVerificationEmail = async () => {
    secureFetch(`${API_USER_URL}/verification-email`, auth0).then(() =>
      window.alert('Verification email resent!')
    )
  }

  const handleClick = () => window.location.reload()

  return (
    <div>
      <h1>Verify your email address</h1>
      <p className="mt-5">
        Please check your email inbox and follow the link in the message to
        verify your email address before finishing your account setup.
      </p>
      <p>Once you're verified, click the button below to continue.</p>
      <div className="mt-5">
        <Button onClick={handleClick} size="lg" variant="primary">
          My email is verified!
        </Button>
      </div>
      <div className="mt-4">
        <Button
          onClick={handleResendVerificationEmail}
          size="sm"
          style={{ padding: '0px' }}
          variant="link"
        >
          Resend verification email
        </Button>
      </div>
    </div>
  )
}

export default withRouter(VerifyEmailScreen)
