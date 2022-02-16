import React from 'react'
import Link from 'next/link'
import { ExternalLinkAlt } from '@styled-icons/fa-solid/ExternalLinkAlt'

const NavLink = ({
  children,
  external,
  href,
  onClick,
  pathname,
  target
}: {
  children: JSX.Element | string
  external?: boolean
  href?: string
  onClick?: () => void
  pathname?: string
  target?: string
}): JSX.Element => {
  const active = pathname === href
  return (
    <>
      {external ? (
        <a href={href} rel="noopener noreferrer" target="_blank">
          {children}{' '}
          <ExternalLinkAlt size={10} style={{ marginBottom: '3px' }} />
        </a>
      ) : href ? (
        <Link href={href} passHref>
          <a
            className={active ? 'active' : undefined}
            href="dummy"
            target={target}
          >
            {children}
          </a>
        </Link>
      ) : (
        <button onClick={onClick}>{children}</button>
      )}
      <style jsx>
        {`
          a {
            color: #fff;
            text-decoration: none;
          }
          a.active {
            background-color: ${process.env.SECONDARY_COLOR || '#444'};
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
