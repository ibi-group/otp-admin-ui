import NavLink from './NavLink'

/**
 * Footer for the main layout.
 * Derived from https://codepen.io/tutsplus/pen/yWrEgW
 */
export default function Footer (props) {
  return (
    <footer>
      <section className='ft-main'>
        <div className='ft-main-item'>
          <h2 className='ft-title'>About</h2>
          <ul>
            <li>
              <NavLink
                // FIXME: Update content at link
                href='/about'>
                About this app
              </NavLink>
            </li>
            <li>
              <NavLink
                // FIXME: Update content at link
                href='/faq'>
                FAQ
              </NavLink>
            </li>
            <li>
              <NavLink
                href={process.env.STATUS_PAGE_URL}
                external>
                Status
              </NavLink>
            </li>
          </ul>
        </div>
        <div className='ft-main-item'>
          <h2 className='ft-title'>Resources</h2>
          <ul>
            <li>
              <NavLink
                // FIXME: Update link
                href={process.env.OTP_UI_URL}
                external
              >
                View Trip Planner
              </NavLink>
            </li>
            <li>
              <NavLink
                href={process.env.API_DOCUMENTATION_URL}
                external
              >
                API documentation
              </NavLink>
            </li>
          </ul>
        </div>
        <div className='ft-main-item'>
          <h2 className='ft-title'>Contact</h2>
          <ul>
            <li>
              <NavLink
                // FIXME: Update link
                href='/'>
                Help
              </NavLink>
            </li>
            <li>
              <NavLink
                // FIXME: Update link
                href='/'>
                Request access to API
              </NavLink>
            </li>
          </ul>
        </div>
      </section>
      <section className='ft-legal'>
        <ul className='ft-legal-list'>
          <li>
            <NavLink
              // FIXME: Broken link
              href='/terms'>
              Terms &amp; Conditions
            </NavLink>
          </li>
          <li>
            <NavLink
              // FIXME: Broken link
              href='/privacy'>
              Privacy Policy
            </NavLink>
          </li>
          <li>&copy; IBI Group</li>
        </ul>
      </section>
      <style jsx>{`
        /* Generic styling */
        * {
          box-sizing: border-box;
          font-family: sans-serif;
          margin: 0;
          padding: 0;
        }
        ul {
          list-style: none;
          padding-left: 0;
        }
        footer {
          font-family: sans-serif;
          background-color: #555;
          color: #bbb;
          line-height: 1.5;
        }
        footer a {
          text-decoration: none;
          color: #eee;
        }
        a:hover {
          text-decoration: underline;
        }
        .ft-title {
          color: #fff;
          font-size: 1.375rem;
          padding-bottom: 0.625rem;
        }
        /* Sticks footer to bottom */
        body {
          display: flex;
          min-height: 100vh;
          flex-direction: column;
        }
        .container {
          flex: 1;
        }
        /* Footer main */
        .ft-main {
          padding: 1.25rem 1.875rem;
          display: flex;
          flex-wrap: wrap;
        }
        @media only screen and (min-width: 29.8125rem /* 477px */) {
          .ft-main {
            justify-content: space-evenly;
          }
        }
        @media only screen and (min-width: 77.5rem /* 1240px */) {
          .ft-main {
            justify-content: space-evenly;
          }
        }
        .ft-main-item {
          padding: 1.25rem;
          min-width: 12.5rem;
        }

        /* Footer main | Newsletter form */
        form {
          display: flex;
          flex-wrap: wrap;
        }
        input[type='email'] {
          border: 0;
          padding: 0.625rem;
          margin-top: 0.3125rem;
        }
        input[type='submit'] {
          background-color: #00d188;
          color: #fff;
          cursor: pointer;
          border: 0;
          padding: 0.625rem 0.9375rem;
          margin-top: 0.3125rem;
        }
        /* Footer legal */
        .ft-legal {
          padding: 0.9375rem 1.875rem;
          background-color: #333;
        }
        .ft-legal-list {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
        }
        .ft-legal-list li {
          margin: 0.125rem 0.625rem;
          white-space: nowrap;
        }
        /* one before the last child */
        .ft-legal-list li:nth-last-child(2) {
            flex: 1;
        }
      `}
      </style>
    </footer>
  )
}
