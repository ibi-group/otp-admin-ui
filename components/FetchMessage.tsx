import React from 'react'
import moment from 'moment'
import { Spinner } from 'react-bootstrap'
import { responseInterface } from 'swr'

function FetchMessage({
  result
}: {
  result: responseInterface<{ timestamp: number }, string>
}): JSX.Element {
  const timestamp = result.data && result.data.timestamp
  const spinner = (
    <Spinner animation="border" role="status" size="sm">
      <span className="sr-only">Loading...</span>
    </Spinner>
  )
  const timeString = moment(timestamp).format('h:mm:ss a')
  const fetchMessage = result.error
    ? `Failed to update! (${timeString})`
    : result.isValidating
    ? spinner
    : `Updated at ${timeString}`
  return <small>{fetchMessage}</small>
}

export default FetchMessage
