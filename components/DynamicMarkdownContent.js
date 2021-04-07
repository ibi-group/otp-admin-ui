import { useEffect, useState } from 'react'
import MarkdownContent from './MarkdownContent'

/**
 * This component downloads markdown from the specified URL and renders it.
 */
export default function DynamicMarkdownContent ({ title, url }) {
  const [markdown, setMarkdown] = useState()

  useEffect(() => {
    if (!markdown) {
      fetch(url)
        .then(res => res.text())
        .then(setMarkdown)
        .catch(() => setMarkdown('Error fetching contents'))
    }    
  })

  return (
    <MarkdownContent
      markdown={markdown}
      title={title}
    />
  )
}
