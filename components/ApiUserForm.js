import { Component } from 'react'
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { withAuth } from 'use-auth0-hooks'

import { AUTH0_SCOPE } from '../util/constants'

/**
 * The basic form for creating an ApiUser. This can also be used to show a
 * disabled view of the form (for viewing user details).
 *
 * TODO: Add the ability to update a user?
 */
class ApiUserForm extends Component {
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
    const { auth, createUser } = this.props
    if (auth.user) {
      const { apiUser } = this.state
      // Add required attributes for middleware storage.
      apiUser.auth0UserId = auth.user.sub
      apiUser.email = auth.user.email
      createUser(apiUser)
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
    const { createUser } = this.props
    // Default values to apiUser passed from props. Otherwise, use original state.
    // It is assumed that if coming from props, the apiUser already exists.
    const apiUser = this.props.apiUser || this.state.apiUser
    const {
      appName,
      appPurpose,
      appUrl,
      company,
      hasConsentedToTerms,
      name
    } = apiUser

    return (
      <div>
        {createUser && <h1>Sign up for API access</h1>}
        <Form>
          <Container>
            <Row>
              <Col>
                <Card>
                  <Card.Header>Developer information</Card.Header>
                  <Card.Body>
                    <Form.Group>
                      <Form.Label>Developer name</Form.Label>
                      <Form.Control
                        disabled={!createUser}
                        onChange={this.handleChange('name')}
                        type='text'
                        value={name} />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Company</Form.Label>
                      <Form.Control
                        disabled={!createUser}
                        onChange={this.handleChange('company')}
                        type='text'
                        value={company} />
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
                      <Form.Control
                        disabled={!createUser}
                        onChange={this.handleChange('appName')}
                        type='text'
                        value={appName} />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Application purpose</Form.Label>
                      <Form.Control
                        disabled={!createUser}
                        onChange={this.handleChange('appPurpose')}
                        type='text'
                        value={appPurpose} />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Application URL</Form.Label>
                      <Form.Control
                        disabled={!createUser}
                        onChange={this.handleChange('appUrl')}
                        type='text'
                        value={appUrl} />
                    </Form.Group>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>

          <Form.Group>
            <Form.Check
              disabled={!createUser}
              id='hasConsentedToTerms'
              label={
                <>
                  I have read and consent to the{' '}
                  <a href='/' target='_blank' rel='noopener noreferrer'>Terms of Service</a>{' '}
                  for using the FDOT RMCE API.
                </>
              }
              onChange={this.handleTermsChange}
              type='checkbox'
              checked={hasConsentedToTerms}
            />
            <Form.Text muted>You must agree to the terms to continue.</Form.Text>
          </Form.Group>
          {createUser &&
            <Button
              disabled={!hasConsentedToTerms}
              onClick={this.handleCreateAccount}
              variant='primary'
            >
              Create account
            </Button>
          }
        </Form>
      </div>
    )
  }
}

export default withAuth(ApiUserForm, {
  audience: process.env.AUTH0_AUDIENCE,
  scope: AUTH0_SCOPE
})
