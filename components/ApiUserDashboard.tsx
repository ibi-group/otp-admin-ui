import React from 'react'
import { Alert, Button, ButtonProps } from 'react-bootstrap'

import { ApiUser } from '../types/user'
import { OTP_PLAN_URL } from '../util/constants'

import ApiKeyList from './ApiKeyList'
import EmailForApiKeyMessage from './EmailForApiKeyMessage'
import RequestLogsDashboard from './RequestLogsDashboard'

// Hack needed for typescript to be happy with a Button that has a rel prop
const ButtonWithRel = (props: ButtonProps & { rel: string }) => (
  <Button {...props} />
)

/**
 * The high-level component visible to an ApiUser when they log in. This
 * describes the user's API keys, points to some docs, and shows API key usage.
 */
const ApiUserDashboard = (props: {
  apiUser: ApiUser
  clearWelcome: () => void
  showWelcome: boolean
}): JSX.Element => {
  const { apiUser, clearWelcome, showWelcome } = props
  // Sample OTP URL to show in sample CURL command
  // TODO: Make configurable (for deployments in other areas).
  const samplePlanUrl = `${OTP_PLAN_URL}?fromPlace=P%26R%3A%3A28.45119%2C-81.36818&toPlace=Downtownish%3A%3A28.54834%2C-81.37745`
  // Use the first API key value in the sample CURL command.
  const sampleKey = apiUser.apiKeys[0] ? apiUser.apiKeys[0].value : null
  return (
    <>
      {showWelcome && (
        <Alert dismissible onClose={clearWelcome} variant="success">
          <Alert.Heading>API User Created!</Alert.Heading>
          <p>
            Welcome to your new API User account. To get started, check out your
            API keys below.
          </p>
        </Alert>
      )}
      <h3>{apiUser.appName} API Keys</h3>
      <Alert variant="info">
        <Alert.Heading>API Key Instructions</Alert.Heading>
        <p>
          Below you will find your API keys to make requests to the trip
          planner. These keys should only be used for testing because the
          request limit is heavily restricted.
        </p>
        <EmailForApiKeyMessage />
      </Alert>
      <ApiKeyList apiUser={apiUser} />
      <div className="mb-5">
        <h3>Interacting with the RMCE API</h3>
        {sampleKey ? (
          <div>
            <p>
              <strong>Tip:</strong> Try planning a trip with the following CURL
              command:
            </p>
            <pre>{`curl -H 'x-api-key: ${sampleKey}' '${samplePlanUrl}'`}</pre>
            <p>
              <strong>Note:</strong> copy/paste the API key values below for use
              in the <code>x-api-key</code> header when making any request to
              the RMCE API.
            </p>
          </div>
        ) : null}
        <p>
          <ButtonWithRel
            block
            href={
              process.env.API_DOCUMENTATION_URL ||
              'https://fdot-support.s3.amazonaws.com/index.html'
            }
            rel="noopener noreferrer"
            size="lg"
            target="_blank"
            variant="primary"
          >
            View Complete API documentation
          </ButtonWithRel>
        </p>
      </div>
      <RequestLogsDashboard />
    </>
  )
}

export default ApiUserDashboard
