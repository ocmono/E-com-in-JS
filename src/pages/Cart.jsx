/**
 * Cart page - full cart view.
 */

import { Link } from 'react-router-dom'
import { useCartStore } from '../stores/cartStore.js'

export function Cart() {
  const { items, updateQuantity, removeItem, subtotal, clearCart } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Your cart is empty</h1>
        <p className="text-neutral-500 mb-6">Add items from the catalog to get started.</p>
        <Link
          to="/catalog"
          className="inline-block px-6 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
        >
          Shop catalog
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Cart</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.variantId || ''}`}
            className="flex gap-4 p-4 border border-neutral-200 rounded-lg"
          >
            <div className="w-24 h-24 bg-neutral-100 rounded flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-neutral-900">{item.product?.name ?? `Product ${item.productId}`}</h3>
              <p className="text-neutral-600">${(item.price ?? 0).toFixed(2)} each</p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                  className="w-8 h-8 border border-neutral-300 rounded text-sm"
                >
                  −
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                  className="w-8 h-8 border border-neutral-300 rounded text-sm"
                >
                  +
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">${((item.price ?? 0) * item.quantity).toFixed(2)}</p>
              <button
                type="button"
                onClick={() => removeItem(item.productId, item.variantId)}
                className="text-sm text-red-600 hover:text-red-700 mt-1"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-lg font-semibold">Subtotal: ${subtotal().toFixed(2)}</p>
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
            className="px-6 py-2 border border-neutral-300 rounded-md font-medium hover:bg-neutral-50"
          >
            Continue shopping
          </Link>
          <Link
            to="/checkout"
            className="px-6 py-2 bg-neutral-900 text-white rounded-md font-medium hover:bg-neutral-800"
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  )
}
