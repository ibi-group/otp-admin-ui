import MarkdownContent from '../components/MarkdownContent'

import terms from '../public/terms.md'

export default function Terms () {
  return (
    <MarkdownContent
      title='Terms & Conditions'
      markdown={terms}
    />
  )
}
