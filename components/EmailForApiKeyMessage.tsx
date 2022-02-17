import React from 'react'

const EmailForApiKeyMessage = (): JSX.Element => (
  <p>
    Please email{' '}
    <a
      href={`mailto:${process.env.SUPPORT_EMAIL}`}
      rel="noreferrer"
      target="_blank"
    >
      {process.env.SUPPORT_EMAIL}
    </a>{' '}
    to increase your request limits or to request additional API keys.
  </p>
)

export default EmailForApiKeyMessage
