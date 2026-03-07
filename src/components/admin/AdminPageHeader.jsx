/**
 * Common admin page header.
 * Left: title and description.
 * Right: action buttons (passed as children, differs per page).
 */
export function AdminPageHeader({ title, description, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">{title}</h1>
        {description && (
          <p className="text-sm text-neutral-500">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex flex-wrap gap-2 shrink-0">{children}</div>
      )}
    </div>
  )
}
