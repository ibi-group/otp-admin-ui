import MarkdownContent from '../components/MarkdownContent'

import readme from '../README.md'

export default function About () {
  return (
    <MarkdownContent title='About' markdown={readme} />
  )
}
