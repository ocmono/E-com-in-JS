/**
 * Cart page - full cart view. Displays cart store data: product image, name, price, quantity.
 */

import { Link } from 'react-router-dom'
import { useCartStore } from '../stores/cartStore.js'

function getProductImageUrl(product) {
  const img = product?.images?.[0]
  if (!img) return null
  return typeof img === 'string' ? img : img?.url ?? img?.img_url ?? null
}

function getProductName(product, productId) {
  return product?.title ?? product?.name ?? `Product ${productId}`
}

export function Cart() {
  const { items, updateQuantity, removeItem, subtotal, clearCart } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Your cart is empty</h1>
        <p className="text-neutral-500 mb-6">Add items from the catalog to get started.</p>
        <Link
          to="/catalog"
          className="inline-block px-6 py-3 bg-store-accent hover:bg-[var(--store-accent-hover)] text-white font-semibold rounded-md transition-colors"
        >
          Shop catalog
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Cart</h1>
      <p className="text-neutral-500 text-sm mb-6">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>

      <div className="space-y-4">
        {items.map((item) => {
          const imageUrl = getProductImageUrl(item.product)
          const name = getProductName(item.product, item.productId)
          const unitPrice = item.price ?? item.product?.price ?? item.product?.base_price ?? 0
          const lineTotal = unitPrice * item.quantity
          const productSlug = item.product?.slug ?? item.productId

          return (
            <div
              key={`${item.productId}-${item.variantId || ''}`}
              className="flex gap-4 p-4 bg-white border border-neutral-200 rounded-xl hover:border-neutral-300 transition-colors"
            >
              <Link
                to={`/product/${productSlug}`}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg bg-neutral-100 flex-shrink-0 overflow-hidden"
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">No image</div>
                )}
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${productSlug}`} className="block group">
                  <h3 className="font-medium text-neutral-900 group-hover:text-store-accent">{name}</h3>
                </Link>
                <p className="text-neutral-600 text-sm mt-0.5">${Number(unitPrice).toFixed(2)} each</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                    className="w-8 h-8 border border-neutral-300 rounded-md text-sm font-medium hover:bg-neutral-50 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                    className="w-8 h-8 border border-neutral-300 rounded-md text-sm font-medium hover:bg-neutral-50 transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="text-right flex flex-col justify-between items-end">
                <p className="font-semibold text-neutral-900">${Number(lineTotal).toFixed(2)}</p>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId, item.variantId)}
                  className="text-sm text-red-600 hover:text-red-700 hover:underline mt-1"
                >
                  Remove
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-lg font-semibold text-neutral-900">Subtotal: ${Number(subtotal()).toFixed(2)}</p>
          <button
            type="button"
            onClick={clearCart}
            className="text-sm text-neutral-500 hover:text-red-600 mt-1"
          >
            Clear cart
          </button>
        </div>
        <div className="flex gap-4">
          <Link
            to="/catalog"
            className="px-6 py-2 border border-neutral-300 rounded-md font-medium hover:bg-neutral-50 transition-colors"
          >
            Continue shopping
          </Link>
          <Link
            to="/checkout"
            className="px-6 py-2 bg-store-accent hover:bg-[var(--store-accent-hover)] text-white rounded-md font-medium transition-colors"
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  )
}
