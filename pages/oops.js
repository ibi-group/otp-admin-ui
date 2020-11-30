import { useAuth0 } from '@auth0/auth0-react'
import React from 'react'
import { useRouter } from 'next/router'

import { logout } from '../util/auth'
import { AUTH0_SCOPE } from '../util/constants'

export default function Oops () {
  const { asPath, query } = useRouter()
  const { error } = useAuth0({
    audience: process.env.AUTH0_AUDIENCE,
    scope: AUTH0_SCOPE
  })
  // There appears to be an issue with @auth0/auth0-react, where logout does not
  // occur properly if an unauthorized user attempts login. Without the
  // logout invocation below, an attempt to re-login would not show the
  // login widget to the user for them to try again.
  if (error) logout(asPath)
  const { message } = query
  return (
    <div>
      <h1>Oops</h1>
      <p>
        An error occured when signing in!
      </p>
      <pre>
        {message || 'Unknown Error'}
      </pre>
    </div>
  )
}
