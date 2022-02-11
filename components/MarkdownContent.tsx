import React from 'react'
import Markdown from 'react-markdown'

import { isMarkdown } from '../util/ui'

const EMPTY_CONTENTS = 'No contents provided.'

/**
 * Fetch markdown (*.md) contents to be statically embedded by next.js at deployment time
 * for pages such as Privacy, Terms that use MarkdownContent.
 * @param url The URL to fetch. If null or not a markdown document, EMPTY_CONTENTS will be shown.
 *            If a URL to a markdown document is specified and cannot be fetched,
 *            i.e. fetch throws an error or the result is not OK,
 *            then the yarn build process will fail.
 * @returns The fetched markdown content, or EMPTY_CONTENTS otherwise.
 */
export async function fetchMarkdown(url: string): Promise<string> {
  let markdown = EMPTY_CONTENTS
  if (isMarkdown(url)) {
    const res = await fetch(url)
    if (res.ok) {
      markdown = await res.text()
    } else {
      // Throw an error and fail the build.
      throw new Error(`The document could not be fetched at '${url}'.`)
    }
  }

  return markdown
}

export default function MarkdownContent(props: {
  title?: string
  markdown: string
}): JSX.Element {
  return (
    <div>
      <h1>{props.title || 'Page Title'}</h1>
      <div className="markdown">
        <Markdown source={props.markdown} />
      </div>
      <style global jsx>
        {`
          * {
            font-family: 'Arial';
          }

          .markdown a {
            text-decoration: none;
            color: blue;
          }

          .markdown a:hover {
            opacity: 0.6;
          }

          .markdown h3 {
            margin: 0;
            padding: 0;
            text-transform: uppercase;
          }
        `}
      </style>
    </div>
  )
}
