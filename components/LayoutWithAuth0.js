import { withAuth0 } from '@auth0/auth0-react'
import Head from 'next/head'
import { withRouter } from 'next/router'
import { SWRConfig } from 'swr'

import VerifyEmailScreen from '../components/verify-email-screen'
import { useApi } from '../hooks/use-api'
import { getAuthRedirectUri } from '../util/auth'
import { renderChildrenWithProps } from '../util/ui'
import Footer from './Footer'
import NavBar from './NavBar'

function LayoutwithAuth0 ({ auth0, children, router }) {
  const { pathname, query } = router
  const { loginWithRedirect, logout, user } = auth0
  const handleLogin = () => loginWithRedirect({ appState: { returnTo: { pathname, query } } })
  const handleLogout = () => logout({ returnTo: getAuthRedirectUri() })
  const handleSignup = () => loginWithRedirect({
    appState: { returnTo: { pathname, query } },
    screen_hint: 'signup'
  })

  let contents
  if (user && !user.email_verified) {
    // If user is logged in, but email is not verified, force user to verify.
    contents = <VerifyEmailScreen />
  } else {
    // Otherwise, show component children.
    // TODO: find a better way to pass props to children.
    const extraProps = {
      handleSignup
    }
    contents = renderChildrenWithProps(children, extraProps)
  }
  return (
    <SWRConfig
      value={{
        fetcher: (url, method, ...props) => useApi(url, method, props),
        refreshInterval: 30000
      }}
    >
      <div>
        <Head>
          <title>{process.env.SITE_TITLE}</title>
        </Head>
        <NavBar
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          handleSignup={handleSignup} />
        <main>
          <div className='container'>
            {contents}
          </div>
        </main>
        <Footer />
        <style jsx>{`
          .container {
            max-width: 42rem;
            min-height: 500px;
            margin: 1.5rem auto;
          }
        `}
        </style>
        <style jsx global>{`
          body {
            margin: 0;
            color: #333;
          }
        `}
        </style>
      </div>
    </SWRConfig>
  )
}

export default withRouter(withAuth0(LayoutwithAuth0))
