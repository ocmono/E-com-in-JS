import { useState } from 'react'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader.jsx'
import { Table } from '../../components/table'
import { vendors } from '../../data/adminMockData.js'

const SECTIONS = [
  { id: 'Vendors', label: 'Vendors' },
  { id: 'Product approval', label: 'Product approval' },
  { id: 'Commission rules', label: 'Commission rules' },
]

const vendorColumns = [
  { key: 'name', label: 'Name' },
  { key: 'slug', label: 'Slug' },
  { key: 'status', label: 'Status', render: () => 'Approved' },
  { key: 'commission', label: 'Commission %', render: () => '10' },
  { key: 'productCount', label: 'Products' },
]

const pendingApprovalColumns = [
  { key: 'product', label: 'Product' },
  { key: 'vendor', label: 'Vendor' },
  { key: 'submitted', label: 'Submitted' },
]

export function AdminVendors() {
  const [activeSection, setActiveSection] = useState('Vendors')
  const [userId, setUserId] = useState('')
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [status, setStatus] = useState('pending')
  const [commission, setCommission] = useState('10')

  const vendorCount = vendors.length
  const pendingProducts = []

  return (
    <div className="flex gap-8">
      <div className="flex flex-1 min-w-0 gap-6">
        {/* Left: Sections sidebar */}
        <aside className="w-48 flex-shrink-0">
          <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Sections</h3>
          <nav className="space-y-0.5">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveSection(s.id)}
                className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  activeSection === s.id
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Center: Main content */}
        <div className="flex-1 min-w-0">
          <AdminPageHeader
            title="Brands & Suppliers"
            description="Marketplace vendors (brands/suppliers). Add vendors, approve products, and set commission rules."
          >
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
            >
              + Add vendor
            </button>
          </AdminPageHeader>

          {activeSection === 'Vendors' && (
            <div className="space-y-6">
              {/* Add new vendor panel */}
              <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Vendors</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">User ID</label>
                    <input
                      type="text"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder="User UUID"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Vendor name"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Slug</label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="vendor-slug"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm"
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
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Add vendor
                </button>
              </div>

              {/* Vendors table */}
              <div className="bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden">
                <Table
                  columns={vendorColumns}
                  data={vendors}
                  rowKey="id"
                  emptyState={{
                    message: 'No vendors yet',
                    subMessage: 'Add your first vendor to get started.',
                  }}
                />
              </div>

              {/* Vendor products pending approval */}
              <div className="bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden">
                <Table
                  title="Vendor products pending approval"
                  columns={pendingApprovalColumns}
                  data={pendingProducts}
                  rowKey="id"
                  emptyState={{
                    message: 'No products pending approval',
                    subMessage: '',
                  }}
                />
              </div>

              {/* Vendor commission rules */}
              <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-neutral-900 mb-4">Vendor commission rules</h3>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Vendor</label>
                  <select className="w-full max-w-xs px-3 py-2 border border-neutral-300 rounded-md text-sm">
                    <option value="">Select vendor</option>
                    {vendors.map((v) => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'Product approval' && (
            <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-8 text-center text-neutral-500">
              Product approval section
            </div>
          )}

          {activeSection === 'Commission rules' && (
            <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-8 text-center text-neutral-500">
              Commission rules section
            </div>
          )}
        </div>
      </div>

      {/* Right sidebar */}
      <div className="w-64 flex-shrink-0 space-y-4">
        <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-4">
          <h3 className="font-semibold text-neutral-900 mb-2">Brands & Suppliers</h3>
          <p className="text-sm text-neutral-500">
            Vendors (brands/suppliers) can list products for approval. Manage vendors, product approval queue, and commission rules.
          </p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-4">
          <h3 className="font-semibold text-neutral-900 mb-1">Vendors</h3>
          <p className="text-2xl font-bold text-neutral-900">{vendorCount}</p>
          <p className="text-xs text-neutral-500">Total registered</p>
        </div>
      </div>

    </div>
  )
}
