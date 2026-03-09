import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader.jsx'
import {
  Table,
  TableFilterBarWithSearch,
  TableSearchInput,
  TableSelect,
  TableFilterDropdown,
  TableCheckbox,
} from '../../components/table'
import { useAdminProductStore } from '../../stores/adminProductStore.js'
import { PER_PAGE_OPTIONS } from '../../config.js'

const HelpIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const getColumns = (deleteProduct) => [
  {
    key: 'name',
    label: 'Product',
    align: 'left',
    render: (val, row) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-neutral-100 rounded flex-shrink-0 overflow-hidden">
          {row.images?.[0] ? (
            <img src={row.images[0]} alt="" className="w-full h-full object-cover" />
          ) : null}
        </div>
        <div>
          <p className="font-medium text-neutral-900">{val}</p>
          <p className="text-sm text-neutral-500">{row.slug}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'price',
    label: 'Price',
    render: (val) => `$${(val ?? 0).toFixed(2)}`,
  },
  {
    key: 'stock',
    label: 'Stock',
    render: (val) => `${val ?? 0} in stock`,
  },
  {
    key: 'id',
    label: 'Action',
    align: 'right',
    render: (id, row) => (
      <div className="flex gap-2 justify-end">
        <Link to={`/admin/products/${id}`} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          Edit
        </Link>
        <Link to={`/product/${row.slug}`} className="text-neutral-500 hover:text-neutral-700 text-sm">
          View
        </Link>
        <button
          type="button"
          onClick={() => deleteProduct(id)}
          className="text-red-600 hover:text-red-700 text-sm"
        >
          Delete
        </button>
      </div>
    ),
  },
]

export function AdminProducts() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [sort, setSort] = useState('newest')
  const [stock, setStock] = useState('all')
  const [featured, setFeatured] = useState(false)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const { products, deleteProduct } = useAdminProductStore()

  const filtered = products
    .filter((p) => {
      if (!search.trim()) return true
      const q = search.toLowerCase()
      const name = (p.name ?? '').toLowerCase()
      const slug = (p.slug ?? '').toLowerCase()
      const desc = (p.description ?? '').toLowerCase()
      return name.includes(q) || slug.includes(q) || desc.includes(q)
    })
    .filter((p) => {
      if (category === 'all') return true
      return (p.categoryIds ?? []).includes(category)
    })
    .filter((p) => {
      const pr = parseFloat(p.price) || 0
      if (priceMin && pr < parseFloat(priceMin)) return false
      if (priceMax && pr > parseFloat(priceMax)) return false
      return true
    })
    .filter((p) => {
      if (stock === 'all') return true
      const s = p.stock ?? 0
      if (stock === 'in_stock') return s > 0
      if (stock === 'out_of_stock') return s <= 0
      return true
    })
    .filter((p) => {
      if (!featured) return true
      return p.featured === true
    })
    .sort((a, b) => {
      if (sort === 'newest') return (b.createdAt ?? '').localeCompare(a.createdAt ?? '')
      if (sort === 'oldest') return (a.createdAt ?? '').localeCompare(b.createdAt ?? '')
      if (sort === 'price_asc') return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0)
      if (sort === 'price_desc') return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0)
      return 0
    })

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const start = (page - 1) * perPage
  const paginated = filtered.slice(start, start + perPage)

  const handlePageChange = (newPage) => setPage(Math.max(1, Math.min(newPage, totalPages)))
  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage)
    setPage(1)
  }

  const filterActiveCount = [category !== 'all', priceMin, priceMax, stock !== 'all', featured].filter(Boolean).length

  useEffect(() => setPage(1), [search, category, priceMin, priceMax, sort, stock, featured])

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
          Export
        </button>
        <button type="button" className="px-4 py-2 border border-admin rounded-md text-sm font-medium hover:bg-neutral-50 flex items-center gap-2">
          Import
        </button>
        <Link
          to="/admin/products/batch"
          className="px-4 py-2 border border-admin rounded-md text-sm font-medium hover:bg-neutral-50"
        >
          Batch create
        </Link>
      </AdminPageHeader>

      <Table
        columns={getColumns(deleteProduct)}
        data={paginated}
        rowKey="id"
        filterBar={
          <TableFilterBarWithSearch
            export={{ label: 'Export', onClick: () => {} }}
            import={{ label: 'Import', onClick: () => {} }}
            search={
              <TableSearchInput
                label="Search"
                placeholder="Name or description..."
                value={search}
                onChange={setSearch}
              />
            }
            filter={
              <TableFilterDropdown
                label="Filter"
                activeCount={filterActiveCount}
                onApply={() => {}}
                onClear={() => {
                  setCategory('all')
                  setPriceMin('')
                  setPriceMax('')
                  setStock('all')
                  setFeatured(false)
                }}
              >
                <TableSelect
                  label="Category"
                  value={category}
                  onChange={setCategory}
                  options={[{ value: 'all', label: 'All categories' }]}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-500">Price min</label>
                    <input
                      type="number"
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                      placeholder="Min"
                      className="w-full px-3 py-2 border rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-500">Price max</label>
                    <input
                      type="number"
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      placeholder="Max"
                      className="w-full px-3 py-2 border rounded-md text-sm"
                    />
                  </div>
                </div>
                <TableSelect
                  label="Sort"
                  value={sort}
                  onChange={setSort}
                  options={[
                    { value: 'newest', label: 'Newest first' },
                    { value: 'oldest', label: 'Oldest first' },
                    { value: 'price_asc', label: 'Price: low to high' },
                    { value: 'price_desc', label: 'Price: high to low' },
                  ]}
                />
                <TableSelect
                  label="Stock"
                  value={stock}
                  onChange={setStock}
                  options={[
                    { value: 'all', label: 'All stock' },
                    { value: 'in_stock', label: 'In stock' },
                    { value: 'out_of_stock', label: 'Out of stock' },
                  ]}
                />
                <TableCheckbox
                  label="Featured only"
                  checked={featured}
                  onChange={setFeatured}
                />
              </TableFilterDropdown>
            }
          >
            <TableSelect
              label="Sort"
              value={sort}
              onChange={setSort}
              options={[
                { value: 'newest', label: 'Newest first' },
                { value: 'oldest', label: 'Oldest first' },
                { value: 'price_asc', label: 'Price: low to high' },
                { value: 'price_desc', label: 'Price: high to low' },
              ]}
            />
          </TableFilterBarWithSearch>
        }
        emptyState={{
          message: 'No products yet.',
          subMessage: 'Add your first product to get started.',
          actionLabel: 'Add product',
          onAction: () => navigate('/admin/products/new'),
        }}
        pagination={{
          page,
          perPage,
          total,
          onPageChange: handlePageChange,
          onPerPageChange: handlePerPageChange,
        }}
        perPageOptions={PER_PAGE_OPTIONS}
      />
    </div>
  )
}
