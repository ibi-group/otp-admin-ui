import React from 'react'

import MarkdownContent, { fetchMarkdown } from '../components/MarkdownContent'
import { ConvertedMD } from '../types/response'

/**
 * getStaticProps function for statically embedding markdown.
 * (see https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation).
 */
export async function getStaticProps(): Promise<{ props: ConvertedMD }> {
  if (!process.env.TERMS_CONDITIONS_URL) return { props: { markdown: '' } }

  const markdown = await fetchMarkdown(process.env.TERMS_CONDITIONS_URL)
  return {
    props: { markdown }
  }
}

/**
 * Component that renders the terms and conditions.
 */
export default function Terms({ markdown }: ConvertedMD): JSX.Element {
  return <MarkdownContent markdown={markdown} title="Terms & Conditions" />
}
