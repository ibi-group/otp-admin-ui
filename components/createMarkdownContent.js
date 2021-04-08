import MarkdownContent from './MarkdownContent'

const EMPTY_CONTENTS = 'No contents provided.'
const ERROR_MESSAGE = 'Error fetching contents.'

/**
 * Fetch contents to be statically embedded by next.js at deployment time.
 */
async function getContentProps (url) {
  let contents = EMPTY_CONTENTS
  if (url) {
    try {
      const res = await fetch(url)
      contents = await res.text()
    } catch (error) {
      contents = ERROR_MESSAGE
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
