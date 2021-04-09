import MarkdownContent, { getContentProps } from '../components/MarkdownContent'

/**
 * getStaticProps (async) function for statically embedding markdown.
 * (see https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation).
 */
export function getStaticProps () {
  return getContentProps(process.env.TERMS_CONDITIONS_URL)
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
