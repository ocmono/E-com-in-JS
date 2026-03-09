import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AdminPageHeader } from "../../components/admin/AdminPageHeader.jsx"
import { Table, TableFilterBarWithSearch, TableSearchInput } from "../../components/table"
import { useAdminProductStore } from "../../stores/adminProductStore.js"
import { PER_PAGE_OPTIONS } from "../../config.js"

const columns = [
  { key: "name", label: "Product" },
  {
    key: "variants",
    label: "Variants",
    render: (val) => val?.length ?? 0,
  },
  {
    key: "id",
    label: "Action",
    align: "right",
    render: (id, row) => (
      <Link
        to={`/admin/products/${row.id}`}
        className="text-blue-600 font-medium hover:underline"
      >
        Manage →
      </Link>
    ),
  },
]

const BoxIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
)

const WrenchIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M19.4 15a1.65 1.65 0 01.33 1.82l-1 1.73a1.65 1.65 0 01-2.24.61l-1.5-.87a6.5 6.5 0 01-2.3.14l-.63 1.63a1.65 1.65 0 01-1.54 1.04h-2a1.65 1.65 0 01-1.54-1.04l-.63-1.63a6.5 6.5 0 01-2.3-.14l-1.5.87a1.65 1.65 0 01-2.24-.61l-1-1.73A1.65 1.65 0 014.6 15l1.5-.87a6.5 6.5 0 010-2.28l-1.5-.87a1.65 1.65 0 01-.33-1.82l1-1.73a1.65 1.65 0 012.24-.61l1.5.87a6.5 6.5 0 012.3-.14l.63-1.63A1.65 1.65 0 0113 3h2a1.65 1.65 0 011.54 1.04l.63 1.63a6.5 6.5 0 012.3.14l1.5-.87a1.65 1.65 0 012.24.61l1 1.73a1.65 1.65 0 01-.33 1.82l-1.5.87a6.5 6.5 0 010 2.28L19.4 15z"/>
  </svg>
)

export function AdminProductVariations() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const products = useAdminProductStore((s) => s.products)

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.slug?.toLowerCase().includes(search.toLowerCase())
  )

  const productCount = products.length
  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const start = (page - 1) * perPage
  const paginated = filtered.slice(start, start + perPage)

  const handlePageChange = (newPage) => setPage(Math.max(1, Math.min(newPage, totalPages)))
  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage)
    setPage(1)
  }

  useEffect(() => setPage(1), [search])

  return (
    <div>

      <AdminPageHeader
        title="Product variations"
        description="Manage SKU, price, and stock per variation for each product. Click Manage to open a product's variations."
      />

      {/* TOP CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        <div className="bg-white border rounded-lg shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
            <BoxIcon />
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">
              Products
            </p>
            <p className="text-2xl font-bold text-neutral-900">
              {productCount}
            </p>
          </div>
        </div>


        <div className="bg-white border rounded-lg shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
            <WrenchIcon />
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">
              Manage Variations
            </p>

            <p className="text-sm text-neutral-600">
              Open a product to add or edit SKU, price, and stock per variation.
            </p>
          </div>
        </div>

      </div>


      <Table
        columns={columns}
        data={paginated}
        rowKey="id"
        filterBar={
          <TableFilterBarWithSearch
            search={
              <TableSearchInput
                label="Search products"
                placeholder="Search by name or slug..."
                value={search}
                onChange={setSearch}
              />
            }
          />
        }
        emptyState={{
          message: "No products found",
          subMessage: "Add products first, then manage their variations here.",
          actionLabel: "Go to Products",
          onAction: () => navigate("/admin/products"),
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