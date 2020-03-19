import Link from 'next/link'
import { useRouter } from 'next/router'

import { useAuth } from 'use-auth0-hooks'

export default function NavBar (props) {
  const { pathname, query } = useRouter()
  const { isAuthenticated, isLoading, login, logout } = useAuth()

  const handleLogin = () => login({ appState: { returnTo: { pathname, query } } })
  const handleLogout = () => logout({ returnTo: process.env.POST_LOGOUT_REDIRECT_URI })

  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link href='/'>
              {/* eslint-disable jsx-a11y/anchor-is-valid */}
              <a>Home</a>
            </Link>
          </li>
          <li>
            <Link href='/faq'>
              <a>FAQ</a>
            </Link>
          </li>
          <li>
            <Link href='/about'>
              <a>About</a>
            </Link>
          </li>
          {!isLoading && (
            isAuthenticated ? (
              <>
                <li>
                  <Link href='/profile'>
                    <a>Profile</a>
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout}>
                    Log out
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button onClick={handleLogin}>
                  Log in
                </button>
              </li>
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
        li {
          margin-right: 1rem;
        }
        li:nth-child(3) {
          margin-right: auto;
        }
        a {
          color: #fff;
          text-decoration: none;
        }
        button {
          font-size: 1rem;
          color: #fff;
          cursor: pointer;
          border: none;
          background: none;
        }
      `}
      </style>
    </header>
  )
}
