/**
 * Cart flyout - slides in from right when cart icon clicked.
 */

import { Link } from 'react-router-dom'
import { useCartStore } from '../stores/cartStore.js'

export function CartFlyout() {
  const { items, flyoutOpen, setFlyoutOpen, removeItem, itemCount, subtotal } = useCartStore()

  if (!flyoutOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={() => setFlyoutOpen(false)}
        aria-hidden
      />
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold">Cart ({itemCount()})</h2>
          <button
            type="button"
            onClick={() => setFlyoutOpen(false)}
            className="p-2 text-neutral-500 hover:text-neutral-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <p className="text-neutral-500 text-center py-8">Your cart is empty</p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={`${item.productId}-${item.variantId || ''}`} className="flex gap-4 border-b border-neutral-100 pb-4">
                  <div className="w-16 h-16 bg-neutral-100 rounded flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.product?.name ?? `Product ${item.productId}`}</p>
                    <p className="text-sm text-neutral-500">Qty: {item.quantity}</p>
                    <p className="text-sm font-medium">${((item.price ?? 0) * item.quantity).toFixed(2)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId, item.variantId)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="p-4 border-t border-neutral-200">
          <p className="font-semibold text-lg mb-2">Subtotal: ${subtotal().toFixed(2)}</p>
          <Link
            to="/cart"
            onClick={() => setFlyoutOpen(false)}
            className="block w-full py-2 text-center bg-neutral-900 text-white rounded-md font-medium hover:bg-neutral-800"
          >
            View cart
          </Link>
        </div>
      </div>
    </>
  )
}
