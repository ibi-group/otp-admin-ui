import Link from 'next/link'
import { ExternalLinkAlt } from '@styled-icons/fa-solid/ExternalLinkAlt'

const NavLink = ({ children, external, href, pathname, onClick }) => {
  const active = pathname === href
  return (
    <>
      {external
        ? <a
          href={href}
          rel='noopener noreferrer'
          target='_blank'
        >
          {children}{' '}
          <ExternalLinkAlt style={{ marginBottom: '3px' }} size={10} />
        </a>
        : href
          ? <Link href={href}>
            {/* href is passed by NextLink */}
            {/* eslint-disable jsx-a11y/anchor-is-valid */}
            <a className={active ? 'active' : undefined}>{children}</a>
          </Link>
          : <button onClick={onClick}>
            {children}
          </button>
      }
      <style jsx>{`
        a {
          color: #fff;
          text-decoration: none;
          padding: 33px 8px 21px 8px;
        }
        a.active {
          background-color: #444;
          border-bottom: 9px solid #fdfdbb;
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
}

export default NavLink
