/**
 * Placeholder for admin sections.
 */

import { useLocation } from 'react-router-dom'

export function AdminPlaceholder({ title = 'Section' }) {
  const loc = useLocation()
  const name = title || loc.pathname.split('/').pop()?.replace(/-/g, ' ') || 'Section'
  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6 capitalize">{name}</h1>
      <p className="text-neutral-500">Connect a backend to manage this section.</p>
    </div>
  )
}
