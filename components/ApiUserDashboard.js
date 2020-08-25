import { Alert } from 'react-bootstrap'

import RequestLogsDashboard from './RequestLogsDashboard'
import {OTP_PLAN_URL} from '../util/constants'

const ApiUserDashboard = (props) => {
  const {apiUser, welcome} = props
  const sampleQueryParams = `?fromPlace=P%26R%3A%3A28.45119%2C-81.36818&toPlace=Downtownish%3A%3A28.54834%2C-81.37745`
  return (
    <>
      {welcome &&
        <Alert variant='success'>
          <Alert.Heading>API User Created!</Alert.Heading>
          <p>
            Welcome to your new API User account. To get started, check out your API
            keys below.
          </p>
        </Alert>
      }
      <ul>
        {apiUser.apiKeys.map(key => {
          return (
            <li key={key.id}>API key value: <strong>{key.value}</strong></li>
          )
        })}
      </ul>
      <p>Try planning a trip with the following CURL command:</p>
      <pre><code>
        {`curl -H 'x-api-key: ${apiUser.apiKeys[0].value}' '${OTP_PLAN_URL}?${sampleQueryParams}'`}
      </code></pre>
      <p>
        Or, check out the{' '}
        <a
          href={process.env.API_DOCUMENTATION_URL}
          rel='noopener noreferrer'
          target='_blank'
        >
          API documentation
        </a>{' '}
        for more information on interacting with the RMCE API.
      </p>
      <RequestLogsDashboard />
    </>
  )
}

export default ApiUserDashboard
