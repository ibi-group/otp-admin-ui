import MarkdownContent from '../components/MarkdownContent'

import privacy from '../public/privacy.md'

export default function FAQ () {
  return (
    <MarkdownContent
      title='Privacy Policy'
      markdown={privacy}
    />
  )
}
