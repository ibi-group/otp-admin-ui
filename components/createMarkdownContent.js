import { isMarkdown } from '../util/ui'

import MarkdownContent from './MarkdownContent'

const EMPTY_CONTENTS = 'No contents provided.'

/**
 * Fetch markdown (*.md) contents to be statically embedded by next.js at deployment time.
 * If a URL is specified and cannot be fetched, i.e. fetch throws an exception,
 * or the result of fetch is other than 'ok', then the yarn build process will fail.
 */
async function getContentProps (url) {
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

/**
 * Creates a getStaticProps function for the components/pages that let next.js
 * fetch and statically embed markdown contents at deployment time.
 * (see https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation).
 */
export function createGetStaticProps (url) {
  return () => getContentProps(url)
}

/**
 * Creates a MarkdownContent component with the specified title.
 */
export function createMarkdownContent (title) {
  return ({ markdown }) => (
    <MarkdownContent
      markdown={markdown}
      title={title}
    />
  )
}
