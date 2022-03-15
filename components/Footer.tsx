import React from 'react'

import { getTermsAndPrivacyPaths } from '../util/ui'

import NavLink from './NavLink'

/**
 * Footer for the main layout.
 * Derived from https://codepen.io/tutsplus/pen/yWrEgW
 */
export default function Footer(): JSX.Element {
  // Embed content for terms and privacy if URL points to a markdown document.
  // Embed also if either is not defined (shows an error message instead of a non-working link).
  const { privacyPath } = getTermsAndPrivacyPaths()
  return (
    <footer>
      <section className="ft-main">
        <div className="ft-main-item">
          <h2 className="ft-title">About</h2>
          <ul>
            <li>
              <NavLink href="/faq">FAQ</NavLink>
            </li>
            {process.env.STATUS_PAGE_URL && (
              <li>
                <NavLink external href={process.env.STATUS_PAGE_URL}>
                  Status
                </NavLink>
              </li>
            )}
          </ul>
        </div>
        <div className="ft-main-item">
          <h2 className="ft-title">Resources</h2>
          <ul>
            <li>
              <NavLink external href={process.env.OTP_UI_URL}>
                View Trip Planner
              </NavLink>
            </li>
            {process.env.API_MANAGER_ENABLED &&
              process.env.API_DOCUMENTATION_URL && (
                <li>
                  <NavLink external href={process.env.API_DOCUMENTATION_URL}>
                    API documentation
                  </NavLink>
                </li>
              )}
            {process.env.OTP_FORUM_URL && (
              <li>
                <NavLink external href={process.env.OTP_FORUM_URL}>
                  OTP Developers Forum
                </NavLink>
              </li>
            )}
          </ul>
        </div>
        <div className="ft-main-item">
          <h2 className="ft-title">Contact</h2>
          <ul>
            <li>
              <NavLink
                href={`mailto:${process.env.SUPPORT_EMAIL}?subject=${process.env.SITE_TITLE} Support Request`}
                target="_blank"
              >
                Help
              </NavLink>
            </li>
          </ul>
        </div>
      </section>
      <section className="ft-legal">
        <ul className="ft-legal-list">
          <li>
            <NavLink href={privacyPath}>Privacy Policy</NavLink>
          </li>
          <li>&copy; IBI Group</li>
        </ul>
      </section>
      <style jsx>
        {`
          /* Generic styling */
          * {
            box-sizing: border-box;
            font-family: sans-serif;
            margin: 0;
            padding: 0;
          }
          ul {
            list-style: none;
            padding-left: 0;
          }
          footer {
            font-family: sans-serif;
            background-color: ${process.env.SECONDARY_COLOR || '#555'};
            color: #bbb;
            line-height: 1.5;
          }
          footer a {
            text-decoration: none;
            color: #eee;
          }
          a:hover {
            text-decoration: underline;
          }
          .ft-title {
            color: #fff;
            font-size: 1.375rem;
            padding-bottom: 0.625rem;
          }
          /* Sticks footer to bottom */
          body {
            display: flex;
            min-height: 100vh;
            flex-direction: column;
          }
          .container {
            flex: 1;
          }
          /* Footer main */
          .ft-main {
            padding: 1.25rem 1.875rem;
            display: flex;
            flex-wrap: wrap;
          }
          @media only screen and (min-width: 29.8125rem /* 477px */) {
            .ft-main {
              justify-content: space-evenly;
            }
          }
          @media only screen and (min-width: 77.5rem /* 1240px */) {
            .ft-main {
              justify-content: space-evenly;
            }
          }
          .ft-main-item {
            padding: 1.25rem;
            min-width: 12.5rem;
          }
          /* Footer legal */
          .ft-legal {
            padding: 0.9375rem 1.875rem;
            background-color: ${process.env.PRIMARY_COLOR || '#333'};
          }
          .ft-legal-list {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
          }
          .ft-legal-list li {
            margin: 0.125rem 0.625rem;
            white-space: nowrap;
          }
          /* one before the last child */
          .ft-legal-list li:nth-last-child(2) {
            flex: 1;
          }
        `}
      </style>
    </footer>
  )
}
