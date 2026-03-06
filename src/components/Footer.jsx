/**
 * Main store footer - light theme, OC Mono brand.
 */

import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="text-xl font-bold text-store-accent hover:opacity-90">
              OC Mono
            </Link>
            <p className="text-neutral-500 text-sm mt-2 max-w-xs">
              Science-backed skincare. Clean ingredients, dermatologist developed. Free shipping over $50.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 mb-4">Quick links</h3>
            <ul className="space-y-2 text-sm text-neutral-500">
              <li><Link to="/catalog" className="hover:text-neutral-900">Shop</Link></li>
              <li><Link to="/blog" className="hover:text-neutral-900">Blog</Link></li>
              <li><Link to="/" className="hover:text-neutral-900">About</Link></li>
              <li><Link to="/" className="hover:text-neutral-900">Contact</Link></li>
              <li><Link to="/cart" className="hover:text-neutral-900">Cart</Link></li>
              <li><Link to="/account" className="hover:text-neutral-900">Account</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-neutral-500">
              <li><Link to="/privacy" className="hover:text-neutral-900">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-neutral-900">Terms</Link></li>
              <li><Link to="/" className="hover:text-neutral-900">Shipping & Returns</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-neutral-200 text-center text-sm text-neutral-500">
          © {new Date().getFullYear()} OC Mono. Dermatologist-backed skincare e-commerce.
        </div>
      </div>
    </footer>
  )
}
