/**
 * Reusable admin data table - card styling with border, shadow, optional filter.
 */

export function AdminDataTable({
  title,
  columns,
  data,
  schemaNote,
  subheading,
  filterLabel,
  filterOptions = [],
  filterValue,
  onFilterChange,
}) {
  return (
    <div>
      {title && (
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">{title}</h1>
      )}
      {schemaNote && (
        <p className="text-sm text-neutral-500 mb-4">{schemaNote}</p>
      )}
      <div
        className="bg-white border-2 border-neutral-200 rounded-lg overflow-hidden shadow-sm"
      >
        {(subheading || filterLabel) && (
          <div className="px-6 py-4 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-4">
            {subheading && (
              <h2 className="text-lg font-semibold text-neutral-800">{subheading}</h2>
            )}
            {filterLabel && (
              <div className="flex items-center gap-2">
                <label className="text-sm text-neutral-500">{filterLabel}</label>
                <select
                  value={filterValue ?? 'all'}
                  onChange={(e) => onFilterChange?.(e.target.value)}
                  className="px-3 py-2 pr-8 border border-neutral-200 rounded-md text-sm bg-white text-neutral-800 appearance-none cursor-pointer hover:border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-300 focus:border-neutral-400"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1rem' }}
                >
                  <option value="all">All</option>
                  {filterOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
        <div className="overflow-x-auto p-6">
          <table className="min-w-full">
            <thead className="border border-neutral-200 ">
              <tr className="bg-neutral-50 shadow-sm">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-8 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-8 py-12 text-center text-neutral-500">
                    No data
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr
                    key={row.id || i}
                    className="hover:bg-neutral-50/60 border-b border-neutral-100 last:border-b-0"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="px-8 py-4 text-sm text-neutral-700"
                      >
                        {col.render
                          ? col.render(row[col.key], row)
                          : Array.isArray(row[col.key])
                            ? row[col.key].join(', ')
                            : typeof row[col.key] === 'object' && row[col.key] !== null
                              ? JSON.stringify(row[col.key])
                              : String(row[col.key] ?? '-')}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
