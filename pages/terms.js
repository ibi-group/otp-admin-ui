import { createGetStaticProps, createMarkdownContent } from '../components/createMarkdownContent'

/**
 * getStaticProps function for statically embedding markdown.
 * (see https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation).
 */
export const getStaticProps = createGetStaticProps(process.env.TERMS_CONDITIONS_URL)

/**
 * Component that renders the terms and conditions.
 */
export default createMarkdownContent('Terms & Conditions')
