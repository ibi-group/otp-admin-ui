import React, { useState, useEffect } from 'react'
import { Alert, Badge, ListGroup, ListGroupItem } from 'react-bootstrap'
import { WithAuth0Props, withAuth0 } from '@auth0/auth0-react'

import { secureFetch } from '../util/middleware'
import type { CDPUser } from '../types/user'
import type { CDPFile } from '../types/response'

type Props = { cdpUser?: CDPUser } & WithAuth0Props
type CDPZipProps = { file: CDPFile }

const CDP_FILES_URL = `${process.env.API_BASE_URL}/api/secure/connected-data`

/** Component which renders a single CDP zip entry */
const CDPZip = (props: CDPZipProps): JSX.Element => (
  <ListGroupItem
    as="a"
    className="d-flex justify-content-between align-items-start"
    href={`#/${props.file.key}`}
    title={`Download ${props.file.key}`}
  >
    <div className="ms-2 me-auto">
      <div>{props.file.key}</div>
    </div>
    <Badge pill variant="primary">
      {(props.file.size / 1_000).toFixed(2)} KB
    </Badge>
  </ListGroupItem>
)

/**
 * The high-level component visible to a CDPUser when they log in. This
 * lists the s3 files the user is able to access, and presents some instructional info.
 */
const CDPUserDashboard = (props: Props): JSX.Element => {
  const { auth0, cdpUser } = props
  const url = `${CDP_FILES_URL}`

  const [swrData, setServerResponse] = useState<{
    // TODO: Shared type
    data?: any
    message?: string
    status?: string
    error?: string
  }>({})
  useEffect(() => {
    const fetchData = async () => {
      setServerResponse(await secureFetch(url, auth0, 'GET'))
    }
    fetchData()
  }, [url, auth0])

  let files = Object.keys(swrData).length > 0 ? swrData?.data?.data : []
  files = files?.filter((file: CDPFile) => file?.size > 0)

  return (
    <>
      <h3>CDP Dashboard</h3>
      {cdpUser && <p>I have your user object. Your name is {cdpUser.name}</p>}
      {files?.length === 0 && (
        <Alert variant="info">
          <Alert.Heading>Loading</Alert.Heading>
        </Alert>
      )}
      <ListGroup as="ul">
        {files?.map((file: CDPFile) => (
          <CDPZip file={file} key={file.key} />
        ))}
      </ListGroup>
    </>
  )
}

export default withAuth0(CDPUserDashboard)
