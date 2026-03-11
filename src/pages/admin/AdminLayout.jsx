/**
 * Admin layout - sidebar + outlet. Staff only.
 */

import { useState } from 'react'
import { Link, NavLink, Outlet, Navigate, useLocation } from 'react-router-dom'
import { useAuthStore, isStaff } from '../../stores/authStore.js'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs.jsx'

/** Derive breadcrumb items from current admin pathname. */
function getBreadcrumbs(pathname) {
  const base = '/admin'
  if (pathname === base || pathname === base + '/') {
    return [{ label: 'Dashboard' }]
  }
  const rest = pathname.slice(base.length).replace(/^\//, '')
  const segments = rest.split('/').filter(Boolean)

  // Catalog section
  if (rest.startsWith('products') || rest.startsWith('product-variations') || rest.startsWith('categories') ||
      rest.startsWith('attributes') || rest.startsWith('vendors') || rest.startsWith('product-types') ||
      rest.startsWith('product-workflow') || rest.startsWith('monitoring')) {
    const catalogParent = { label: 'Catalog', to: '/admin/products' }
    if (rest === 'products') return [catalogParent, { label: 'Products' }]
    if (rest === 'products/new') return [catalogParent, { label: 'Products', to: '/admin/products' }, { label: 'Add product' }]
    if (rest === 'products/batch') return [catalogParent, { label: 'Products', to: '/admin/products' }, { label: 'Batch create' }]
    if (/^products\/[^/]+\/variations\/new$/.test(rest)) {
      const id = segments[1]
      return [catalogParent, { label: 'Products', to: '/admin/products' }, { label: 'Product', to: `/admin/products/${id}` }, { label: 'Variations', to: `/admin/products/${id}/variations` }, { label: 'Add variation' }]
    }
    if (/^products\/[^/]+\/variations\/[^/]+$/.test(rest) && segments.length === 4) {
      const id = segments[1]
      return [catalogParent, { label: 'Products', to: '/admin/products' }, { label: 'Product', to: `/admin/products/${id}` }, { label: 'Variations', to: `/admin/products/${id}/variations` }, { label: 'Edit variation' }]
    }
    if (/^products\/[^/]+\/variations$/.test(rest)) {
      const id = segments[1]
      return [catalogParent, { label: 'Products', to: '/admin/products' }, { label: 'Product', to: `/admin/products/${id}` }, { label: 'Variations' }]
    }
    if (/^products\/[^/]+$/.test(rest)) return [catalogParent, { label: 'Products', to: '/admin/products' }, { label: 'Edit' }]
    if (rest === 'product-variations') return [catalogParent, { label: 'Product variations' }]
    if (rest === 'categories') return [catalogParent, { label: 'Categories' }]
    if (rest === 'categories/new') return [catalogParent, { label: 'Categories', to: '/admin/categories' }, { label: 'Add category' }]
    if (/^categories\/[^/]+$/.test(rest)) return [catalogParent, { label: 'Categories', to: '/admin/categories' }, { label: 'Edit' }]
    if (rest === 'attributes') return [catalogParent, { label: 'Attributes & Features' }]
    if (rest === 'vendors') return [catalogParent, { label: 'Brands & Suppliers' }]
    if (rest === 'product-types') return [catalogParent, { label: 'Product types' }]
    if (rest === 'product-workflow') return [catalogParent, { label: 'Product workflow' }]
    if (rest === 'monitoring') return [catalogParent, { label: 'Monitoring' }]
  }

  // Orders section
  if (rest.startsWith('orders')) {
    const ordersParent = { label: 'Orders', to: '/admin/orders' }
    if (rest === 'orders') return [{ label: 'Dashboard', to: '/admin' }, { label: 'Orders' }]
    if (rest === 'orders/invoices') return [ordersParent, { label: 'Invoices' }]
    if (rest === 'orders/credit-slips') return [ordersParent, { label: 'Credit Slips' }]
    if (rest === 'orders/delivery-slips') return [ordersParent, { label: 'Delivery Slips' }]
    if (rest === 'orders/shopping-carts') return [ordersParent, { label: 'Shopping Carts' }]
  }

  // Fulfillment section
  const fulfillmentParent = { label: 'Fulfillment', to: '/admin/customers' }
  if (rest === 'customers') return [fulfillmentParent, { label: 'Customers' }]
  if (rest === 'inventory') return [fulfillmentParent, { label: 'Inventory & Stock' }]
  if (rest === 'warehouses') return [fulfillmentParent, { label: 'Warehouses' }]
  if (rest === 'shipping') return [fulfillmentParent, { label: 'Shipping' }]
  if (rest === 'b2b') return [fulfillmentParent, { label: 'B2B' }]

  // Settings section
  const settingsParent = { label: 'Settings', to: '/admin/users' }
  if (rest === 'users') return [settingsParent, { label: 'Users & roles' }]
  if (rest === 'tax') return [settingsParent, { label: 'Tax' }]
  if (rest === 'payment') return [settingsParent, { label: 'Payment methods' }]

  // Placeholder / misc
  if (rest === 'coupons') return [{ label: 'Dashboard', to: '/admin' }, { label: 'Coupons' }]
  if (rest === 'stores') return [{ label: 'Dashboard', to: '/admin' }, { label: 'Stores' }]
  if (rest === 'checkout-flow') return [settingsParent, { label: 'Checkout flow' }]
  if (rest === 'pages') return [{ label: 'Content', to: '/admin/pages' }, { label: 'Pages' }]
  if (rest === 'blog') return [{ label: 'Content', to: '/admin/blog' }, { label: 'Blog' }]

  // Fallback: use segment labels
  const labels = { products: 'Products', categories: 'Categories', orders: 'Orders' }
  const items = [{ label: 'Dashboard', to: '/admin' }]
  let to = base
  for (let i = 0; i < segments.length; i++) {
    to += '/' + segments[i]
    const label = labels[segments[i]] || segments[i].replace(/-/g, ' ')
    items.push(i === segments.length - 1 ? { label } : { label, to })
  }
  return items
}

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
                `flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-500/25 backdrop-blur-sm text-white border-l-2 border-blue-400 -ml-[2px] pl-[14px]'
                    : 'text-neutral-300 hover:bg-neutral-700/50 hover:text-white'
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
  const location = useLocation()
  const breadcrumbs = getBreadcrumbs(location.pathname)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!isStaff(user)) {
    return <Navigate to="/" replace />
  }

  return (
    // <div className="min-h-screen flex bg-neutral-100">
    <div className="min-h-screen flex bg-[#f6f8fa]">
      <aside className="w-64 bg-neutral-900 text-neutral-200 flex flex-col fixed inset-y-0">
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
              `flex items-center gap-2 px-3 py-2 rounded-sm text-sm mb-4 transition-colors ${
                isActive
                  ? 'bg-blue-500/25 backdrop-blur-sm text-white border-l-2 border-blue-400 -ml-[2px] pl-[14px]'
                  : 'text-neutral-300 hover:bg-neutral-700/50 hover:text-white'
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
        <AdminBreadcrumbs items={breadcrumbs} />
        <Outlet />
      </main>
    </div>
  )
}
