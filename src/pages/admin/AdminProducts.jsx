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
import { listProducts, deleteProduct as deleteProductApi, listVariations } from '../../api/productVaration.js'
import { PER_PAGE_OPTIONS } from '../../config.js'

const HelpIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

/** Get first image URL from API shape: images[] as string[] or { alt_name, img_url }[] */
const getFirstImageUrl = (images) => {
  if (!images?.length) return null
  const first = images[0]
  return typeof first === 'string' ? first : first?.img_url ?? first?.url ?? null
}

const getColumns = (onDelete, loading, variationMap = {}) => [
  {
    key: 'title',
    label: 'Product',
    align: 'left',
    render: (val, row) => {
      const imgUrl = getFirstImageUrl(row.images)
      return (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-neutral-100 rounded flex-shrink-0 overflow-hidden">
            {imgUrl ? (
              <img src={imgUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">—</div>
            )}
          </div>
          <div>
            <p className="font-medium text-neutral-900">{val || '—'}</p>
            <p className="text-sm text-neutral-500">{row.brand || '—'}</p>
          </div>
        </div>
      )
    },
  },
  {
    key: 'variations',
    label: 'Variations',
    render: (_, row) => {
      const pid = row.id != null ? row.id : row.product_id ?? row.productId
      const titles = variationMap?.[pid] ?? variationMap?.[String(pid)] ?? []
      if (!titles.length) {
        return <span className="text-neutral-400 text-sm">—</span>
      }
      const shown = titles.slice(0, 3).join(', ')
      const extraCount = titles.length - 3
      return (
        <span className="text-neutral-600 text-sm">
          {shown}
          {extraCount > 0 ? ` +${extraCount} more` : ''}
        </span>
      )
    },
  },
  {
    key: 'description',
    label: 'Description',
    render: (val, row) => {
      const text = val ?? row.body ?? ''
      return (
        <span className="text-neutral-600 text-sm line-clamp-2 max-w-[600px]">{text || '—'}</span>
      )
    },
  },
  {
    key: 'product_type_id',
    label: 'Type',
    render: (val) => <span className="text-neutral-600 text-sm">{val != null ? val : '—'}</span>,
  },
  {
    key: 'tags',
    label: 'Tags',
    render: (val) => (
      <span className="text-neutral-600 text-sm line-clamp-1 max-w-[120px]">
        {Array.isArray(val) && val.length ? val.join(', ') : '—'}
      </span>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    render: (val) => (
      <span className={`text-xs px-2 py-0.5 rounded ${val ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'}`}>
        {val ? 'Active' : 'Inactive'}
      </span>
    ),
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
        <Link to={`/product/${id}`} className="text-neutral-500 hover:text-neutral-700 text-sm">
          View
        </Link>
        <button
          type="button"
          onClick={() => onDelete(id)}
          disabled={loading}
          className="text-red-600 hover:text-red-700 text-sm disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    ),
  },
]

export function AdminProducts() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [sort, setSort] = useState('newest')
  const [stock, setStock] = useState('all')
  const [featured, setFeatured] = useState(false)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [variationTitlesByProduct, setVariationTitlesByProduct] = useState({})

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const [productsRes, variationsRes] = await Promise.all([listProducts(), listVariations()])

      const productList = Array.isArray(productsRes) ? productsRes : productsRes?.data ?? productsRes?.products ?? []
      const productsArray = Array.isArray(productList) ? productList : []

      const variationsRaw = Array.isArray(variationsRes)
        ? variationsRes
        : variationsRes?.data ?? variationsRes?.variations ?? []
      const variationsArray = Array.isArray(variationsRaw) ? variationsRaw : []

      const map = {}
      for (const v of variationsArray) {
        const pid = v.product_id ?? v.productId
        if (!pid) continue
        const title = v.title
        if (!title) continue
        const key = String(pid)
        if (!map[key]) map[key] = []
        map[key].push(title)
      }

      setProducts(productsArray)
      setVariationTitlesByProduct(map)
    } catch (err) {
      console.error('Failed to fetch products:', err)
      setProducts([])
      setVariationTitlesByProduct({})
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async (productId) => {
    if (!confirm('Delete this product?')) return
    setDeleting(true)
    try {
      await deleteProductApi(productId)
      await fetchProducts()
    } catch (err) {
      console.error('Failed to delete product:', err)
      alert('Failed to delete product.')
    } finally {
      setDeleting(false)
    }
  }

  const filtered = products
    .filter((p) => {
      if (!search.trim()) return true
      const q = search.toLowerCase()
      const title = (p.title ?? '').toLowerCase()
      const description = (p.description ?? p.body ?? '').toLowerCase()
      const brand = (p.brand ?? '').toLowerCase()
      const tags = (p.tags ?? []).join(' ').toLowerCase()
      return title.includes(q) || description.includes(q) || brand.includes(q) || tags.includes(q)
    })
    .filter((p) => {
      if (category === 'all') return true
      if ((p.categoryIds ?? []).includes(category)) return true
      return String(p.product_type_id) === category
    })
    .filter((p) => {
      const pr = parseFloat(p.base_price ?? p.price) || 0
      if (priceMin && pr < parseFloat(priceMin)) return false
      if (priceMax && pr > parseFloat(priceMax)) return false
      return true
    })
    .filter((p) => {
      if (stock === 'all') return true
      const s = p.base_stock ?? p.stock ?? 0
      if (stock === 'in_stock') return s > 0
      if (stock === 'out_of_stock') return s <= 0
      return true
    })
    .filter((p) => {
      if (!featured) return true
      return p.featured === true
    })
    .sort((a, b) => {
      if (sort === 'newest') return (b.created_at ?? '').localeCompare(a.created_at ?? '')
      if (sort === 'oldest') return (a.created_at ?? '').localeCompare(b.created_at ?? '')
      const priceA = parseFloat(a.base_price ?? a.price) || 0
      const priceB = parseFloat(b.base_price ?? b.price) || 0
      if (sort === 'price_asc') return priceA - priceB
      if (sort === 'price_desc') return priceB - priceA
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
        columns={getColumns(handleDelete, deleting, variationTitlesByProduct)}
        data={loading ? [] : paginated}
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
          message: loading ? 'Loading products...' : 'No products yet.',
          subMessage: loading ? '' : 'Add your first product to get started.',
          actionLabel: loading ? undefined : 'Add product',
          onAction: loading ? undefined : () => navigate('/admin/products/new'),
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
