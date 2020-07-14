import Head from 'next/head'

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
    <style jsx>{`
      .container {
        max-width: 42rem;
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
)
