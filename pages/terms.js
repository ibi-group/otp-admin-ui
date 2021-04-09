import MarkdownContent, { fetchMarkdown } from '../components/MarkdownContent'

/**
 * getStaticProps function for statically embedding markdown.
 * (see https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation).
 */
export async function getStaticProps () {
  const markdown = await fetchMarkdown(process.env.TERMS_CONDITIONS_URL)
  return {
    props: { markdown }
  }
}

/**
 * Component that renders the terms and conditions.
 */
export default function Terms ({ markdown }) {
  return (
    <MarkdownContent
      markdown={markdown}
      title={'Terms & Conditions'}
    />
  )
}
