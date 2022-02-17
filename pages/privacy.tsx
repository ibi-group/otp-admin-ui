import React from 'react'

import MarkdownContent, { fetchMarkdown } from '../components/MarkdownContent'
import { ConvertedMD } from '../types/response'

/**
 * getStaticProps function for statically embedding markdown.
 * (see https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation).
 */
export async function getStaticProps(): Promise<{
  props: ConvertedMD
}> {
  if (!process.env.PRIVACY_POLICY_URL) return { props: { markdown: '' } }
  const markdown = await fetchMarkdown(process.env.PRIVACY_POLICY_URL)
  return {
    props: { markdown }
  }
}

/**
 * Component that renders the privacy policy page.
 */
export default function Privacy({ markdown }: ConvertedMD): JSX.Element {
  return <MarkdownContent markdown={markdown} title="Privacy Policy" />
}
