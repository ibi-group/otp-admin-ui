import Markdown from 'react-markdown'

import faq from '../public/faq.md'

export default function FAQ () {
  return (
    <div>
      <h1>FAQ</h1>
      <div className='markdown'>
        <Markdown source={faq} />
      </div>
      <style jsx global>{`
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
    </div>
  )
}
