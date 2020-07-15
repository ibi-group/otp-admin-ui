import Head from 'next/head'

import Footer from './Footer'
import NavBar from './NavBar'

export default ({ children }) => (
  <div>
    <Head>
      <title>OTP Admin Dashboard</title>
    </Head>
    <NavBar />
    <main>
      <div className='container'>
        {children}
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
        font-family: -apple-system, 'Segoe UI';
      }
    `}
    </style>
  </div>
)
