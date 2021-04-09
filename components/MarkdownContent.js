import Markdown from 'react-markdown'

import { isMarkdown } from '../util/ui'

const EMPTY_CONTENTS = 'No contents provided.'

/**
 * Fetch markdown (*.md) contents to be statically embedded by next.js at deployment time
 * for pages such as Privacy, Terms that use MarkdownContent.
 * If a URL is specified and cannot be fetched, i.e. fetch throws an exception,
 * or the result of fetch is other than 'ok', then the yarn build process will fail.
 */
export async function getContentProps (url) {
  let contents = EMPTY_CONTENTS
  if (isMarkdown(url)) {
    const res = await fetch(url)
    if (res.ok) {
      contents = await res.text()
    } else {
      // Throw an error and fail the build.
      throw new Error(`The document could not be fetched at '${url}'.`)
    }
  }

  return {
    props: { markdown: contents }
  }
}

export default function MarkdownContent (props) {
  return (
    <div>
      <h1>{props.title || 'Page Title'}</h1>
      <div className='markdown'>
        <Markdown source={props.markdown} />
      </div>
      <style jsx global>{`
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
