import { Component } from 'react'
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { withAuth } from 'use-auth0-hooks'

import { API_USER_PATH, AUTH0_SCOPE } from '../util/constants'
import { addUser, updateUser } from '../util/middleware'

/**
 * Updates (or creates) a user entry in the middleware.
 */
async function createOrUpdateUser (url, userData, isNew, apiKey, accessToken) {
  let result
  if (isNew) {
    result = await addUser(url, apiKey, accessToken, userData)
  } else {
    result = await updateUser(url, apiKey, accessToken, userData)
  }

  // TODO: improve the UI feedback messages for this.
  if (result.status === 'success' && result.data) {
    alert('Your preferences have been saved.')
  } else {
    alert(`An error was encountered:\n${JSON.stringify(result)}`)
  }
}

class ApiUserSetup extends Component {
  constructor (props) {
    super(props)

    this.state = {
      apiUser: {
        appName: null,
        appPurpose: null,
        appUrl: null,
        company: null,
        hasConsentedToTerms: false,
        name: null
      }
    }
  }

  handleChange = field => e => {
    const newData = {}
    newData[field] = e.target.value
    this.updateUserState(newData)
  }

  handleTermsChange = e => {
    this.updateUserState({ hasConsentedToTerms: e.target.checked })
  }

  handleCreateAccount = async e => {
    // Don't submit the form through the <form> way.
    e.preventDefault()

    const { auth } = this.props
    if (auth.user) {
      const { apiUser } = this.state

      // Add required attributes for middleware storage.
      apiUser.auth0UserId = auth.user.sub
      apiUser.email = auth.user.email

      await createOrUpdateUser(`${process.env.API_BASE_URL}${API_USER_PATH}`, apiUser, true, process.env.API_KEY, auth.accessToken)
    } else {
      alert('Could not save your data (Auth0 id was not available).')
    }
  }

  updateUserState = newUserData => {
    const { apiUser } = this.state
    this.setState({
      apiUser: {
        ...apiUser,
        ...newUserData
      }
    })
  }

  render () {
    const {
      appName,
      appPurpose,
      appUrl,
      company,
      hasConsentedToTerms,
      name
    } = this.state.apiUser

    return (
      <div>
        <h1>Sign up for API access</h1>

        <Form>
          <Container>
            <Row>
              <Col>
                <Card>
                  <Card.Header>Developer information</Card.Header>
                  <Card.Body>
                    <Form.Group>
                      <Form.Label>Developer name</Form.Label>
                      <Form.Control onChange={this.handleChange('name')} type='text' value={name} />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Company</Form.Label>
                      <Form.Control onChange={this.handleChange('company')} type='text' value={company} />
                    </Form.Group>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card>
                  <Card.Header>Application information</Card.Header>
                  <Card.Body>
                    <Form.Group>
                      <Form.Label>Application name</Form.Label>
                      <Form.Control onChange={this.handleChange('appName')} type='text' value={appName} />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Application purpose</Form.Label>
                      <Form.Control onChange={this.handleChange('appPurpose')} type='text' value={appPurpose} />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Application URL</Form.Label>
                      <Form.Control onChange={this.handleChange('appUrl')} type='text' value={appUrl} />
                    </Form.Group>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>

          <Form.Group>
            <Form.Check type='checkbox'>
              <Form.Check.Input onChange={this.handleTermsChange} type='checkbox' value={hasConsentedToTerms} />
              <Form.Check.Label>I have read and consent to the <a href='/'>Terms of Service</a> for using the FDOT RMCE API.</Form.Check.Label>
            </Form.Check>
            <Form.Text>You must agree to the terms to continue.</Form.Text>
          </Form.Group>

          <Button
            disabled={!hasConsentedToTerms}
            onClick={this.handleCreateAccount}
            type='submit'
            variant='primary'
          >
            Create account
          </Button>
        </Form>
      </div>
    )
  }
}

export default withAuth(ApiUserSetup, {
  audience: process.env.AUTH0_AUDIENCE,
  scope: AUTH0_SCOPE
})
