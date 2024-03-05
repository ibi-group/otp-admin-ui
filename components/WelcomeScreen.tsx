import React from 'react'
import { Button, Jumbotron } from 'react-bootstrap'

import { HandleSignup } from '../types/user'
import { isApiManagerEnabled } from '../util/ui'

type Props = {
  handleSignup: HandleSignup
}

const USAGE_ID = process.env.USAGE_ID || null

const WelcomeScreen = ({ handleSignup }: Props): JSX.Element => (
  <>
    <Jumbotron>
      <h1>Welcome to the {process.env.SITE_TITLE}!</h1>
      <p>
        Here, you can view documentation for and gain access to the{' '}
        {process.env.API_NAME}.
      </p>
      {
        /* If we're specifying a USAGE_ID then we definitely don't want to
        be creating API keys in that AWS environment! */
        isApiManagerEnabled() && USAGE_ID === null && (
          <p>
            <Button className="mr-3" onClick={handleSignup} variant="primary">
              Sign up for API access
            </Button>
            {process.env.API_DOCUMENTATION_URL && (
              <Button
                href={process.env.API_DOCUMENTATION_URL}
                variant="outline-primary"
              >
                View API documentation
              </Button>
            )}
          </p>
        )
      }
    </Jumbotron>
  </>
)

export default WelcomeScreen
