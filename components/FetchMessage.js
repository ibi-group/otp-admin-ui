import moment from 'moment'
import { Spinner } from 'react-bootstrap'

import { DEFAULT_REFRESH_MILLIS } from '../util/constants'

function FetchMessage ({ result }) {
  const timestamp = result.data && result.data.timestamp
  const spinner = (
    <Spinner size='sm' animation='border' role='status'>
      <span className='sr-only'>Loading...</span>
    </Spinner>
  )
  const timeString = moment(timestamp).format('h:mm:ss a')
  const fetchMessage = result.error
    ? `Failed to update! (${timeString})`
    : result.isValidating
      ? spinner
      : `Updated at ${timeString}`
  return (
    <small>
      {fetchMessage}<br />
      <small>auto-refreshes every {DEFAULT_REFRESH_MILLIS / 1000} seconds</small>
    </small>
  )
}

export default FetchMessage
