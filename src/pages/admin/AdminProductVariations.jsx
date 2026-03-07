import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader.jsx'
import { useAdminProductStore } from '../../stores/adminProductStore.js'

const BoxIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
)

const WrenchIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

export function AdminProductVariations() {
  const [search, setSearch] = useState('')
  const products = useAdminProductStore((s) => s.products)
  const productCount = products.length

  return (
    <div>
      <AdminPageHeader
        title="Product variations"
        description="Manage SKU, price, and stock per variation for each product. Click Manage to open a product's variations."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-admin-bg border border-admin rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              <BoxIcon />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Products</p>
              <p className="text-2xl font-bold text-neutral-900">{productCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-admin-bg border border-admin rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
              <WrenchIcon />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Manage variations</p>
              <p className="text-sm text-neutral-600">
                Open a product to add or edit SKU, price, and stock per variation.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-admin-bg border border-admin rounded-lg shadow p-4 mb-4">
        <label className="block text-sm font-medium text-neutral-700 mb-2">Search products</label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or slug..."
          className="w-full px-4 py-2 border border-admin rounded-md bg-admin-bg"
        />
      </div>

      <div className="bg-admin-bg border border-admin rounded-lg shadow p-16 min-h-[200px]">
        {productCount === 0 ? (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-400 mb-4">
              <BoxIcon />
            </div>
            <p className="text-lg font-medium text-neutral-900 mb-1">No products found</p>
            <p className="text-neutral-500 mb-6">Add products first, then manage their variations here.</p>
            <Link
              to="/admin/products"
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
            >
              Go to Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((p) => (
              <Link
                key={p.id}
                to={`/admin/products/${p.id}`}
                className="block p-4 border border-admin rounded-lg hover:bg-neutral-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-900">{p.name}</p>
                    <p className="text-sm text-neutral-500">{p.variants?.length ?? 0} variants</p>
                  </div>
                  <span className="text-blue-600 text-sm font-medium">Manage →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
