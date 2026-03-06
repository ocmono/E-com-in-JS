import { monitoring } from '../../data/adminMockData.js'

export function AdminMonitoring() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">Monitoring</h1>
      <p className="text-sm text-neutral-500 mb-6 italic">DB: Aggregated views / materialized data</p>
      <div className="space-y-4">
        {monitoring.map((m, i) => (
          <div key={i} className="bg-admin-bg border border-admin rounded-lg shadow p-6">
            <h2 className="font-semibold text-neutral-900 capitalize">{m.type.replace(/_/g, ' ')}</h2>
            <p className="text-neutral-600 mt-1">Count: {m.count}</p>
            <ul className="mt-2 text-sm text-neutral-500 list-disc list-inside">
              {m.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
