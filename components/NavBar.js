import { useRouter } from 'next/router'
import { useAuth0 } from '@auth0/auth0-react'

import NavLink from './NavLink'

export default function NavBar (props) {
  const { pathname } = useRouter()
  const { isAuthenticated, isLoading } = useAuth0()
  // FIXME: Fetch adminUser?
  const { adminUser, handleLogin, handleLogout, handleSignup } = props

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
                  <NavLink pathname={pathname} href='/account'>
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
        li :global(a) {
          padding: 33px 8px 21px 8px;
        }
      `}
      </style>
    </header>
  )
}
