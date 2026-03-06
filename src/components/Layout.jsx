/**
 * Main store layout - AdminBar + Header + Footer.
 * AdminBar only shows for staff (Drupal-style).
 */

import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { AdminBar } from './AdminBar.jsx'
import { Header } from './Header.jsx'
import { Footer } from './Footer.jsx'
import { CartFlyout } from './CartFlyout.jsx'

export function Layout() {
  useEffect(() => {
    document.documentElement.classList.add('store-theme')
    return () => document.documentElement.classList.remove('store-theme')
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-store">
      <AdminBar />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartFlyout />
    </div>
  )
}
