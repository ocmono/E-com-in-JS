import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader.jsx'
import { attributes as initialAttributes } from '../../data/adminMockData.js'

const TagIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
)

const ListIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
)

const CubeIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
)

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

function slugify(text) {
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

function generateId() {
  return 'attr-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9)
}

const columns = [
  { key: 'id', label: 'ID', className: 'font-mono text-xs text-neutral-500' },
  { key: 'name', label: 'Name' },
  { key: 'slug', label: 'Slug' },
  { key: 'type', label: 'Type' },
  { key: 'values', label: 'Values', render: (v) => (Array.isArray(v) && v.length > 0 ? v.join(', ') : '—') },
  { key: 'productCount', label: 'Products' },
]

export function AdminAttributes() {
  const [search, setSearch] = useState('')
  const [attributes, setAttributes] = useState(initialAttributes)
  const [modalOpen, setModalOpen] = useState(false)
  const [formName, setFormName] = useState('')
  const [formSlug, setFormSlug] = useState('')
  const [formType, setFormType] = useState('select')
  const [formValuesStr, setFormValuesStr] = useState('')

  const totalAttributes = attributes.length
  const selectTypeCount = attributes.filter((a) => a.type === 'select').length
  const totalProductUsage = attributes.reduce((s, a) => s + (a.productCount ?? 0), 0)

  const filteredData = useMemo(() => {
    if (!search.trim()) return attributes
    const q = search.trim().toLowerCase()
    return attributes.filter(
      (a) =>
        (a.name && a.name.toLowerCase().includes(q)) ||
        (a.slug && a.slug.toLowerCase().includes(q)) ||
        (a.type && a.type.toLowerCase().includes(q))
    )
  }, [attributes, search])

  const openAddAttribute = () => {
    setFormName('')
    setFormSlug('')
    setFormType('select')
    setFormValuesStr('')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setFormName('')
    setFormSlug('')
    setFormType('select')
    setFormValuesStr('')
  }

  const handleNameChange = (name) => {
    setFormName(name)
    setFormSlug(slugify(name))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const name = formName.trim()
    const slug = (formSlug || slugify(name)).trim()
    if (!name) return
    const values = formType === 'select'
      ? formValuesStr.split(',').map((v) => v.trim()).filter(Boolean)
      : []
    const newAttr = {
      id: generateId(),
      name,
      slug: slug || slugify(name),
      type: formType,
      values,
      productCount: 0,
    }
    setAttributes((prev) => [...prev, newAttr])
    closeModal()
  }

  return (
    <div>
      <AdminPageHeader
        title="Attributes & Features"
        description="Product attributes (e.g. Size, Color). Use in the product editor for variations and filters."
      >
        <button
          type="button"
          onClick={openAddAttribute}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <PlusIcon />
          Add attribute
        </button>
      </AdminPageHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-admin-bg border border-admin rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              <TagIcon />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Total attributes</p>
              <p className="text-2xl font-bold text-neutral-900">{totalAttributes}</p>
            </div>
          </div>
        </div>
        <div className="bg-admin-bg border border-admin rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center text-violet-600">
              <ListIcon />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Select type</p>
              <p className="text-2xl font-bold text-neutral-900">{selectTypeCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-admin-bg border border-admin rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
              <CubeIcon />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Product usage</p>
              <p className="text-2xl font-bold text-neutral-900">{totalProductUsage}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-admin-bg border border-admin rounded-lg shadow p-4 mb-6">
        <label className="block text-sm font-medium text-neutral-700 mb-2">Search</label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, slug or type..."
          className="w-full px-4 py-2 border border-admin rounded-md bg-admin-bg"
        />
      </div>

      <div className="bg-admin-bg border border-admin rounded-lg shadow overflow-hidden min-h-[200px]">
        {attributes.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 px-6">
            <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-400 mb-4">
              <TagIcon />
            </div>
            <p className="text-lg font-medium text-neutral-900 mb-1">No attributes yet</p>
            <p className="text-neutral-500 mb-6">
              Add attributes like Size, Color or Material to use in product variations.
            </p>
            <button
              type="button"
              onClick={openAddAttribute}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 flex items-center gap-2 w-fit"
            >
              <PlusIcon />
              Add attribute
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-neutral-50 border-b border-admin">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider"
                    >
                      {col.label}
                    </th>
                  ))}
                  <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-neutral-500">
                      No attributes match your search.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((row) => (
                    <tr key={row.id} className="hover:bg-neutral-50/80">
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={`px-6 py-4 text-sm text-neutral-700 ${col.className ?? ''}`}
                        >
                          {col.render
                            ? col.render(row[col.key], row)
                            : Array.isArray(row[col.key])
                              ? row[col.key].join(', ')
                              : String(row[col.key] ?? '—')}
                        </td>
                      ))}
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/admin/attributes/${row.id}`}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={closeModal}>
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Add attribute</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Size, Color"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  autoFocus
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Slug (URL-friendly)</label>
                <input
                  type="text"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  placeholder="e.g. size, color"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Type</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                >
                  <option value="select">Select (dropdown with options)</option>
                  <option value="text">Text (free text)</option>
                </select>
              </div>
              {formType === 'select' && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Values (comma-separated)</label>
                  <input
                    type="text"
                    value={formValuesStr}
                    onChange={(e) => setFormValuesStr(e.target.value)}
                    placeholder="e.g. S, M, L, XL"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
                >
                  Add attribute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
