/**
 * Product detail page - with variant selection (Amazon-style).
 */

import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProductBySlug } from '../api/productApi.js'
import { useCartStore } from '../stores/cartStore.js'

export function Product() {
  const { slug } = useParams()
  const addItem = useCartStore((s) => s.addItem)
  const [selectedVariant, setSelectedVariant] = useState(null)

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => (slug ? getProductBySlug(slug) : Promise.reject(new Error('No slug'))),
    staleTime: 60 * 1000,
    retry: false,
  })

  const variants = product?.variants || []
  const attributes = product?.attributes || {}
  const attrNames = Object.keys(attributes)

  const findVariantForSelection = (selections) => {
    return variants.find((v) =>
      attrNames.every((name) => (v.attributes?.[name] ?? '') === (selections[name] ?? ''))
    )
  }

  const handleAddToCart = () => {
    if (!product) return
    const v = selectedVariant || variants[0]
    addItem({
      productId: product.id,
      variantId: v?.id,
      quantity: 1,
      product,
      variant: v,
      price: v?.price ?? product.price ?? 0,
    })
  }

  const updateSelection = (attrName, value) => {
    const next = { ...(selectedVariant?.attributes || {}), [attrName]: value }
    const v = findVariantForSelection(next)
    setSelectedVariant(v)
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="animate-pulse flex gap-8">
          <div className="w-96 h-96 bg-neutral-200 rounded-lg" />
          <div className="flex-1">
            <div className="h-8 bg-neutral-200 rounded w-3/4 mb-4" />
            <div className="h-4 bg-neutral-200 rounded w-1/2 mb-2" />
            <div className="h-4 bg-neutral-200 rounded w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Product not found</h1>
        <p className="text-neutral-500 mb-4">No backend connected or product does not exist.</p>
        <Link to="/catalog" className="text-red-600 hover:text-red-700 font-medium">
          Back to catalog
        </Link>
      </div>
    )
  }

  const displayPrice = selectedVariant?.price ?? product.price ?? 0
  const displayStock = selectedVariant?.stock ?? product.stock ?? 0

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-96 aspect-square bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400">No image</div>
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">{product.name}</h1>
          <div className="flex items-center gap-3 mb-4">
            <p className="text-2xl font-semibold text-neutral-700">${displayPrice.toFixed(2)}</p>
            {product.compareAtPrice && product.compareAtPrice > displayPrice && (
              <p className="text-neutral-400 line-through text-lg">${product.compareAtPrice.toFixed(2)}</p>
            )}
          </div>
          <p className="text-neutral-600 mb-6">{product.description || 'No description.'}</p>

          {attrNames.length > 0 && variants.length > 0 && (
            <div className="space-y-4 mb-6">
              {attrNames.map((attrName) => (
                <div key={attrName}>
                  <p className="text-sm font-medium text-neutral-700 mb-2">{attrName}</p>
                  <div className="flex flex-wrap gap-2">
                    {(attributes[attrName] || []).map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => updateSelection(attrName, val)}
                        className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                          (selectedVariant?.attributes?.[attrName] ?? '') === val
                            ? 'border-neutral-900 bg-neutral-900 text-white'
                            : 'border-neutral-300 hover:border-neutral-400'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {displayStock > 0 ? (
            <button
              type="button"
              onClick={handleAddToCart}
              className="px-6 py-3 bg-neutral-900 text-white font-semibold rounded-md hover:bg-neutral-800"
            >
              Add to cart
            </button>
          ) : (
            <p className="text-red-600 font-medium">Out of stock</p>
          )}
        </div>
      </div>
    </div>
  )
}
