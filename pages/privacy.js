import DynamicMarkdownContent from '../components/DynamicMarkdownContent'

export default function Privacy () {
  return (
    <DynamicMarkdownContent
      title='Privacy Policy'
      url={process.env.PRIVACY_POLICY_URL}
    />
  )
}
