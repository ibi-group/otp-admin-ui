import { Alert } from 'react-bootstrap'

import RequestLogsDashboard from './RequestLogsDashboard'

const ApiUserDashboard = ({welcome}) => {
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
      <RequestLogsDashboard />
    </>
  )
}

export default ApiUserDashboard
