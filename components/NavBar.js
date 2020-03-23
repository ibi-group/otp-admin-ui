import Link from 'next/link'
import { useRouter } from 'next/router'
import { ExternalLinkAlt } from '@styled-icons/fa-solid/ExternalLinkAlt'

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
            <NavLink href='/'>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink href='/faq'>
              FAQ
            </NavLink>
          </li>
          <li>
            <NavLink href='/about'>
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              href='https://fdot-otp.ibi-transit.com/'
              external
            >
              View RMCE
            </NavLink>
          </li>
          {!isLoading && (
            isAuthenticated ? (
              <>
                <li>
                  <NavLink href='/profile'>
                    Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink onClick={handleLogout}>
                    Log out
                  </NavLink>
                </li>
              </>
            ) : (
              <li>
                <NavLink onClick={handleLogin}>
                  Log in
                </NavLink>
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
      `}
      </style>
    </header>
  )
}

const NavLink = (props) => (
  <>
    {props.external
      ? <a
        href={props.href}
        rel='noopener noreferrer'
        target='_blank'
      >
        {props.children}{' '}
        {/* <ExternalLinkAlt style={{ marginBottom: '3px' }} size={10} /> */}
      </a>
      : props.href
        ? <Link href={props.href}>
          <button>{props.children}</button>
        </Link>
        : <button onClick={props.onClick}>
          {props.children}
        </button>
    }
    <style jsx>{`
      a {
        color: #fff;
        text-decoration: none;
      }
      button {
        font-size: 1rem;
        color: inherit;
        border: none;
        background: none;
        padding: 0;
        font: inherit;
        cursor: pointer;
      }
    `}
    </style>
  </>
)
