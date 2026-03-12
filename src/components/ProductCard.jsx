import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { IMAGE_ROTATE_MS } from '../config.js'

export function ProductCard({ product, onAddToCart }) {
  const title = product.title ?? product.name
  const price = product.base_price ?? product.price ?? 0
  const attributes = Array.isArray(product.attributes) ? product.attributes : []

  const imageList = useMemo(() => {
    const imgs = product.images ?? []
    return imgs
      .map((img) => ({
        url: typeof img === 'string' ? img : img?.img_url ?? img?.url ?? '',
        alt: typeof img === 'string' ? title : img?.alt_name ?? title,
      }))
      .filter((i) => i.url)
  }, [product.images, title])

  const [imageIndex, setImageIndex] = useState(0)
  const currentImage = imageList[imageIndex] ?? imageList[0]

  useEffect(() => {
    if (imageList.length <= 1) return
    const id = setInterval(() => {
      setImageIndex((i) => (i + 1) % imageList.length)
    }, IMAGE_ROTATE_MS)
    return () => clearInterval(id)
  }, [imageList.length])

  const handleAdd = (e) => {
    if (!onAddToCart) return
    e.preventDefault()
    onAddToCart(e, product)
  }

  return (
    <div className="group bg-white border border-neutral-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <Link
        to={`/product/${product.slug || product.id}`}
        className="block"
      >
        <div className="aspect-square bg-neutral-100 overflow-hidden">
          {currentImage ? (
            <img
              key={imageIndex}
              src={currentImage.url}
              alt={currentImage.alt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400">
              No image
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-medium text-neutral-900 group-hover:text-store-accent">
            {title}
          </h3>
          <p className="text-neutral-600 font-semibold mt-1">
            ${Number(price).toFixed(2)}
          </p>
          {attributes.length > 0 && (
            <div className="mt-1.5 space-y-1">
              {attributes.map((attr) => {
                const name = attr?.name ?? ''
                const values = Array.isArray(attr?.variations) ? attr.variations : []
                if (!name || values.length === 0) return null
                const isColor = name.toLowerCase() === 'color'
                const visibleValues = values.slice(0, 4)
                const remainingCount = values.length - visibleValues.length
                return (
                  <div key={name} className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[0.65rem] uppercase tracking-wide  text-neutral-700">
                      {name}
                    </span>
                    <div className="flex flex-wrap items-center gap-1">
                      {visibleValues.map((value) =>
                        isColor ? (
                          <span
                            key={value}
                            className="w-4 h-4 rounded-full border border-neutral-300"
                            style={{ backgroundColor: value.toLowerCase() }}
                            title={value}
                          />
                        ) : (
                          <span
                            key={value}
                            className="px-1.5 py-0.5 text-[0.7rem] rounded border border-neutral-100 bg-neutral-50 text-neutral-500"
                          >
                            {value}
                          </span>
                        )
                      )}
                      {remainingCount > 0 && (
                        <span className="px-1.5 py-0.5 text-[0.7rem] rounded bg-neutral-100 text-neutral-500">
                          +{remainingCount} more
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </Link>
      {onAddToCart && (
        <div className="px-4 pb-4">
          <button
            type="button"
            onClick={handleAdd}
            className="w-full py-2 bg-store-accent hover:bg-[var(--store-accent-hover)] text-white rounded-md text-sm font-medium transition-colors"
          >
            Add to cart
          </button>
        </div>
      )}
    </div>
  )
}

