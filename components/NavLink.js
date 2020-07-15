import Link from 'next/link'
import { ExternalLinkAlt } from '@styled-icons/fa-solid/ExternalLinkAlt'

const NavLink = (props) => (
  <>
    {props.external
      ? <a
        href={props.href}
        rel='noopener noreferrer'
        target='_blank'
      >
        {props.children}{' '}
        <ExternalLinkAlt style={{ marginBottom: '3px' }} size={10} />
      </a>
      : props.href
        ? <Link href={props.href}>
          {/* href is passed by NextLink */}
          {/* eslint-disable jsx-a11y/anchor-is-valid */}
          <a>{props.children}</a>
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

export default NavLink
