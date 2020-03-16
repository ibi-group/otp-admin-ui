import Markdown from 'react-markdown';

export default function FAQ () {
  return (
    <div>
      <h1>FAQ</h1>
      <div className="markdown">
        <Markdown
          source={`
This is our FAQ.
Yes. We can have a [link](/about).
And we can have a title as well.

### This is a title

**Question:** Where can I find more information about how to use the OpenTripPlanner API?
**Answer:** The [OTP web services documentation](http://dev.opentripplanner.org/apidoc/1.4.0/) has detailed information about the OTP API.
      `}
        />
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
      `}</style>
    </div>
  );
};
