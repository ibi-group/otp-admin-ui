import { Component } from 'react'
import { Alert, Button } from 'react-bootstrap'

import ApiKeyList from './ApiKeyList'
import RequestLogsDashboard from './RequestLogsDashboard'
import {OTP_PLAN_URL} from '../util/constants'

/**
 * The high-level component visible to an ApiUser when they log in. This
 * describes the user's API keys, points to some docs, and shows API key usage.
 */
class ApiUserDashboard extends Component {
  render () {
    const {apiUser, clearWelcome, showWelcome} = this.props
    // Sample OTP URL to show in sample CURL command
    // TODO: Make configurable (for deployments in other areas).
    const samplePlanUrl = `${OTP_PLAN_URL}?fromPlace=P%26R%3A%3A28.45119%2C-81.36818&toPlace=Downtownish%3A%3A28.54834%2C-81.37745`
    // Use the first API key value in the sample CURL command.
    const sampleKey = apiUser.apiKeys[0] ? apiUser.apiKeys[0].value : null
    return (
      <>
        {showWelcome &&
          <Alert
            variant='success'
            onClose={clearWelcome}
            dismissible
          >
            <Alert.Heading>API User Created!</Alert.Heading>
            <p>
              Welcome to your new API User account. To get started, check out
              your API keys below.
            </p>
          </Alert>
        }
        <h3>{apiUser.appName} API Keys</h3>
        <Alert variant='info'>
          Note: copy/paste the API key values below for use in
          the <code>x-api-key</code> header when making any request to the RMCE
          API.
        </Alert>
        <ApiKeyList apiUser={apiUser} />
        <h3>Interacting with the RMCE API</h3>
        {sampleKey
          ? <div>
            <p>
              <strong>Tip:</strong>{' '}
              Try planning a trip with the following CURL command:
            </p>
            <pre>
              {`curl -H 'x-api-key: ${sampleKey}' '${samplePlanUrl}'`}
            </pre>
          </div>
          : null
        }
        <p>
          <Button
            variant='primary'
            size='lg'
            // FIXME: Why is this env variable undefined?
            href={process.env.API_DOCUMENTATION_URL || 'https://fdot-support.s3.amazonaws.com/index.html'}
            rel='noopener noreferrer'
            target='_blank'
            block>
            View Complete API documentation
          </Button>
        </p>
        <RequestLogsDashboard />
      </>
    )
  }
}

export default ApiUserDashboard
