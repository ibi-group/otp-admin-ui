import MarkdownContent from './MarkdownContent'

const EMPTY_CONTENTS = 'No contents provided.'

/**
 * Fetch contents to be statically embedded by next.js at deployment time.
 * If a URL is specified and cannot be fetched, i.e. fetch throws an exception,
 * then the yarn build process will fail (and notifications will be sent by GitHub).
 */
async function getContentProps (url) {
  let contents = EMPTY_CONTENTS
  if (url) {
    const res = await fetch(url)
    contents = await res.text()
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
