/**
 * Admin layout - sidebar + outlet. Staff only.
 */

import { useState } from 'react'
import { Link, NavLink, Outlet, Navigate } from 'react-router-dom'
import { useAuthStore, isStaff } from '../../stores/authStore.js'

const CATALOG_ITEMS = [
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/product-variations', label: 'Product variations' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/attributes', label: 'Attributes & Features' },
  { to: '/admin/vendors', label: 'Brands & Suppliers' },
  { to: '/admin/product-types', label: 'Product types' },
  { to: '/admin/product-workflow', label: 'Product workflow' },
  { to: '/admin/monitoring', label: 'Monitoring' },
]

const ORDERS_ITEMS = [
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/orders/invoices', label: 'Invoices' },
  { to: '/admin/orders/credit-slips', label: 'Credit Slips' },
  { to: '/admin/orders/delivery-slips', label: 'Delivery Slips' },
  { to: '/admin/orders/shopping-carts', label: 'Shopping Carts' },
]

const FULFILLMENT_ITEMS = [
  { to: '/admin/customers', label: 'Customers' },
  { to: '/admin/inventory', label: 'Inventory & Stock' },
  { to: '/admin/warehouses', label: 'Warehouses' },
  { to: '/admin/shipping', label: 'Shipping' },
  { to: '/admin/b2b', label: 'B2B' },
]

const SETTINGS_ITEMS = [
  { to: '/admin/users', label: 'Users & roles' },
  { to: '/admin/tax', label: 'Tax' },
  { to: '/admin/payment', label: 'Payment methods' },
]

const ChevronDown = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

const ChevronRight = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

function NavSection({ title, items, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="mb-2">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-3 py-2 text-left text-neutral-400 hover:text-white text-xs font-semibold uppercase tracking-wider"
      >
        {title}
        {open ? <ChevronDown /> : <ChevronRight />}
      </button>
      {open && (
        <div className="space-y-0.5">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm ${
                  isActive ? 'bg-neutral-700 text-white' : 'text-neutral-300 hover:bg-neutral-700/50 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

export function AdminLayout() {
  const { user } = useAuthStore()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!isStaff(user)) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen flex bg-neutral-100">
      <aside className="w-64 bg-neutral-800 text-neutral-200 flex flex-col fixed inset-y-0">
        <div className="p-4 border-b border-neutral-700">
          <Link to="/" className="text-lg font-bold text-white hover:text-neutral-200 flex items-center gap-2">
            <span>OC Mono Store</span>
            <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
          <p className="text-xs text-neutral-500 mt-1">View storefront</p>
        </div>
        <nav className="flex-1 p-4 overflow-y-auto space-y-4">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-4 ${
                isActive ? 'bg-neutral-700 text-white' : 'text-neutral-300 hover:bg-neutral-700/50 hover:text-white'
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavSection title="Catalog" items={CATALOG_ITEMS} />
          <NavSection title="Orders" items={ORDERS_ITEMS} />
          <NavSection title="Fulfillment" items={FULFILLMENT_ITEMS} defaultOpen={false} />
          <NavSection title="Settings" items={SETTINGS_ITEMS} />
        </nav>
        <div className="p-4 border-t border-neutral-700">
          <Link to="/" className="block text-sm text-neutral-400 hover:text-white">
            ← View store
          </Link>
        </div>
      </aside>
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  )
}
