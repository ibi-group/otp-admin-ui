import React from 'react'
import { Button, Jumbotron } from 'react-bootstrap'

import { HandleSignup } from '../types/user'

type Props = {
  handleSignup: HandleSignup
}

const WelcomeScreen = ({ handleSignup }: Props): JSX.Element => (
  <>
    <Jumbotron>
      <h1>Welcome to the {process.env.SITE_TITLE}!</h1>
      <p>
        Here, you can view documentation for and gain access to the{' '}
        {process.env.API_NAME}.
      </p>
      {process.env.API_MANAGER_ENABLED && (
        <p>
          <Button className="mr-3" onClick={handleSignup} variant="primary">
            Sign up for API access
          </Button>
          <Button
            href={process.env.API_DOCUMENTATION_URL}
            variant="outline-primary"
          >
            View API documentation
          </Button>
        </p>
      )}
    </Jumbotron>
  </>
)

export default WelcomeScreen
