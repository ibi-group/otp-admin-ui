import { Children, isValidElement, cloneElement } from 'react'

/**
 * Renders children with additional props.
 * Modified from
 * https://stackoverflow.com/questions/32370994/how-to-pass-props-to-this-props-children#32371612
 * @param children the child elements to modify.
 * @param newProps the props to add.
 */
export function renderChildrenWithProps(
  children: JSX.Element[] | JSX.Element,
  newProps: any
): JSX.Element[] {
  const childrenWithProps = Children.map(children, (child) => {
    // Checking isValidElement is the safe way and avoids a TS error too.
    if (isValidElement(child)) {
      return cloneElement(child, { ...newProps })
    }
    return child
  })

  return childrenWithProps
}

export function isMarkdown(url: string): boolean {
  return url ? url.endsWith('.md') : false
}

/**
 * Returns the paths for terms and privacy policy (to the original URL or
 * to our page with that document embedded) depending on
 * whether the URLs for these documents points to markdown (*.md) or not.
 */
export function getTermsAndPrivacyPaths(): {
  privacyPath: string
  termsPath: string
} {
  const privacyUrl = process.env.PRIVACY_POLICY_URL
  const termsUrl = process.env.TERMS_CONDITIONS_URL
  const embedPrivacy = !privacyUrl || isMarkdown(privacyUrl)
  const embedTerms = !termsUrl || isMarkdown(termsUrl)
  const termsPath = embedTerms ? '/terms' : termsUrl
  const privacyPath = embedPrivacy ? '/privacy' : privacyUrl

  return {
    privacyPath,
    termsPath
  }
}