import React from 'react'
import { Alert } from 'react-bootstrap'

import { CDPUser } from '../types/user'
/**
 * The high-level component visible to a CDPUser when they log in. This
 * lists the s3 files the user is able to access, and presents some instructional info.
 */
const CDPUserDashboard = (props: { cdpUser: CDPUser }): JSX.Element => {
  const { cdpUser } = props
  return (
    <>
      <h3>CDP Dashboard</h3>
      <Alert variant="info">
        <Alert.Heading>Not Implemented Yet!</Alert.Heading>
        <p>This page will show CDP zip files to download</p>
      </Alert>
      <p>Your name is {cdpUser.name}</p>
    </>
  )
}

export default CDPUserDashboard
