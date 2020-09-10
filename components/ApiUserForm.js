import clone from 'clone'
import { Formik } from 'formik'
import { Component } from 'react'
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { withAuth } from 'use-auth0-hooks'
import * as yup from 'yup'

import { AUTH0_SCOPE } from '../util/constants'

// The validation schema for the form fields.
const validationSchema = yup.object({
  appName: yup.string().required('Please enter your application name.'),
  appPurpose: yup.string(),
  appUrl: yup.string().url('Please enter a valid URL (should start with http:// or https://), or leave blank if unknown.'),
  company: yup.string().required('Please enter your company name.'),
  hasConsentedToTerms: yup.boolean().oneOf([true], 'You must agree to the terms to continue.'),
  name: yup.string().required('Please enter your name.')
})

/**
 * Creates a blank ApiUser object to be filled out.
 */
function createBlankApiUser () {
  return {
    appName: '',
    appPurpose: '',
    appUrl: '',
    company: '',
    hasConsentedToTerms: false,
    name: ''
  }
}

/**
 * The basic form for creating an ApiUser, including input validation.
 * This can also be used to show a disabled view of the form (for viewing user details).
 *
 * TODO: Add the ability to update a user?
 */
class ApiUserForm extends Component {
  handleCreateAccount = async apiUserData => {
    const { auth, createUser } = this.props
    if (auth.user) {
      const apiUser = clone(apiUserData)

      // Add required attributes for middleware storage.
      apiUser.auth0UserId = auth.user.sub
      apiUser.email = auth.user.email

      createUser(apiUser)
    } else {
      alert('Could not save your data (Auth0 id was not available).')
    }
  }

  render () {
    const { createUser } = this.props
    // If the ApiUser already exists, it is passed from props.
    // Otherwise, it is a new ApiUser, and a blank one is created.
    const apiUser = this.props.apiUser || createBlankApiUser()

    // We display validation for a particular field on blur (after the user finishes typing in it),
    // so it is not too disruptive to the user.
    // The onBlur/onHandleBlur and touched props are used to that effect.
    // All field validation errors are also shown when the user clicks Create Account.
    return (
      <div>
        {createUser && <h1>Sign up for API access</h1>}
        <Formik
          validateOnChange={false}
          validateOnBlur
          validationSchema={validationSchema}
          onSubmit={this.handleCreateAccount}
          initialValues={apiUser}
        >
          {({
            handleBlur,
            handleSubmit,
            handleChange,
            values,
            touched,
            errors
          }) => (

            <Form noValidate onSubmit={handleSubmit}>
              <Container style={{paddingLeft: 0, paddingRight: 0}}>
                <Row>
                  <Col>
                    <Card>
                      <Card.Header>Developer information</Card.Header>
                      <Card.Body>
                        <Form.Group>
                          <Form.Label>Developer name</Form.Label>
                          <Form.Control
                            disabled={!createUser}
                            isInvalid={touched.name && !!errors.name}
                            name='name'
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type='text'
                            value={values.name}
                          />
                          <Form.Control.Feedback type='invalid'>
                            {errors.name}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group>
                          <Form.Label>Company</Form.Label>
                          <Form.Control
                            disabled={!createUser}
                            isInvalid={touched.company && !!errors.company}
                            name='company'
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type='text'
                            value={values.company}
                          />
                          <Form.Control.Feedback type='invalid'>
                            {errors.company}
                          </Form.Control.Feedback>
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
                            isInvalid={touched.appName && !!errors.appName}
                            name='appName'
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type='text'
                            value={values.appName}
                          />
                          <Form.Control.Feedback type='invalid'>
                            {errors.appName}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group>
                          <Form.Label>Application purpose</Form.Label>
                          <Form.Control
                            disabled={!createUser}
                            isInvalid={touched.appPurpose && !!errors.appPurpose}
                            name='appPurpose'
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type='text'
                            value={values.appPurpose}
                          />
                          <Form.Control.Feedback type='invalid'>
                            {errors.appPurpose}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group>
                          <Form.Label>Application URL</Form.Label>
                          <Form.Control
                            disabled={!createUser}
                            isInvalid={touched.appUrl && !!errors.appUrl}
                            name='appUrl'
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type='text'
                            value={values.appUrl}
                          />
                          <Form.Control.Feedback type='invalid'>
                            {errors.appUrl}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Container>

              <div className='mt-3'>
                <Form.Group>
                  <Form.Check
                    checked={values.hasConsentedToTerms}
                    disabled={!createUser}
                    feedback={errors.hasConsentedToTerms}
                    isInvalid={touched.hasConsentedToTerms && !!errors.hasConsentedToTerms}
                    label={
                      <>
                        I have read and consent to the{' '}
                        <a href='/' target='_blank' rel='noopener noreferrer'>Terms of Service</a>{' '}
                        for using the {process.env.API_NAME}.
                      </>
                    }
                    name='hasConsentedToTerms'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type='checkbox'
                  />
                </Form.Group>
              </div>
              {createUser &&
              <Button
                type='submit'
                variant='primary'
              >
                Create account
              </Button>
              }
            </Form>
          )}

        </Formik>
      </div>
    )
  }
}

export default withAuth(ApiUserForm, {
  audience: process.env.AUTH0_AUDIENCE,
  scope: AUTH0_SCOPE
})
