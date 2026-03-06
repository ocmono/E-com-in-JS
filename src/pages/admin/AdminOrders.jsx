import { useState } from 'react'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs.jsx'
import { orders } from '../../data/adminMockData.js'

const StarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
)

const HelpIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
)

export function AdminOrders() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [payment, setPayment] = useState('all')
  const [newClient, setNewClient] = useState('all')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  return (
    <div>
      <AdminBreadcrumbs items={[{ label: 'Dashboard', to: '/admin' }, { label: 'Orders' }]} />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Orders</h1>
          <p className="text-neutral-500 mt-1">
            Order management (OMS). View and manage orders, update status, print invoices and packing slips.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            + Add new order
          </button>
          <button type="button" className="px-4 py-2 border border-admin rounded-md text-sm font-medium hover:bg-neutral-50 flex items-center gap-2">
            <StarIcon /> Boost sales
          </button>
          <button type="button" className="px-4 py-2 border border-admin rounded-md text-sm font-medium hover:bg-neutral-50 flex items-center gap-2">
            <HelpIcon /> Help
          </button>
          <button type="button" className="px-4 py-2 border border-admin rounded-md text-sm font-medium hover:bg-neutral-50 flex items-center gap-2">
            <DownloadIcon /> Export CSV
          </button>
          <button type="button" className="px-4 py-2 border border-admin rounded-md text-sm font-medium hover:bg-neutral-50 flex items-center gap-2">
            <DownloadIcon /> Export PDF
          </button>
        </div>
      </div>

      <div className="bg-admin-bg border border-admin rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-neutral-500 mb-1">Order number / ID</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-2 border border-admin rounded-md text-sm bg-admin-bg"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 border border-admin rounded-md text-sm bg-admin-bg"
            >
              <option value="all">All statuses</option>
              <option value="placed">Placed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Payment</label>
            <select
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              className="px-3 py-2 border border-admin rounded-md text-sm bg-admin-bg"
            >
              <option value="all">All</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">New client</label>
            <select
              value={newClient}
              onChange={(e) => setNewClient(e.target.value)}
              className="px-3 py-2 border border-admin rounded-md text-sm bg-admin-bg"
            >
              <option value="all">All</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">From date</label>
            <input
              type="text"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              placeholder="dd-mm-yyyy"
              className="w-32 px-3 py-2 border border-admin rounded-md text-sm bg-admin-bg"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">To date</label>
            <input
              type="text"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              placeholder="dd-mm-yyyy"
              className="w-32 px-3 py-2 border border-admin rounded-md text-sm bg-admin-bg"
            />
          </div>
        </div>
      </div>

      <div className="bg-admin-bg border border-admin rounded-lg shadow overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-16 text-center text-neutral-500">No orders yet</div>
        ) : (
          <div className="divide-y divide-admin">
            {orders.map((o) => (
              <div key={o.id} className="flex items-center gap-4 p-4 hover:bg-neutral-50">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-neutral-900">{o.orderNumber}</p>
                  <p className="text-sm text-neutral-500">{o.customer}</p>
                </div>
                <div className="text-sm font-medium">${(o.total ?? 0).toFixed(2)}</div>
                <div className="text-sm capitalize px-2 py-1 bg-neutral-100 rounded">{o.status}</div>
                <div className="text-sm text-neutral-600">{o.createdAt?.slice(0, 10)}</div>
                <button type="button" className="text-blue-600 hover:text-blue-700 text-sm font-medium">View</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
