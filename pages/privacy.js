import MarkdownContent, { getContentProps } from '../components/MarkdownContent'

/**
 * getStaticProps (async) function for statically embedding markdown.
 * (see https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation).
 */
export function getStaticProps () {
  return getContentProps(process.env.PRIVACY_POLICY_URL)
}

/**
 * Component that renders the privacy policy page.
 */
export default function Privacy ({ markdown }) {
  return (
    <MarkdownContent
      markdown={markdown}
      title={'Privacy Policy'}
    />
  )
}
