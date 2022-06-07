import { Children, isValidElement, cloneElement } from 'react'

import { dateFormatterOptions, USER_TYPES } from '../util/constants'

import type { USER_TYPE } from './constants'

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

/**
 * Determines if the API manager is enabled.
 */
export function isApiManagerEnabled(): boolean {
  // process.env.API_MANAGER_ENABLED is of type string (should be "true" or "false").
  return process.env.API_MANAGER_ENABLED === "true"
}

/**
 * Determines if the CDP manager is enabled.
 */
export function isCdpManagerEnabled(): boolean {
  // process.env.CDP_MANAGER_ENABLED is of type string (should be "true" or "false").
  return process.env.CDP_MANAGER_ENABLED === "true"
}

/**
 * Returns a filtered version of the USER_TYPES constant based on the
 * user modules currently enabled
 */
export const getActiveUserTypes = (): {
  label: string
  url: string
  value: USER_TYPE
}[] => {
  const hasApiManager = isApiManagerEnabled()
  const hasCdpManager = isCdpManagerEnabled()
  return USER_TYPES.filter((userType) => {
    if (userType.value === 'api' && !hasApiManager) return false
    if (userType.value === 'cdp' && !hasCdpManager) return false
    return true
  })
}

/**
 * Converts a CDP file name to a human-readable date. A bit fickle and
 * not universally browser supported. Attempts to fail as gracefully as possible
 */
export const getDateFromCDPFileName = (filename: string): string => {
  const date = filename.split('-anon-trip-data')?.[0].split('/')?.[1]
  if (!date) return filename

  const parsedDate = Date.parse(date)
  if (!parsedDate) return filename

  const dateFormatter = new Intl.DateTimeFormat('en-US', dateFormatterOptions)
  return dateFormatter.format(new Date(parsedDate))
}
