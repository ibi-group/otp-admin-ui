import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useRouter } from 'next/router'

import { AbstractUser } from '../types/user'

import NavLink from './NavLink'

type Props = {
  // The adminUser object we expect here is missing some information, which is why
  // the AbstractUser type is sufficient
  adminUser: AbstractUser | boolean
  handleLogin: () => void
  handleLogout: () => void
  handleSignup: () => void
}

export default function NavBar(props: Props): JSX.Element {
  const { pathname } = useRouter()
  const { isAuthenticated, isLoading } = useAuth0()
  const { adminUser, handleLogin, handleLogout, handleSignup } = props
  const { HOMEPAGE_NAME } = process.env

  return (
    <header>
      <nav>
        <ul>
          <li>
            <NavLink href="/" pathname={pathname}>
              {HOMEPAGE_NAME || 'Dashboard'}
            </NavLink>
          </li>
          {adminUser && (
            <li>
              <NavLink href="/manage" pathname={pathname}>
                Manage
              </NavLink>
            </li>
          )}
          {!isLoading &&
            (isAuthenticated ? (
              <>
                <li>
                  <NavLink href="/account" pathname={pathname}>
                    My Account
                  </NavLink>
                </li>
                <li>
                  <NavLink onClick={handleLogout}>Log out</NavLink>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink onClick={handleLogin}>Log in</NavLink>
                </li>
                {process.env.SIGN_UP_ENABLED && (
                  <li>
                    <NavLink onClick={handleSignup}>
                      Sign up for API access
                    </NavLink>
                  </li>
                )}
              </>
            ))}
        </ul>
      </nav>
      <style jsx>
        {`
          header {
            padding: 0.2rem;
            color: #fff;
            background-color: ${process.env.PRIMARY_COLOR || '#333'};
          }
          nav {
            max-width: 42rem;
            margin: 1.5rem auto;
          }
          ul {
            display: flex;
            list-style: none;
            margin-left: 0;
            padding-left: 0;
          }
          li.active {
            background-color: ${process.env.SECONDARY_COLOR || '#444'};
          }
          li {
            margin-right: 1rem;
          }
          li:nth-last-child(3) {
            margin-right: auto;
          }
          li :global(a) {
            padding: 33px 8px 21px 8px;
          }
        `}
      </style>
    </header>
  )
}
