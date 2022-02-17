import React from 'react'

import MarkdownContent from '../components/MarkdownContent'
// @ts-expect-error markdown has no types
import faq from '../public/faq.md'

export default function FAQ(): JSX.Element {
  return (
    <MarkdownContent markdown={faq} title="Frequently Asked Questions (FAQ)" />
  )
}
