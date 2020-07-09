import { Component } from 'react'
import { withAuth } from 'use-auth0-hooks'

import { AUTH0_SCOPE } from '../util/constants'

class ApiUserSetup extends Component {
  constructor(props) {
    super(props)
  }

  render () {
    const { auth } = this.props

    return (
      <div>
        <h1>Sign up for API access</h1>

        <h2>Developer information</h2>
        <div>Developer name</div>
        <div>Developer company</div>

        <h2>Application information</h2>
        <div>Application name</div>
        <div>Application purpose</div>
        <div>Application URL</div>

        <div>I have read and consent to the <a href=''>Terms of Service</a> for using the FDOT RMCE API.</div>

        <button onClick={this.handleCancel}>Cancel</button>
        <button onClick={this.handleCreateAccount}>Create account</button>
      </div>
    )
  }
}

export default withAuth(ApiUserSetup, {
  audience: process.env.AUTH0_AUDIENCE,
  scope: AUTH0_SCOPE
})
