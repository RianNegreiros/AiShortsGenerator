import React from 'react'

import Navbar from '../components/NavBar'

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      <main className='grow'>{children}</main>
    </>
  )
}
