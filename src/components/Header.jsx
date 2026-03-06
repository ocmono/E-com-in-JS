/**
 * Main store header - visible to all users.
 */

import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuthStore, isStaff } from '../stores/authStore.js'
import { useCartStore } from '../stores/cartStore.js'

export function Header() {
  const { user } = useAuthStore()
  const itemCount = useCartStore((s) => s.itemCount())
  const setFlyoutOpen = useCartStore((s) => s.setFlyoutOpen)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const navClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
    }`

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-neutral-900">
            OC Mono
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={navClass}>Home</NavLink>
            <NavLink to="/catalog" className={navClass}>Catalog</NavLink>
            <NavLink to="/blog" className={navClass}>Blog</NavLink>
            <NavLink to="/cart" className={navClass}>Cart</NavLink>
            {user && (
              <NavLink to="/account" className={navClass}>Account</NavLink>
            )}
            {user && isStaff(user) && (
              <NavLink to="/admin" className={navClass}>Admin</NavLink>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setFlyoutOpen?.(true)}
              className="relative p-2 text-neutral-600 hover:text-neutral-900"
              aria-label="Cart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-store-accent text-white text-xs font-bold rounded-full">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            <div className="relative">
              {user ? (
                <>
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-2 py-1 rounded-md text-neutral-600 hover:bg-neutral-100"
                  >
                    <span className="text-sm font-medium">{user.name ?? user.email}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} aria-hidden />
                      <div className="absolute right-0 mt-1 w-48 py-1 bg-white rounded-md shadow-lg border border-neutral-200 z-20">
                        <Link
                          to="/account"
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Account
                        </Link>
                        <Link
                          to="/account/orders"
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Orders
                        </Link>
                        <Link
                          to="/login"
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                          onClick={() => {
                            useAuthStore.getState().logout()
                            setUserMenuOpen(false)
                          }}
                        >
                          Log out
                        </Link>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900"
                >
                  Sign in
                </Link>
              )}
            </div>

            <button
              type="button"
              className="md:hidden p-2 text-neutral-600"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-200">
            <nav className="flex flex-col gap-1">
              <NavLink to="/" end className={navClass} onClick={() => setMenuOpen(false)}>Home</NavLink>
              <NavLink to="/catalog" className={navClass} onClick={() => setMenuOpen(false)}>Catalog</NavLink>
              <NavLink to="/blog" className={navClass} onClick={() => setMenuOpen(false)}>Blog</NavLink>
              <NavLink to="/cart" className={navClass} onClick={() => setMenuOpen(false)}>Cart</NavLink>
              {user && (
                <NavLink to="/account" className={navClass} onClick={() => setMenuOpen(false)}>Account</NavLink>
              )}
              {user && isStaff(user) && (
                <NavLink to="/admin" className={navClass} onClick={() => setMenuOpen(false)}>Admin</NavLink>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
