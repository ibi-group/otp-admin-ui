import moment from 'moment'
import { Spinner } from 'react-bootstrap'

function FetchMessage ({ data, error }) {
  const timestamp = moment().format('h:mm:ss a')
  const fetchMessage = error
    ? `Failed to update! (${timestamp})`
    : !data
      ? <Spinner animation='border' role='status'>
        <span className='sr-only'>Loading...</span>
      </Spinner>
      : `Updated at ${timestamp}`
  return <span>{fetchMessage}</span>
}

export default FetchMessage
