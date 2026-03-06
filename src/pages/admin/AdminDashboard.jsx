import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminProductStore } from '../../stores/adminProductStore.js'
import { orders } from '../../data/adminMockData.js'

const PERIODS = ['Last 7 days', 'Last 30 days', 'This month', 'Last month']

const COMMERCE_LINKS = [
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/stores', label: 'Stores' },
  { to: '/admin/coupons', label: 'Coupons' },
  { to: '/admin/inventory', label: 'Inventory' },
  { to: '/admin/shipping', label: 'Shipping' },
  { to: '/admin/tax', label: 'Tax' },
  { to: '/admin/payment', label: 'Payment' },
  { to: '/admin/checkout-flow', label: 'Checkout flow' },
  { to: '/admin/product-types', label: 'Product types' },
  { to: '/admin/attributes', label: 'Attributes' },
  { to: '/admin/categories', label: 'Categories' },
]

const CONTENT_LINKS = [
  { to: '/admin/pages', label: 'Pages' },
  { to: '/admin/blog', label: 'Blog' },
]

export function AdminDashboard() {
  const [period, setPeriod] = useState('Last 30 days')
  const [fromDate, setFromDate] = useState('2026-02-06')
  const [toDate, setToDate] = useState('2026-03-06')

  const products = useAdminProductStore((s) => s.products)
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
          <p className="text-neutral-500 mt-1">Overview of products, orders, and revenue.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded text-sm font-medium border ${
                period === p ? 'bg-blue-600 text-white border-transparent' : 'bg-admin-bg text-neutral-700 border-admin hover:bg-neutral-50'
              }`}
            >
              {p}
            </button>
          ))}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-3 py-1.5 border border-admin rounded text-sm bg-admin-bg"
            />
            <span className="text-neutral-400">To</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="px-3 py-1.5 border border-admin rounded text-sm bg-admin-bg"
            />
          </div>
          <button
            type="button"
            className="px-3 py-1.5 bg-admin-bg border border-admin hover:bg-neutral-50 rounded text-sm font-medium"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-admin-bg border border-admin rounded-lg shadow p-6">
          <p className="text-sm text-neutral-500">Total products</p>
          <p className="text-2xl font-bold text-neutral-900">{products.length}</p>
          <Link to="/admin/products" className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block">
            Manage →
          </Link>
        </div>
        <div className="bg-admin-bg border border-admin rounded-lg shadow p-6">
          <p className="text-sm text-neutral-500">Orders (period)</p>
          <p className="text-2xl font-bold text-neutral-900">{orders.length}</p>
          <Link to="/admin/orders" className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block">
            View all →
          </Link>
        </div>
        <div className="bg-admin-bg border border-admin rounded-lg shadow p-6">
          <p className="text-sm text-neutral-500">Revenue (period)</p>
          <p className="text-2xl font-bold text-blue-600">${totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-admin-bg border border-admin rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Orders by status</h2>
          {orders.length === 0 ? (
            <p className="text-neutral-500">No orders in this period.</p>
          ) : (
            <ul className="space-y-2">
              {[...new Set(orders.map((o) => o.status))].map((status) => (
                <li key={status} className="flex justify-between text-sm">
                  <span className="capitalize">{status}</span>
                  <span className="font-medium">{orders.filter((o) => o.status === status).length}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-admin-bg border border-admin rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Top products by revenue</h2>
          <p className="text-neutral-500">No sales in this period.</p>
        </div>
      </div>

      <div className="bg-admin-bg border border-admin rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Recent orders</h2>
        {orders.length === 0 ? (
          <p className="text-neutral-500">No orders yet.</p>
        ) : (
          <ul className="divide-y divide-admin">
            {orders.slice(0, 5).map((o) => (
              <li key={o.id} className="py-3 flex justify-between">
                <span className="font-medium">{o.orderNumber}</span>
                <span className="text-neutral-600">${o.total?.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Quick links</h2>
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium text-neutral-500 mb-2">Commerce</p>
            <div className="flex flex-wrap gap-2">
              {COMMERCE_LINKS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="px-4 py-2 bg-admin-bg border border-admin hover:bg-neutral-50 rounded-md text-sm font-medium text-neutral-700"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500 mb-2">Content</p>
            <div className="flex flex-wrap gap-2">
              {CONTENT_LINKS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="px-4 py-2 bg-admin-bg border border-admin hover:bg-neutral-50 rounded-md text-sm font-medium text-neutral-700"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
