import Markdown from 'react-markdown'

export default function MarkdownContent (props) {
  return (
    <div>
      <h1>{props.title || 'Page Title'}</h1>
      <div className='markdown'>
        <Markdown source={props.markdown} />
      </div>
      <style jsx global>{`
        * {
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
