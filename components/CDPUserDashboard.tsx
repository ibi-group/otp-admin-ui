import React, { useState, useEffect } from 'react'
import { Alert, Badge, ListGroup, ListGroupItem } from 'react-bootstrap'
import { WithAuth0Props, withAuth0 } from '@auth0/auth0-react'

import { secureFetch } from '../util/middleware'
import type { CDPUser } from '../types/user'
import type { CDPFile } from '../types/response'
import { getDateFromCDPFileName } from '../util/ui'

type Props = { cdpUser?: CDPUser } & WithAuth0Props
type CDPZipProps = {
  downloading: boolean // TODO: currently unused, but could provide useful feedback
  file: CDPFile
  onClick: (key: string) => void
}

const CDP_FILES_URL = `${process.env.API_BASE_URL}/api/secure/connected-data`
const DOWNLOAD_FILE_URL = `${CDP_FILES_URL}/download`

/** Component which renders a single CDP zip entry */
const CDPZip = (props: CDPZipProps): JSX.Element => (
  <ListGroupItem
    action
    as="button"
    className="d-flex justify-content-between align-items-start"
    onClick={() => props.onClick(props.file.key)}
    title={`Download ${props.file.key}`}
  >
    <div className="ms-2 me-auto">
      <div>{getDateFromCDPFileName(props.file.key)}</div>
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
  const [currentlyDownloadingFile, setCurrentlyDownloadingFile] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setServerResponse(await secureFetch(url, auth0, 'GET'))
    }
    fetchData()
  }, [url, auth0])

  // When the file to download changes, get a download link from the server and download it
  useEffect(() => {
    const fetchData = async () => {
      if (!currentlyDownloadingFile) return

      const { data: downloadLink } = await secureFetch(
        `${DOWNLOAD_FILE_URL}?key=${currentlyDownloadingFile}`,
        auth0,
        'GET'
      )

      // Download a file in the background.
      // This appears to be the cleanest way to do it...

      // Create fake download anchor
      const fakeDownloadLink = document.createElement('a')
      fakeDownloadLink.download = currentlyDownloadingFile
      fakeDownloadLink.href = downloadLink

      // Add fake download anchor to DOM
      document.body.appendChild(fakeDownloadLink)

      // Click the fake link
      fakeDownloadLink.click()

      // Cleanup
      document.body.removeChild(fakeDownloadLink)
      setCurrentlyDownloadingFile('')
    }

    fetchData()
  }, [auth0, currentlyDownloadingFile])

  let files = Object.keys(swrData).length > 0 ? swrData?.data?.data : []
  files = files
    ?.filter((file: CDPFile) => file?.size > 0)
    // Negative sorts "reverse alphabetically" which allows newest files to appear first
    .sort((a: CDPFile, b: CDPFile) => -a.key.localeCompare(b.key))

  return (
    <>
      <h3>CDP Dashboard</h3>
      {cdpUser && <p>I have your user object. Your name is {cdpUser.name}</p>}
      {files?.length === 0 && (
        <Alert variant="info">
          <Alert.Heading>Loading...</Alert.Heading>
        </Alert>
      )}
      <ListGroup as="ul">
        {files?.map((file: CDPFile) => (
          <CDPZip
            downloading={file.key === currentlyDownloadingFile}
            file={file}
            key={file.key}
            onClick={setCurrentlyDownloadingFile}
          />
        ))}
      </ListGroup>
    </>
  )
}

export default withAuth0(CDPUserDashboard)
