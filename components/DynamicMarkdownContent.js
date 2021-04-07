import { useEffect, useState } from 'react'
import MarkdownContent from './MarkdownContent'

const ERROR_MESSAGE = 'Error fetching contents'

/**
 * This component downloads markdown from the specified URL and renders it.
 * If the URL is null or there was an error fetching the url, render an error message.
 */
export default function DynamicMarkdownContent ({ title, url }) {
  const [markdown, setMarkdown] = useState(url ? null : ERROR_MESSAGE)

  useEffect(() => {
    if (!markdown) {
      fetch(url)
        .then(res => res.text())
        .then(setMarkdown)
        .catch(() => setMarkdown(ERROR_MESSAGE))
    }
  })

  return (
    <MarkdownContent
      markdown={markdown}
      title={title}
    />
  )
}
