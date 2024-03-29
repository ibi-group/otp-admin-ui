import React, { Component } from 'react'
import { Auth0ContextInterface, withAuth0 } from '@auth0/auth0-react'
import clone from 'clone'
import { Field, Formik } from 'formik'
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import * as yup from 'yup'

import { ApiUser } from '../types/user'
import { getTermsAndPrivacyPaths } from '../util/ui'

// The validation schema for the ApiUser fields.
const validationSchema = yup.object({
  appName: yup.string().required('Please enter your application name.'),
  appPurpose: yup.string(),
  appUrl: yup
    .string()
    .url(
      'Please enter a valid URL (should start with http:// or https://), or leave blank if unknown.'
    ),
  company: yup.string().required('Please enter your company name.'),
  hasConsentedToTerms: yup
    .boolean()
    .oneOf([true], 'You must agree to the terms to continue.'),
  name: yup.string().required('Please enter your name.')
})

// Field layout (assumes all text fields)
const fieldLayout = [
  {
    fields: [
      {
        field: 'name',
        title: 'Developer name'
      },
      {
        field: 'company',
        title: 'Company'
      }
    ],
    title: 'Developer information'
  },
  {
    fields: [
      {
        field: 'appName',
        title: 'Application name'
      },
      {
        field: 'appPurpose',
        title: 'Application purpose'
      },
      {
        field: 'appUrl',
        title: 'Application URL'
      }
    ],
    title: 'Application information'
  }
]

/**
 * Creates a blank ApiUser object to be filled out.
 */
function createBlankApiUser() {
  return {
    appName: '',
    appPurpose: '',
    appUrl: '',
    company: '',
    hasConsentedToTerms: false,
    name: ''
  }
}

type Props = {
  apiUser?: ApiUser
  auth0: Auth0ContextInterface
  createApiUser?: (user: ApiUser) => Promise<void>
}

/**
 * The basic form for creating an ApiUser, including input validation.
 * This can also be used to show a disabled view of the form (for viewing user details).
 *
 * TODO: Add the ability to update a user?
 */
class ApiUserForm extends Component<Props> {
  handleCreateAccount = async (apiUserData: ApiUser) => {
    const { auth0, createApiUser } = this.props
    const { user: auth0User } = auth0
    if (auth0User) {
      const apiUser = clone(apiUserData)

      // Add required attributes for middleware storage.
      apiUser.auth0UserId = auth0User.sub
      apiUser.email = auth0User.email

      if (createApiUser) createApiUser(apiUser)
    } else {
      alert('Could not save your data (Auth0 id was not available).')
    }
  }

  render() {
    const { createApiUser } = this.props
    // If the ApiUser already exists, it is passed from props.
    // Otherwise, it is a new ApiUser, and a blank one is created.
    const apiUser = this.props.apiUser || createBlankApiUser()
    const { privacyPath } = getTermsAndPrivacyPaths()

    // We display validation for a particular field on blur (after the user finishes typing in it),
    // so it is not too disruptive to the user.
    // The onBlur/onHandleBlur and touched props are used to that effect.
    // All field validation errors are also shown when the user clicks Create Account.
    return (
      <div>
        {createApiUser && <h1>Sign up for API access</h1>}
        <Formik
          initialValues={apiUser}
          onSubmit={this.handleCreateAccount}
          validateOnBlur
          validateOnChange={false}
          validationSchema={validationSchema}
        >
          {({ errors, handleSubmit, touched }) => (
            // @ts-ignore
            <Form noValidate onSubmit={handleSubmit}>
              <Container style={{ paddingLeft: 0, paddingRight: 0 }}>
                <Row>
                  {fieldLayout.map((col, colIndex) => (
                    <Col key={colIndex}>
                      <Card>
                        <Card.Header>{col.title}</Card.Header>
                        <Card.Body>
                          {col.fields.map((field, fieldIndex) => {
                            const fieldName = field.field
                            return (
                              <Form.Group key={fieldIndex}>
                                <Form.Label>{field.title}</Form.Label>
                                <Field
                                  as={Form.Control}
                                  disabled={!createApiUser}
                                  isInvalid={
                                    // @ts-expect-error the form keys are matched to the ApiUser type
                                    touched[fieldName] && !!errors[fieldName]
                                  }
                                  name={fieldName}
                                  // onBlur, onChange, and value are passed automatically.
                                />
                                <Form.Control.Feedback type="invalid">
                                  {
                                    //@ts-ignore
                                    errors[fieldName]
                                  }
                                </Form.Control.Feedback>
                              </Form.Group>
                            )
                          })}
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Container>

              <div className="mt-3">
                <Form.Group>
                  <Field
                    as={Form.Check}
                    disabled={!createApiUser}
                    feedback={errors.hasConsentedToTerms}
                    id="hasConsentedToTerms"
                    isInvalid={
                      touched.hasConsentedToTerms &&
                      !!errors.hasConsentedToTerms
                    }
                    label={
                      <>
                        I have read and consent to the{' '}
                        <a
                          href={privacyPath}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Privacy Policy
                        </a>{' '}
                        for using the {process.env.API_NAME}.
                      </>
                    }
                    name="hasConsentedToTerms"
                    // onBlur, onChange, and value are passed automatically.
                  />
                </Form.Group>
              </div>
              {createApiUser && (
                <Button type="submit" variant="primary">
                  Create account
                </Button>
              )}
            </Form>
          )}
        </Formik>
      </div>
    )
  }
}

export default withAuth0(ApiUserForm)
