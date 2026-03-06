/**
 * Admin bar - only visible for staff (admin, manager, shop_owner).
 * Hidden for customers (Drupal-style).
 */

import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore, isStaff } from '../stores/authStore.js'

const dropdowns = [
  {
    label: 'Content',
    items: [
      { to: '/admin/pages', label: 'Pages' },
      { to: '/admin/blog', label: 'Blog' },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { to: '/admin/products', label: 'Products' },
      { to: '/admin/categories', label: 'Categories' },
    ],
  },
  {
    label: 'Orders',
    items: [
      { to: '/admin/orders', label: 'Orders' },
    ],
  },
  {
    label: 'Settings',
    items: [
      { to: '/admin/users', label: 'Users & Roles' },
    ],
  },
]

export function AdminBar() {
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const [openDropdown, setOpenDropdown] = useState(null)
  const closeTimeoutRef = useRef(null)

  const showBar = isStaff(user) && !location.pathname.startsWith('/admin')

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }

  const handleEnter = (label) => {
    clearCloseTimeout()
    setOpenDropdown(label)
  }

  const handleLeave = () => {
    closeTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 150)
  }

  useEffect(() => () => clearCloseTimeout(), [])

  if (!showBar) return null

  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 z-[100] h-9 bg-neutral-800 text-neutral-200 text-sm flex items-center px-2 shadow-md"
        onMouseLeave={handleLeave}
      >
        <div className="max-w-[100vw] w-full mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-1 min-w-0">
            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-neutral-700 text-white font-semibold shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2a2 2 0 012-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2a2 2 0 012-2z" />
              </svg>
              Dashboard
            </Link>
            {dropdowns.map(({ label, items }) => (
              <div
                key={label}
                className="relative"
                onMouseEnter={() => handleEnter(label)}
                onMouseLeave={handleLeave}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 px-2 py-1 rounded hover:bg-neutral-700 shrink-0"
                  aria-expanded={openDropdown === label}
                >
                  {label}
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openDropdown === label && (
                  <div className="absolute left-0 top-full mt-0.5 py-1 min-w-[11rem] rounded-md bg-neutral-700 shadow-lg border border-neutral-600">
                    {items.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="block px-3 py-1.5 hover:bg-neutral-600 text-left"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link to="/" className="px-2 py-1 rounded hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs">
              View store
            </Link>
            <span className="w-px h-4 bg-neutral-600" />
            <span className="text-neutral-400 text-xs truncate max-w-[8rem]" title={user?.name ?? user?.email}>
              {user?.name ?? user?.email}
            </span>
            <Link to="/admin" className="px-2 py-1 rounded hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs">
              Admin
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              className="px-2 py-1 rounded hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
      <div className="h-9" aria-hidden />
    </>
  )
}
