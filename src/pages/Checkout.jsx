/**
 * Checkout placeholder.
 */

import { Link } from 'react-router-dom'

export function Checkout() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-neutral-900 mb-4">Checkout</h1>
      <p className="text-neutral-500 mb-6">Connect a backend to complete checkout.</p>
      <Link to="/cart" className="text-red-600 hover:text-red-700 font-medium">
        ← Back to cart
      </Link>
    </div>
  )
}
