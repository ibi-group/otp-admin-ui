import { useRouter } from 'next/router'
import { useAuth } from 'use-auth0-hooks'

import NavLink from './NavLink'
import { getAuthRedirectUri } from '../util/auth'

export default function NavBar (props) {
  const { pathname, query } = useRouter()
  const { isAuthenticated, isLoading, login, logout } = useAuth()
  const { adminUser } = props
  const handleLogin = () => login({ appState: { returnTo: { pathname, query } } })
  const handleLogout = () => logout({ returnTo: getAuthRedirectUri() })
  const handleSignup = () => login({
    appState: { returnTo: { pathname, query } },
    screen_hint: 'signup'
  })

  return (
    <header>
      <nav>
        <ul>
          <li>
            <NavLink pathname={pathname} href='/'>
              Dashboard
            </NavLink>
          </li>
          {adminUser &&
            <li>
              <NavLink pathname={pathname} href='/manage'>
                Manage
              </NavLink>
            </li>
          }
          {!isLoading && (
            isAuthenticated ? (
              <>
                <li>
                  <NavLink pathname={pathname} href='/profile'>
                    My Account
                  </NavLink>
                </li>
                <li>
                  <NavLink onClick={handleLogout}>
                    Log out
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink onClick={handleLogin}>
                    Log in
                  </NavLink>
                </li>
                <li>
                  <NavLink onClick={handleSignup}>
                    Sign up for API access
                  </NavLink>
                </li>
              </>
            )
          )}
        </ul>
      </nav>
      <style jsx>{`
        header {
          padding: 0.2rem;
          color: #fff;
          background-color: #333;
          font-family: sans-serif;
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
          background-color: #444;
        }
        li {
          margin-right: 1rem;
        }
        li:nth-last-child(3) {
          margin-right: auto;
        }
      `}
      </style>
    </header>
  )
}
