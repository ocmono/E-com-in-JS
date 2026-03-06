import { useState } from 'react'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs.jsx'
import { vendors } from '../../data/adminMockData.js'

const SECTIONS = ['Vendors', 'Product approval', 'Commission rules']

export function AdminVendors() {
  const [activeSection, setActiveSection] = useState('Vendors')
  const [userId, setUserId] = useState('')
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [status, setStatus] = useState('pending')
  const [commission, setCommission] = useState('10')

  const vendorCount = vendors.length

  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0">
        <AdminBreadcrumbs items={[{ label: 'Catalog', to: '/admin/products' }, { label: 'Brands & Suppliers' }]} />
        <h1 className="text-2xl font-bold text-neutral-900">Brands & Suppliers</h1>
        <p className="text-neutral-500 mt-1 mb-6">
          Marketplace vendors (brands/suppliers). Add vendors, approve products, and set commission rules.
        </p>

        <div className="flex gap-4 mb-6 border-b border-admin pb-2">
          {SECTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setActiveSection(s)}
              className={`px-3 py-2 text-sm font-medium rounded ${
                activeSection === s ? 'bg-blue-600 text-white' : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {activeSection === 'Vendors' && (
          <>
            <div className="bg-admin-bg border border-admin rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Add new vendor</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">User ID</label>
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="User UUID"
                    className="w-full px-3 py-2 border border-admin rounded-md text-sm bg-admin-bg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Vendor name"
                    className="w-full px-3 py-2 border border-admin rounded-md text-sm bg-admin-bg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="vendor-slug"
                    className="w-full px-3 py-2 border border-admin rounded-md text-sm bg-admin-bg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-admin rounded-md text-sm bg-admin-bg"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Commission %</label>
                  <input
                    type="number"
                    value={commission}
                    onChange={(e) => setCommission(e.target.value)}
                    className="w-full px-3 py-2 border border-admin rounded-md text-sm bg-admin-bg"
                  />
                </div>
              </div>
              <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                Add vendor
              </button>
            </div>

            <div className="bg-admin-bg border border-admin rounded-lg shadow overflow-hidden mb-6">
              <table className="min-w-full divide-y divide-admin">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Slug</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Commission %</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Products</th>
                  </tr>
                </thead>
                <tbody className="bg-admin-bg divide-y divide-admin">
                  {vendors.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">No vendors yet</td>
                    </tr>
                  ) : (
                    vendors.map((v) => (
                      <tr key={v.id}>
                        <td className="px-6 py-4 text-sm font-medium">{v.name}</td>
                        <td className="px-6 py-4 text-sm text-neutral-600">{v.slug}</td>
                        <td className="px-6 py-4 text-sm">Approved</td>
                        <td className="px-6 py-4 text-sm">10</td>
                        <td className="px-6 py-4 text-sm">{v.productCount ?? 0}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-admin-bg border border-admin rounded-lg shadow p-6 mb-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Vendor products pending approval</h3>
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left text-xs font-medium text-neutral-500 uppercase py-2">Product</th>
                    <th className="text-left text-xs font-medium text-neutral-500 uppercase py-2">Vendor</th>
                    <th className="text-left text-xs font-medium text-neutral-500 uppercase py-2">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-neutral-500">No products pending approval</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-admin-bg border border-admin rounded-lg shadow p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Vendor commission rules</h3>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Vendor</label>
                <select className="w-full max-w-xs px-3 py-2 border border-admin rounded-md text-sm bg-admin-bg">
                  <option value="">Select vendor</option>
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}

        {activeSection === 'Product approval' && (
          <div className="bg-admin-bg border border-admin rounded-lg shadow p-8 text-center text-neutral-500">
            Product approval section
          </div>
        )}

        {activeSection === 'Commission rules' && (
          <div className="bg-admin-bg border border-admin rounded-lg shadow p-8 text-center text-neutral-500">
            Commission rules section
          </div>
        )}
      </div>

      <div className="w-64 flex-shrink-0 space-y-4">
        <div className="bg-admin-bg border border-admin rounded-lg shadow p-4">
          <h3 className="font-semibold text-neutral-900 mb-2">Brands & Suppliers</h3>
          <p className="text-sm text-neutral-500">Manage vendors, product approval, and commission rules.</p>
        </div>
        <div className="bg-admin-bg border border-admin rounded-lg shadow p-4">
          <h3 className="font-semibold text-neutral-900 mb-1">Vendors</h3>
          <p className="text-2xl font-bold text-neutral-900">{vendorCount}</p>
          <p className="text-xs text-neutral-500">Total registered</p>
        </div>
      </div>
    </div>
  )
}
