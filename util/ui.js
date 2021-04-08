import { Children, isValidElement, cloneElement } from 'react'

/**
 * Renders children with additional props.
 * Modified from
 * https://stackoverflow.com/questions/32370994/how-to-pass-props-to-this-props-children#32371612
 * @param children the child elements to modify.
 * @param newProps the props to add.
 */
export function renderChildrenWithProps (children, newProps) {
  const childrenWithProps = Children.map(children, child => {
    // Checking isValidElement is the safe way and avoids a TS error too.
    if (isValidElement(child)) {
      return cloneElement(child, { ...newProps })
    }
    return child
  })

  return childrenWithProps
}

/**
 * Returns the paths for terms and privacy policy depending on
 * whether the URLs for these documents points to markdown (*.md) or not.
 */
export function getTermsAndPrivacyPaths () {
  const privacyUrl = process.env.PRIVACY_POLICY_URL
  const termsUrl = process.env.TERMS_CONDITIONS_URL
  const isPrivacyMarkdown = !privacyUrl || privacyUrl.endsWith('.md')
  const isTermsMarkdown = !termsUrl || termsUrl.endsWith('.md')
  const termsPath = isTermsMarkdown ? '/terms' : termsUrl
  const privacyPath = isPrivacyMarkdown ? '/privacy' : privacyUrl

  return {
    privacyPath,
    termsPath
  }
}
