import clone from 'clone'
import { Field, Formik } from 'formik'
import { Component } from 'react'
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { withAuth0 } from '@auth0/auth0-react'
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

// Field layout (assumes all text fields)
const fieldLayout = [
  {
    title: 'Developer information',
    fields: [
      {
        title: 'Developer name',
        field: 'name'
      },
      {
        title: 'Company',
        field: 'company'
      }
    ]
  },
  {
    title: 'Application information',
    fields: [
      {
        title: 'Application name',
        field: 'appName'
      },
      {
        title: 'Application purpose',
        field: 'appPurpose'
      },
      {
        title: 'Application URL',
        field: 'appUrl'
      }
    ]
  }
]

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
            handleSubmit,
            touched,
            errors
          }) => (

            <Form noValidate onSubmit={handleSubmit}>
              <Container style={{paddingLeft: 0, paddingRight: 0}}>
                <Row>
                  {
                    fieldLayout.map((col, colIndex) => (
                      <Col key={colIndex}>
                        <Card>
                          <Card.Header>{col.title}</Card.Header>
                          <Card.Body>
                            {
                              col.fields.map((field, fieldIndex) => {
                                const fieldName = field.field
                                return (
                                  <Form.Group key={fieldIndex}>
                                    <Form.Label>{field.title}</Form.Label>
                                    <Field
                                      as={Form.Control}
                                      disabled={!createUser}
                                      isInvalid={touched[fieldName] && !!errors[fieldName]}
                                      name={fieldName}
                                      // onBlur, onChange, and value are passed automatically.
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                      {errors[fieldName]}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                )
                              })
                            }
                          </Card.Body>
                        </Card>
                      </Col>
                    ))
                  }
                </Row>
              </Container>

              <div className='mt-3'>
                <Form.Group>
                  <Field
                    as={Form.Check}
                    disabled={!createUser}
                    feedback={errors.hasConsentedToTerms}
                    id='hasConsentedToTerms'
                    isInvalid={touched.hasConsentedToTerms && !!errors.hasConsentedToTerms}
                    label={
                      <>
                        I have read and consent to the{' '}
                        <a href='/' target='_blank' rel='noopener noreferrer'>Terms of Service</a>{' '}
                        for using the {process.env.API_NAME}.
                      </>
                    }
                    name='hasConsentedToTerms'
                    // onBlur, onChange, and value are passed automatically.
                  />
                </Form.Group>
              </div>
              {createUser &&
              <Button type='submit' variant='primary'>
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

export default withAuth0(ApiUserForm, {
  audience: process.env.AUTH0_AUDIENCE,
  scope: AUTH0_SCOPE
})
