import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader.jsx'
import { useAdminProductStore } from '../../stores/adminProductStore.js'

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const HelpIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const ExportIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
)

const ImportIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
)

export function AdminProducts() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [sort, setSort] = useState('newest')
  const [stock, setStock] = useState('all')
  const [featured, setFeatured] = useState(false)

  const { products, deleteProduct } = useAdminProductStore()

  return (
    <div>
      <AdminPageHeader
        title="Products"
        description="Manage product catalog. Filter by category, search by name or reference import and export."
      >
        <Link
          to="/admin/products/new"
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <span>+</span> Add new product
        </Link>
          <button type="button" className="px-4 py-2 border border-admin rounded-md text-sm font-medium hover:bg-neutral-50 flex items-center gap-2">
            Optimize product catalog
          </button>
          <button type="button" className="px-4 py-2 border border-admin rounded-md text-sm font-medium hover:bg-neutral-50 flex items-center gap-2">
            <HelpIcon /> Help
          </button>
          <button type="button" className="px-4 py-2 border border-admin rounded-md text-sm font-medium hover:bg-neutral-50 flex items-center gap-2">
            <ExportIcon /> Export
          </button>
          <button type="button" className="px-4 py-2 border border-admin rounded-md text-sm font-medium hover:bg-neutral-50 flex items-center gap-2">
            <ImportIcon /> Import
          </button>
          <Link
            to="/admin/products/batch"
            className="px-4 py-2 border border-admin rounded-md text-sm font-medium hover:bg-neutral-50"
          >
            Batch create
          </Link>
      </AdminPageHeader>

      <div className="bg-admin-bg border border-admin rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[250px]">
            <label className="block text-xs font-medium text-neutral-500 mb-1">Search</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name or description..."
              className="w-full px-3 py-2 border border-admin rounded-md text-sm bg-admin-bg"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 border border-admin rounded-md text-sm bg-admin-bg"
            >
              <option value="all">All categories</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Price min</label>
            <input
              type="text"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              placeholder="Min"
              className="w-24 px-3 py-2 border border-admin rounded-md text-sm bg-admin-bg"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Price max</label>
            <input
              type="text"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              placeholder="Max"
              className="w-24 px-3 py-2 border border-admin rounded-md text-sm bg-admin-bg"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Sort</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 border border-admin rounded-md text-sm bg-admin-bg"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="price_asc">Price: low to high</option>
              <option value="price_desc">Price: high to low</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Stock</label>
            <select
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="px-3 py-2 border border-admin rounded-md text-sm bg-admin-bg"
            >
              <option value="all">All stock</option>
              <option value="in_stock">In stock</option>
              <option value="out_of_stock">Out of stock</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
              <span className="text-sm">Featured</span>
            </label>
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
            >
              <SearchIcon /> Search
            </button>
          </div>
        </div>
      </div>

      <div className="bg-admin-bg border border-admin rounded-lg shadow overflow-hidden">
        {products.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-neutral-500 mb-4">No products yet.</p>
            <Link to="/admin/products/new" className="text-blue-600 hover:text-blue-700 font-medium">
              Add your first product
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-admin">
            {products.map((product) => (
              <div key={product.id} className="flex items-center gap-4 p-4 hover:bg-neutral-50">
                <input type="checkbox" className="rounded border-admin" />
                <div className="w-14 h-14 bg-neutral-100 rounded flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-neutral-900">{product.name}</p>
                  <p className="text-sm text-neutral-500">{product.slug}</p>
                </div>
                <div className="text-sm font-medium">${(product.price ?? 0).toFixed(2)}</div>
                <div className="text-sm text-neutral-600">{product.stock ?? 0} in stock</div>
                <div className="flex gap-2">
                  <Link
                    to={`/admin/products/${product.id}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Edit
                  </Link>
                  <Link to={`/product/${product.slug}`} className="text-neutral-500 hover:text-neutral-700 text-sm">
                    View
                  </Link>
                  <button
                    type="button"
                    onClick={() => deleteProduct(product.id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
