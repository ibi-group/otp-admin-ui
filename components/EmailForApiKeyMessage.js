
const EmailForApiKeyMessage = () => (
  <p>
    Please email{' '}
    <a target='_blank' href={`mailto:${process.env.SUPPORT_EMAIL}`}>
      {process.env.SUPPORT_EMAIL}
    </a>{' '}
    to increase your request limits or to request additional API keys.
  </p>
)

export default EmailForApiKeyMessage
