/**
 * Catalog page - category tabs, product listing.
 */

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../api/productApi.js'
import { useCartStore } from '../stores/cartStore.js'
import { ProductCard } from '../components/ProductCard.jsx'

const CATEGORIES = [
  { id: 'all', label: 'ALL PRODUCTS' },
  { id: 'new', label: 'NEW ARRIVALS' },
  { id: 'bestsellers', label: 'BEST SELLERS' },
  { id: 'sale', label: 'SALE ITEMS' },
]

export function Catalog() {
  const [page, setPage] = useState(1)
  const [activeCategory, setActiveCategory] = useState('all')
  const addItem = useCartStore((s) => s.addItem)

  const { data, isLoading } = useQuery({
    queryKey: ['products', page, activeCategory],
    queryFn: () =>
      getProducts({
        page,
        limit: 12,
        ...(activeCategory && activeCategory !== 'all' && { categoryId: activeCategory }),
      }),
    staleTime: 60 * 1000,
    retry: false,
  })

  const products = data?.data ?? data ?? []
  const totalPages = data?.totalPages ?? 1
  const filteredProducts = useMemo(() => products, [products])

  const handleAddToCart = (e, product) => {
    e.preventDefault()
    addItem({
      productId: product.id,
      quantity: 1,
      product,
      price: product.price ?? product.base_price ?? 0,
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Category tabs */}
      <div className="flex gap-8 border-b border-neutral-200 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`pb-3 text-[0.8rem] font-medium uppercase tracking-wider transition-colors border-b-2 -mb-px ${
              activeCategory === cat.id
                ? 'text-store-accent border-store-accent'
                : 'text-neutral-400 border-transparent hover:text-neutral-600'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <section>
        {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-neutral-200 rounded-lg" />
              <div className="mt-2 h-4 bg-neutral-200 rounded w-3/4" />
              <div className="mt-2 h-4 bg-neutral-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-neutral-200">
          <p className="text-neutral-500">No products in this category. View catalog</p>
          <Link
            to="/"
            className="mt-6 inline-block px-8 py-3 bg-store-accent hover:bg-[var(--store-accent-hover)] text-white font-semibold uppercase text-sm tracking-wider rounded-md transition-colors"
          >
            View more products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      </section>

      {!isLoading && filteredProducts.length > 0 && totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-4 py-2 border border-neutral-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-neutral-600">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-4 py-2 border border-neutral-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
