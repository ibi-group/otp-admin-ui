import React from 'react'
import { useRouter } from 'next/router'
import Markdown from 'react-markdown'

import LayoutWithAuth0 from '../../components/LayoutWithAuth0'

const IdPage = (): JSX.Element => {
  const router = useRouter()
  return (
    <LayoutWithAuth0>
      <h1>{router.query.id}</h1>
      <div className="markdown">
        <Markdown
          source={`
This is our blog post.
Yes. We can have a [link](/link).
And we can have a title as well.

### This is a title

And here's the content.
      `}
        />
      </div>
      <style global jsx>
        {`
          .markdown {
            font-family: 'Arial';
          }

          .markdown a {
            text-decoration: none;
            color: blue;
          }

          .markdown a:hover {
            opacity: 0.6;
          }

          .markdown h3 {
            margin: 0;
            padding: 0;
            text-transform: uppercase;
          }
        `}
      </style>
    </LayoutWithAuth0>
  )
}

export default IdPage