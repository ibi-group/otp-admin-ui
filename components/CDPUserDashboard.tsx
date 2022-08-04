import React, { useEffect, useState } from 'react'
import {
  Alert,
  Badge,
  ListGroup,
  ListGroupItem,
  Tab,
  Tabs
} from 'react-bootstrap'
import { WithAuth0Props, withAuth0 } from '@auth0/auth0-react'

import { secureFetch } from '../util/middleware'
import type { CDPUser } from '../types/user'
import type { CDPFile } from '../types/response'
import { getDateFromCDPFileName } from '../util/ui'

type Props = { cdpUser?: CDPUser } & WithAuth0Props
type CDPZipProps = {
  downloadedAt?: number
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
    <div className="ms-2 me-auto">{getDateFromCDPFileName(props.file.key)}</div>
    <div>
      {props.downloadedAt && (
        <Badge className="mr-1" pill variant="success">
          You last downloaded {new Date(props.downloadedAt).toDateString()}
        </Badge>
      )}
      <Badge pill variant="primary">
        {(props.file.size / 1_000).toFixed(2)} KB
      </Badge>
    </div>
  </ListGroupItem>
)

/** Component which renders a a list of CDP files */
const FileListing = ({
  cdpUser,
  downloadedFiles,
  files,
  setCurrentlyDownloadingFile
}: {
  cdpUser?: CDPUser
  downloadedFiles: string[]
  files: CDPFile[]
  setCurrentlyDownloadingFile: (file: string) => void
}): JSX.Element => (
  <>
    {files?.length === 0 && (
      <Alert variant="info">
        <Alert.Heading>Loading...</Alert.Heading>
      </Alert>
    )}
    <ListGroup as="ul">
      {files?.map((file: CDPFile) => {
        const fakeDownloadedAt =
          downloadedFiles.includes(file.key) && Date.now()
        return (
          <CDPZip
            downloadedAt={
              fakeDownloadedAt || cdpUser?.S3DownloadTimes[file.key]
            }
            file={file}
            key={file.key}
            onClick={setCurrentlyDownloadingFile}
          />
        )
      })}
    </ListGroup>
  </>
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
    error?: string
    message?: string
    status?: string
  }>({})
  const [currentlyDownloadingFile, setCurrentlyDownloadingFile] = useState('')
  // To avoid grabbing user object after every file download, we duplicate the S3Download times
  // These fake entries are kept until the user data is re-downloaded
  const [downloadedFiles, setDownloadedFiles] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setServerResponse(await secureFetch(url, auth0, 'GET'))
      // Remove local duplicate now that we have "fresh" data
      setDownloadedFiles([])
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
      setDownloadedFiles((d) => [...d, currentlyDownloadingFile])
    }

    fetchData()
  }, [auth0, currentlyDownloadingFile])

  let files = Object.keys(swrData).length > 0 ? swrData?.data?.data : []
  files = files
    ?.filter((file: CDPFile) => file?.size > 0)
    // Negative sorts "reverse alphabetically" which allows newest files to appear first
    .sort((a: CDPFile, b: CDPFile) => -a.key.localeCompare(b.key))

  const isSurveyResponse = (wanted: boolean) => (file: CDPFile) =>
    file.key.includes('survey-response') === wanted
  const surveyResponses = files.filter(isSurveyResponse(true))

  return (
    <Tabs defaultActiveKey="raw-data" fill>
      <Tab eventKey="raw-data" title="Raw Request Data Download">
        <p className="mt-3">
          These zip files contain anonymized OTP requests for the date and time
          indicated.
        </p>
        <FileListing
          cdpUser={cdpUser}
          downloadedFiles={downloadedFiles}
          files={files.filter(isSurveyResponse(false))}
          setCurrentlyDownloadingFile={setCurrentlyDownloadingFile}
        />
      </Tab>
      {surveyResponses.length > 0 && (
        <Tab eventKey="survey-data" title="Survey Response Download">
          <p className="mt-3">
            Select a date to download all survey responses from that date.
            Indivdual csv files are individual user responses.
          </p>
          <FileListing
            cdpUser={cdpUser}
            downloadedFiles={downloadedFiles}
            files={surveyResponses.sort(
              (a: CDPFile, b: CDPFile) =>
                // Sort by the number of slashes in the key name so that merged responses (not in subfolders)
                // appear first.
                (a.key.match(/\//g) || []).length >
                (b.key.match(/\//g) || []).length
            )}
            setCurrentlyDownloadingFile={setCurrentlyDownloadingFile}
          />
        </Tab>
      )}
    </Tabs>
  )
}

export default withAuth0(CDPUserDashboard)
