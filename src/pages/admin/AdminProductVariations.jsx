import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AdminPageHeader } from "../../components/admin/AdminPageHeader.jsx"
import { Table, TableFilterBarWithSearch, TableSearchInput } from "../../components/table"
import { listProducts } from "../../api/productVaration.js"
import { listVariations } from "../../api/productVaration.js"
import { PER_PAGE_OPTIONS } from "../../config.js"

const columns = [
  { key: "productName", label: "Product" },
  { key: "title", label: "Title" },
  { key: "sku", label: "SKU" },
  {
    key: "price",
    label: "Price",
    render: (val) => (val != null ? `$${Number(val).toFixed(2)}` : "—"),
  },
  {
    key: "status",
    label: "Status",
    render: (val) => (
      <span
        className={`text-xs px-2 py-0.5 rounded ${
          val ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-600"
        }`}
      >
        {val ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    key: "weight",
    label: "Weight",
    render: (val) => (val != null ? String(val) : "—"),
  },
  { key: "stock", label: "Stock", render: (val) => (val != null ? String(val) : "—") },
  {
    key: "id",
    label: "Action",
    align: "right",
    render: (id, row) => (
      <Link
        to={`/admin/products/${row.product_id}/variations/${id}`}
        className="text-blue-600 font-medium hover:underline"
      >
        Edit →
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
  const [loading, setLoading] = useState(true)
  const [allVariations, setAllVariations] = useState([])
  const [productCount, setProductCount] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function fetchAll() {
      setLoading(true)
      try {
        const [productsRes, variationsRes] = await Promise.all([
          listProducts(),
          listVariations(),
        ])
        const products = Array.isArray(productsRes) ? productsRes : productsRes?.data ?? productsRes?.products ?? []
        const productList = Array.isArray(products) ? products : []
        const variationsRaw = Array.isArray(variationsRes) ? variationsRes : variationsRes?.data ?? variationsRes?.variations ?? []
        const variationsList = Array.isArray(variationsRaw) ? variationsRaw : []

        const productMap = new Map(
          productList.map((p) => [String(p.id), p.title || p.name || `Product ${p.id}`])
        )

        let flattened = variationsList.map((v) => ({
          ...v,
          product_id: v.product_id ?? v.productId,
          productName: productMap.get(String(v.product_id ?? v.productId)) ?? `Product ${v.product_id ?? v.productId}`,
        }))

        if (flattened.length === 0 && productList.length > 0) {
          const byProduct = await Promise.all(
            productList.map(async (p) => {
              try {
                const res = await listVariations({ product_id: p.id })
                const list = Array.isArray(res) ? res : res?.data ?? res?.variations ?? []
                return (Array.isArray(list) ? list : []).map((v) => ({
                  ...v,
                  product_id: p.id,
                  productName: p.title || p.name || `Product ${p.id}`,
                }))
              } catch {
                return []
              }
            })
          )
          flattened = byProduct.flat()
        }

        if (!cancelled) {
          setAllVariations(flattened)
          setProductCount(productList.length)
        }
      } catch (err) {
        console.error("Failed to fetch variations:", err)
        if (!cancelled) setAllVariations([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchAll()
    return () => { cancelled = true }
  }, [])

  const filtered = allVariations.filter(
    (v) =>
      (v.productName && v.productName.toString().toLowerCase().includes(search.toLowerCase())) ||
      (v.title && v.title.toString().toLowerCase().includes(search.toLowerCase())) ||
      (v.sku && v.sku.toString().toLowerCase().includes(search.toLowerCase()))
  )

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
        description="All SKU, price, and stock per variation. Edit a variation or go to a product to add new ones."
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
              Total variations
            </p>
            <p className="text-2xl font-bold text-neutral-900">
              {loading ? "…" : total}
            </p>
          </div>
        </div>

      </div>

      {loading ? (
        <p className="text-neutral-500 py-4">Loading variations…</p>
      ) : (
        <Table
          columns={columns}
          data={paginated}
          rowKey="id"
          filterBar={
            <TableFilterBarWithSearch
              search={
                <TableSearchInput
                  label="Search variations"
                  placeholder="Search by product, title or SKU…"
                  value={search}
                  onChange={setSearch}
                />
              }
            />
          }
          emptyState={{
            message: "No variations found",
            subMessage: "Add products and create variations from the product page.",
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
      )}

    </div>
  )
}