/**
 * Reusable admin data table - shows dummy data for DB schema reference.
 */

export function AdminDataTable({ title, columns, data, schemaNote }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">{title}</h1>
      {schemaNote && (
        <p className="text-sm text-neutral-500 mb-4 italic">{schemaNote}</p>
      )}
      <div className="bg-admin-bg border border-admin rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-admin">
          <thead className="bg-neutral-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-admin-bg divide-y divide-admin">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-neutral-500">
                  No data
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={row.id || i} className="hover:bg-neutral-50">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-sm text-neutral-700">
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
  )
}
