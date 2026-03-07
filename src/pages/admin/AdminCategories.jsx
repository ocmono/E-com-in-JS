import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader.jsx'
import { categories } from '../../data/adminMockData.js'

const FolderIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
)

const BoxIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
)

export function AdminCategories() {
  const [search, setSearch] = useState('')
  const totalCategories = categories.length
  const emptyCategories = categories.filter((c) => (c.productCount ?? 0) === 0).length
  const avgProducts = totalCategories > 0
    ? (categories.reduce((s, c) => s + (c.productCount ?? 0), 0) / totalCategories).toFixed(1)
    : '0'

  return (
    <div>
      <AdminPageHeader
        title="Categories"
        description="Product categories. Add or edit categories, then assign products in the product editor."
      >
        <Link
          to="/admin/categories/new"
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <span>+</span> Add category
        </Link>
      </AdminPageHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-admin-bg border border-admin rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              <FolderIcon />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Total categories</p>
              <p className="text-2xl font-bold text-neutral-900">{totalCategories}</p>
            </div>
          </div>
        </div>
        <div className="bg-admin-bg border border-admin rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
              <FolderIcon />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Empty categories</p>
              <p className="text-2xl font-bold text-neutral-900">{emptyCategories}</p>
            </div>
          </div>
        </div>
        <div className="bg-admin-bg border border-admin rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
              <BoxIcon />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Avg products per category</p>
              <p className="text-2xl font-bold text-neutral-900">{avgProducts}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-admin-bg border border-admin rounded-lg shadow p-4 mb-6">
        <label className="block text-sm font-medium text-neutral-700 mb-2">Search</label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or slug..."
          className="w-full px-4 py-2 border border-admin rounded-md bg-admin-bg"
        />
      </div>

      <div className="bg-admin-bg border border-admin rounded-lg shadow p-16 min-h-[200px]">
        {totalCategories === 0 ? (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-400 mb-4">
              <FolderIcon />
            </div>
            <p className="text-lg font-medium text-neutral-900 mb-1">No categories yet</p>
            <p className="text-neutral-500 mb-6">
              Add a category to organize your products (e.g. Cleansers, Serums, Moisturizers).
            </p>
            <Link
              to="/admin/categories/new"
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 flex items-center gap-2 w-fit"
            >
              <span>+</span> Add category
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-4 border border-admin rounded-lg hover:bg-neutral-50"
              >
                <div>
                  <p className="font-medium text-neutral-900">{cat.name}</p>
                  <p className="text-sm text-neutral-500">{cat.slug} · {cat.productCount ?? 0} products</p>
                </div>
                <Link to={`/admin/categories/${cat.id}`} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Edit
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
