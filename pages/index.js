import Link from 'next/link'
import fetch from 'isomorphic-unfetch'
import { useAuth } from 'use-auth0-hooks'

import UserList from '../components/UserList'

const PostLink = ({ post }) => (
  <li>
    <Link href="/p/[id]" as={`/p/${post.id}`}>
      <a>{post.title}</a>
    </Link>
    <style jsx>{`
      li {
        list-style: none;
        margin: 5px 0;
      }

      a {
        text-decoration: none;
        color: blue;
        font-family: 'Arial';
      }

      a:hover {
        opacity: 0.6;
      }
    `}
    </style>
  </li>
)

export default function Index () {
  const { isAuthenticated, isLoading } = useAuth({
    audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
    scope: ''
  })
  if (isLoading) return 'Loading'
  if (!isLoading && !isAuthenticated) {
    return (
      <div>
        Please log in to view the Admin Dashboard.
      </div>
    )
  }
  return (
    <div>
      <h1>Batman TV Shows {isAuthenticated ? 'logged in' : 'logged out'}</h1>
      <UserList />
      <style jsx>{`
          h1,
          a {
            font-family: 'Arial';
          }

          ul {
            padding: 0;
          }

          li {
            list-style: none;
            margin: 5px 0;
          }

          a {
            text-decoration: none;
            color: blue;
          }

          a:hover {
            opacity: 0.6;
          }
        `}
      </style>
    </div>
  )
}

Index.getInitialProps = async function () {
  const res = await fetch('https://api.tvmaze.com/search/shows?q=batman')
  const data = await res.json()
  console.log(`Show data fetched. Count: ${data.length}`)

  return {
    shows: data.map(entry => entry.show)
  }
}
