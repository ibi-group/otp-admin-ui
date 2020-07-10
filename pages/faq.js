import MarkdownContent from '../components/MarkdownContent'

import faq from '../public/faq.md'

export default function FAQ () {
  return (
    <MarkdownContent
      title='Frequently Asked Questions (FAQ)'
      markdown={faq}
    />
  )
}
