/**
 * Home page - hero slider, category tabs, products, service section, blog, testimonial.
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getFeaturedProducts } from '../api/productApi.js'
import { useAuthStore } from '../stores/authStore.js'

const CATEGORIES = [
  { id: 'new', label: 'NEW ARRIVALS' },
  { id: 'bestsellers', label: 'BEST SELLERS' },
  { id: 'sale', label: 'SALE ITEMS' },
]

export function Home() {
  const user = useAuthStore((s) => s.user)
  const useDemoAdmin = useAuthStore((s) => s.useDemoAdmin)
  const [activeCategory, setActiveCategory] = useState('new')
  const [slideIndex, setSlideIndex] = useState(0)

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: getFeaturedProducts,
    staleTime: 60 * 1000,
    retry: false,
  })

  return (
    <div>
      {/* Hero banner / slider */}
      <section className="relative bg-gradient-to-b from-neutral-100 to-store py-24 px-4">
        <button
          type="button"
          onClick={() => setSlideIndex((i) => Math.max(0, i - 1))}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center text-neutral-600 hover:bg-white/90 transition-colors z-10"
          aria-label="Previous slide"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => setSlideIndex((i) => Math.min(2, i + 1))}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center text-neutral-600 hover:bg-white/90 transition-colors z-10"
          aria-label="Next slide"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-wider text-neutral-400 mb-2">Cosmetic Best Selling</p>
          <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">Fashion Cosmetic</h1>
          <Link
            to="/catalog"
            className="inline-block px-8 py-3 bg-store-accent hover:bg-[var(--store-accent-hover)] text-white font-semibold uppercase text-sm tracking-wider rounded-md transition-colors"
          >
            Shop now
          </Link>

          {/* Slider indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`block h-0.5 transition-all ${
                  i === slideIndex ? 'w-8 bg-store-accent' : 'w-4 bg-neutral-300'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Category tabs + product grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex gap-8 border-b border-neutral-200 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`pb-3 text-[0.8rem] font-medium uppercase tracking-wider transition-colors border-b-2 -mb-px ${
                activeCategory === cat.id
                  ? 'text-neutral-800 border-store-accent'
                  : 'text-neutral-400 border-transparent hover:text-neutral-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {!user && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm">
            <p className="text-amber-800">
              No backend connected. Use demo admin:{' '}
              <button type="button" onClick={useDemoAdmin} className="font-semibold underline hover:no-underline">
                Login as Demo Admin
              </button>
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-neutral-200 rounded-lg" />
                <div className="mt-2 h-4 bg-neutral-200 rounded w-3/4" />
                <div className="mt-2 h-4 bg-neutral-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-neutral-200">
            <p className="text-neutral-500">No products in this category. View catalog</p>
            <Link
              to="/catalog"
              className="mt-6 inline-block px-8 py-3 bg-store-accent hover:bg-[var(--store-accent-hover)] text-white font-semibold uppercase text-sm tracking-wider rounded-md transition-colors"
            >
              View more products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.slug || product.id}`}
                className="group block bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-neutral-100">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400">No image</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-neutral-900 group-hover:text-store-accent">{product.name}</h3>
                  <p className="text-neutral-600 font-semibold mt-1">${(product.price ?? 0).toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Category cards - Eye Lashes, Anti-Wrinkles */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/catalog"
            className="block rounded-xl overflow-hidden p-8 min-h-[200px] bg-gradient-to-r from-pink-100 to-purple-200 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-bold text-neutral-900">Eye Lashes</h3>
            <p className="text-neutral-600 text-sm mt-1">Starting at $9.00</p>
            <span className="inline-block mt-3 text-store-accent text-sm font-medium">Shop now →</span>
          </Link>
          <Link
            to="/catalog"
            className="block rounded-xl overflow-hidden p-8 min-h-[200px] bg-gradient-to-r from-amber-100 to-orange-200 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-bold text-neutral-900">Anti-Wrinkles</h3>
            <p className="text-neutral-600 text-sm mt-1">Starting at $7.00</p>
            <span className="inline-block mt-3 text-store-accent text-sm font-medium">Shop now →</span>
          </Link>
        </div>
      </section>

      {/* Our Blog */}
      <section className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-neutral-900 uppercase">Our Blog</h2>
        <p className="text-neutral-500 mt-2">Visit our blog for articles and updates.</p>
      </section>

      {/* Customer service section */}
      <section className="border-t border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full text-store-accent mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-semibold text-store-accent">Free Shipping</h3>
              <p className="text-neutral-500 text-sm mt-1">Free shipping on all order</p>
            </div>
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full text-store-accent mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-store-accent">Support 24/7</h3>
              <p className="text-neutral-500 text-sm mt-1">Dedicated support for you</p>
            </div>
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full text-store-accent mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="font-semibold text-store-accent">Money Return</h3>
              <p className="text-neutral-500 text-sm mt-1">30 days money back guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="border-t border-neutral-200 py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-neutral-600 italic">&ldquo;Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.&rdquo;</p>
          <p className="font-medium text-neutral-900 mt-4">John Doe</p>
          <p className="text-neutral-500 text-sm">customer</p>
          <div className="flex justify-center gap-2 mt-4">
            <span className="w-2 h-2 rounded-full border-2 border-store-accent" />
            <span className="w-2 h-2 rounded-full border-2 border-store-accent bg-store-accent" />
            <span className="w-2 h-2 rounded-full border-2 border-store-accent" />
          </div>
        </div>
      </section>
    </div>
  )
}
