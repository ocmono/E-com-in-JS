import { useState } from 'react'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader.jsx'
import { productWorkflow } from '../../data/adminMockData.js'

const WORKFLOW_SECTIONS = ['Monitoring dashboard', 'Workflow queue']
const WORKFLOW_STATES = ['Draft', 'Ready for approval', 'Approved', 'Scheduled']

export function AdminProductWorkflow() {
  const [activeSection, setActiveSection] = useState('Monitoring dashboard')
  const [filterState, setFilterState] = useState('ready_for_approval')

  const filtered = productWorkflow.filter((p) => p.state === filterState)

  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0">
        <AdminPageHeader
          title="Product workflow"
          description="Draft, approval and scheduling. Monitoring dashboard and workflow queue with QC and channel sync."
        />

        <div className="flex gap-4 mb-6 border-b border-admin pb-2">
          {WORKFLOW_SECTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setActiveSection(s)}
              className={`px-3 py-2 text-sm font-medium rounded ${
                activeSection === s ? 'bg-blue-600 text-white' : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="bg-admin-bg border border-admin rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-900">Products by workflow state</h3>
            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="px-3 py-2 border border-admin rounded-md text-sm bg-admin-bg"
            >
              <option value="draft">Draft</option>
              <option value="ready_for_approval">Ready for approval</option>
              <option value="approved">Approved</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left text-xs font-medium text-neutral-500 uppercase py-2">Product</th>
                <th className="text-left text-xs font-medium text-neutral-500 uppercase py-2">State</th>
                <th className="text-left text-xs font-medium text-neutral-500 uppercase py-2">Submitted</th>
                <th className="text-left text-xs font-medium text-neutral-500 uppercase py-2">Published from</th>
                <th className="text-left text-xs font-medium text-neutral-500 uppercase py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neutral-500">No products in this workflow state.</td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="border-t border-admin">
                    <td className="py-3 text-sm font-medium">{p.productName}</td>
                    <td className="py-3 text-sm capitalize">{p.state}</td>
                    <td className="py-3 text-sm text-neutral-600">{p.submittedAt || '-'}</td>
                    <td className="py-3 text-sm text-neutral-600">-</td>
                    <td className="py-3 text-sm">
                      <button type="button" className="text-blue-600 hover:text-blue-700 font-medium">Manage</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="w-64 flex-shrink-0 space-y-4">
        <div className="bg-admin-bg border border-admin rounded-lg shadow p-4">
          <h3 className="font-semibold text-neutral-900 mb-2">Workflow states</h3>
          <ul className="text-sm text-neutral-600 space-y-1">
            <li><strong>Draft</strong> — In progress, not visible</li>
            <li><strong>Ready for approval</strong> — QC done, awaiting manager</li>
            <li><strong>Approved</strong> — Ready to publish</li>
            <li><strong>Scheduled</strong> — Publish date set</li>
          </ul>
        </div>
        <div className="bg-admin-bg border border-admin rounded-lg shadow p-4">
          <h3 className="font-semibold text-neutral-900 mb-2">Pipeline</h3>
          <p className="text-sm text-neutral-600">
            Draft → Ready for approval → Approved → Scheduled. QC and compliance by content reviewer, manager approval, channel distribution (Google Merchant, Meta, ERP, POS).
          </p>
        </div>
      </div>
    </div>
  )
}
