import DynamicMarkdownContent from '../components/DynamicMarkdownContent'

export default function Terms () {
  return (
    <DynamicMarkdownContent
      title='Terms & Conditions'
      url={process.env.TERMS_CONDITIONS_URL}
    />
  )
}
