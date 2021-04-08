import { createGetStaticProps, createMarkdownContent } from '../components/createMarkdownContent'

/**
 * getStaticProps function for statically embedding markdown.
 * (see https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation).
 */
export const getStaticProps = createGetStaticProps(process.env.PRIVACY_POLICY_URL)

/**
 * Component that renders the privacy policy page.
 */
export default createMarkdownContent('Privacy Policy')
