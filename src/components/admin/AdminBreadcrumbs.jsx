/**
 * Breadcrumb navigation for admin pages.
 */

import { Link } from 'react-router-dom'

export function AdminBreadcrumbs({ items }) {
  return (
    <nav className="text-sm text-neutral-500 mb-4">
      {items.map((item, i) => (
        <span key={item.label}>
          {i > 0 && <span className="mx-1">/</span>}
          {item.to ? (
            <Link to={item.to} className="text-blue-600 hover:text-blue-700">
              {item.label}
            </Link>
          ) : (
            <span className="text-neutral-900 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
