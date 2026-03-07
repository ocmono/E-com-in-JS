import { useState } from 'react'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader.jsx'

const ORDER_STATUSES = ['Placed', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Completed', 'Cancelled']

export function AdminInvoices() {
  const [fromDate, setFromDate] = useState('2026-03-06')
  const [toDate, setToDate] = useState('2026-03-06')
  const [enableInvoices, setEnableInvoices] = useState(true)
  const [enableTaxBreakdown, setEnableTaxBreakdown] = useState(false)
  const [enableProductImage, setEnableProductImage] = useState(false)
  const [invoicePrefix, setInvoicePrefix] = useState('#IN')
  const [addYearToNumber, setAddYearToNumber] = useState(false)
  const [resetSequential, setResetSequential] = useState(false)
  const [yearPosition, setYearPosition] = useState('after')
  const [invoiceNumber, setInvoiceNumber] = useState('1')
  const [selectedStatuses, setSelectedStatuses] = useState({})

  const toggleStatus = (status) => {
    setSelectedStatuses((s) => ({ ...s, [status]: !s[status] }))
  }

  return (
    <div>
      <AdminPageHeader
        title="Invoices"
        description="Generate invoice PDFs by date range or by order status. Configure invoice options below."
      >
        <button type="button" className="px-4 py-2 border border-admin rounded-md text-sm font-medium hover:bg-neutral-50">
          Simplify accounting
        </button>
        <button type="button" className="p-2 border border-admin rounded-md hover:bg-neutral-50">
          <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </AdminPageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-admin-bg border border-admin rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Generate by date</h2>
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">From</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="px-3 py-2 border border-admin rounded-md text-sm bg-admin-bg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">To</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="px-3 py-2 border border-admin rounded-md text-sm bg-admin-bg"
                />
              </div>
              <p className="text-xs text-neutral-500">Format YYYY-MM-DD (inclusive)</p>
              <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                Generate PDF file by date
              </button>
            </div>
          </div>

          <div className="bg-admin-bg border border-admin rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Generate by order status</h2>
            <p className="text-sm text-neutral-500 mb-4">Select one or more statuses, leave all unchecked to include all orders.</p>
            <div className="flex flex-wrap gap-4 mb-4">
              {ORDER_STATUSES.map((status) => (
                <label key={status} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedStatuses[status] || false}
                    onChange={() => toggleStatus(status)}
                  />
                  <span className="text-sm">{status}</span>
                  <span className="text-xs text-red-500">0</span>
                </label>
              ))}
            </div>
            <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
              Generate PDF file by status
            </button>
          </div>

          <div className="bg-admin-bg border border-admin rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-6">Invoice options</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900">Enable Invoices</p>
                  <p className="text-sm text-neutral-500">When enabled, your customers will receive an invoice for the purchase.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEnableInvoices(!enableInvoices)}
                  className={`w-12 h-6 rounded-full transition-colors ${enableInvoices ? 'bg-blue-600' : 'bg-neutral-200'}`}
                >
                  <span className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform ${enableInvoices ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900">Enable tax breakdown</p>
                  <p className="text-sm text-neutral-500">If required, show the total amount per rate of the corresponding tax.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEnableTaxBreakdown(!enableTaxBreakdown)}
                  className={`w-12 h-6 rounded-full transition-colors ${enableTaxBreakdown ? 'bg-blue-600' : 'bg-neutral-200'}`}
                >
                  <span className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform ${enableTaxBreakdown ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900">Enable product image</p>
                  <p className="text-sm text-neutral-500">Adds an image in front of the product name on the invoice.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEnableProductImage(!enableProductImage)}
                  className={`w-12 h-6 rounded-full transition-colors ${enableProductImage ? 'bg-blue-600' : 'bg-neutral-200'}`}
                >
                  <span className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform ${enableProductImage ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Invoice prefix</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={invoicePrefix}
                    onChange={(e) => setInvoicePrefix(e.target.value)}
                    className="w-24 px-3 py-2 border border-admin rounded-md text-sm bg-admin-bg"
                  />
                  <select className="px-3 py-2 border border-admin rounded-md text-sm bg-admin-bg">
                    <option value="EN">EN</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-medium text-neutral-900">Add current year to invoice number</p>
                <button
                  type="button"
                  onClick={() => setAddYearToNumber(!addYearToNumber)}
                  className={`w-12 h-6 rounded-full transition-colors ${addYearToNumber ? 'bg-blue-600' : 'bg-neutral-200'}`}
                >
                  <span className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform ${addYearToNumber ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-medium text-neutral-900">Reset sequential invoice number at the beginning of the year</p>
                <button
                  type="button"
                  onClick={() => setResetSequential(!resetSequential)}
                  className={`w-12 h-6 rounded-full transition-colors ${resetSequential ? 'bg-blue-600' : 'bg-neutral-200'}`}
                >
                  <span className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform ${resetSequential ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Position of the year date</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="yearPos" checked={yearPosition === 'after'} onChange={() => setYearPosition('after')} />
                    <span className="text-sm">After the sequential number</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="yearPos" checked={yearPosition === 'before'} onChange={() => setYearPosition('before')} />
                    <span className="text-sm">Before the sequential number</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Invoice number</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-24 px-3 py-2 border border-admin rounded-md text-sm bg-admin-bg"
                />
                <p className="text-xs text-neutral-500 mt-1">The next invoice will begin with this number. Set to 0 to keep the current number.</p>
              </div>
            </div>
            <button type="button" className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
              Save options
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
