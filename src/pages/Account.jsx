/**
 * Account placeholder.
 */

import { Link } from 'react-router-dom'

export function Account() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Account</h1>
      <nav className="space-y-2">
        <Link to="/account/orders" className="block py-2 text-neutral-600 hover:text-neutral-900">
          Orders
        </Link>
      </nav>
    </div>
  )
}
