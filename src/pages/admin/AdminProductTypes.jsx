import { useState, useEffect, useMemo } from 'react'
import { Table, TableFilterBarWithSearch, TableSearchInput } from '../../components/table'
import {
  listProductTypes,
  createProductType,
  getProductType,
  updateProductType,
  deleteProductType,
  listAttributes,
  createAttribute,
  getAttribute,
  updateAttribute,
  deleteAttribute,
} from '../../api/productVaration.js'
import { productTypes as fallbackTypes } from '../../data/adminMockData.js'

const TypeIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
)

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const RefreshIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
)

function slugify(text) {
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

/** Normalize API response (snake_case or camelCase) to a single shape. */
function normalizeType(row) {
  if (!row) return null
  return {
    id: row.id,
    name: row.name ?? '',
    slug: row.slug ?? '',
    hasVariations: row.has_variations ?? row.hasVariations ?? false,
    productCount: row.product_count ?? row.productCount ?? 0,
  }
}

function normalizeAttribute(row) {
  if (!row) return null
  const values = row.values ?? row.attribute_values ?? []
  return {
    id: row.id,
    name: row.name ?? '',
    slug: row.slug ?? '',
    type: row.type ?? 'select',
    values: Array.isArray(values) ? values : [],
    productCount: row.product_count ?? row.productCount ?? 0,
  }
}

export function AdminProductTypes() {
  const [types, setTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null) // null = create, id = edit
  const [formName, setFormName] = useState('')
  const [formSlug, setFormSlug] = useState('')
  const [formHasVariations, setFormHasVariations] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  // Attributes list + modal
  const [attributes, setAttributes] = useState([])
  const [attrLoading, setAttrLoading] = useState(true)
  const [attrSearch, setAttrSearch] = useState('')
  const [attrDeletingId, setAttrDeletingId] = useState(null)
  const [attrModalOpen, setAttrModalOpen] = useState(false)
  const [attrEditingId, setAttrEditingId] = useState(null)
  const [attrFormName, setAttrFormName] = useState('')
  const [attrFormSlug, setAttrFormSlug] = useState('')
  const [attrFormType, setAttrFormType] = useState('select')
  const [attrFormValuesStr, setAttrFormValuesStr] = useState('')
  const [attrSaving, setAttrSaving] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    setError(null)
    try {
      await Promise.all([fetchTypes(), fetchAttributes()])
    } finally {
      setRefreshing(false)
    }
  }

  const fetchTypes = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await listProductTypes()
      const list = Array.isArray(data) ? data : (data?.data ?? data?.items ?? [])
      setTypes(list.map(normalizeType).filter(Boolean))
    } catch (err) {
      setError(err?.message || 'Failed to load product types')
      setTypes(fallbackTypes.map(normalizeType))
    } finally {
      setLoading(false)
    }
  }

  const fetchAttributes = async () => {
    setAttrLoading(true)
    try {
      const data = await listAttributes()
      const list = Array.isArray(data) ? data : (data?.data ?? data?.items ?? [])
      setAttributes(list.map(normalizeAttribute).filter(Boolean))
    } catch (err) {
      console.error('Failed to load attributes:', err)
      setAttributes([])
    } finally {
      setAttrLoading(false)
    }
  }

  useEffect(() => {
    fetchTypes()
  }, [])

  useEffect(() => {
    fetchAttributes()
  }, [])

  const filteredTypes = useMemo(() => {
    if (!search.trim()) return types
    const q = search.trim().toLowerCase()
    return types.filter(
      (t) =>
        (t.name && t.name.toLowerCase().includes(q)) ||
        (t.slug && t.slug.toLowerCase().includes(q))
    )
  }, [types, search])

  const filteredAttributes = useMemo(() => {
    if (!attrSearch.trim()) return attributes
    const q = attrSearch.trim().toLowerCase()
    return attributes.filter(
      (a) =>
        (a.name && a.name.toLowerCase().includes(q)) ||
        (a.slug && a.slug?.toLowerCase().includes(q)) ||
        (a.type && a.type.toLowerCase().includes(q))
    )
  }, [attributes, attrSearch])

  const totalTypes = types.length
  const withVariations = types.filter((t) => t.hasVariations).length
  const totalProductUsage = types.reduce((s, t) => s + (t.productCount ?? 0), 0)
  const totalAttributes = attributes.length
  const attrSelectType = attributes.filter((a) => (a.type || '').toLowerCase() === 'select').length
  const attrProductUsage = attributes.reduce((s, a) => s + (a.productCount ?? 0), 0)

  const openCreate = () => {
    setEditingId(null)
    setFormName('')
    setFormSlug('')
    setFormHasVariations(false)
    setModalOpen(true)
  }

  const openEdit = async (id) => {
    setEditingId(id)
    setFormName('')
    setFormSlug('')
    setFormHasVariations(false)
    setModalOpen(true)
    try {
      const row = await getProductType(id)
      const t = normalizeType(row?.data ?? row)
      if (t) {
        setFormName(t.name ?? '')
        setFormSlug(t.slug ?? '')
        setFormHasVariations(!!t.hasVariations)
      }
    } catch (err) {
      setError(err?.message || 'Failed to load product type')
    }
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingId(null)
    setFormName('')
    setFormSlug('')
    setFormHasVariations(false)
    setSaving(false)
  }

  const handleNameChange = (name) => {
    setFormName(name)
    setFormSlug(slugify(name))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const name = formName.trim()
    const slug = (formSlug || slugify(name)).trim()
    if (!name) return
    setSaving(true)
    try {
      const payload = {
        name,
        slug: slug || slugify(name),
        has_variations: formHasVariations,
      }
      if (editingId) {
        await updateProductType(editingId, payload)
      } else {
        await createProductType(payload)
      }
      await fetchTypes()
      closeModal()
    } catch (err) {
      setError(err?.message || (editingId ? 'Failed to update' : 'Failed to create'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product type? Products using it may need to be updated.')) return
    setDeletingId(id)
    try {
      await deleteProductType(id)
      await fetchTypes()
    } catch (err) {
      setError(err?.message || 'Failed to delete')
    } finally {
      setDeletingId(null)
    }
  }

  // Attribute modal handlers
  const openAttrCreate = () => {
    setAttrEditingId(null)
    setAttrFormName('')
    setAttrFormSlug('')
    setAttrFormType('select')
    setAttrFormValuesStr('')
    setAttrModalOpen(true)
  }

  const openAttrEdit = async (attrId) => {
    setAttrEditingId(attrId)
    setAttrFormName('')
    setAttrFormSlug('')
    setAttrFormType('select')
    setAttrFormValuesStr('')
    setAttrModalOpen(true)
    try {
      const row = await getAttribute(attrId)
      const a = normalizeAttribute(row?.data ?? row)
      if (a) {
        setAttrFormName(a.name ?? '')
        setAttrFormSlug(a.slug ?? '')
        setAttrFormType(a.type ?? 'select')
        setAttrFormValuesStr(Array.isArray(a.values) ? a.values.join(', ') : '')
      }
    } catch (err) {
      setError(err?.message || 'Failed to load attribute')
    }
  }

  const handleAttrDelete = async (attrId) => {
    if (!window.confirm('Delete this attribute?')) return
    setAttrDeletingId(attrId)
    try {
      await deleteAttribute(attrId)
      await fetchAttributes()
    } catch (err) {
      setError(err?.message || 'Failed to delete attribute')
    } finally {
      setAttrDeletingId(null)
    }
  }

  const closeAttrModal = () => {
    setAttrModalOpen(false)
    setAttrEditingId(null)
    setAttrFormName('')
    setAttrFormSlug('')
    setAttrFormType('select')
    setAttrFormValuesStr('')
    setAttrSaving(false)
  }

  const handleAttrNameChange = (name) => {
    setAttrFormName(name)
    setAttrFormSlug(slugify(name))
  }

  const handleAttrSubmit = async (e) => {
    e.preventDefault()
    const name = attrFormName.trim()
    const slug = (attrFormSlug || slugify(name)).trim()
    if (!name) return
    setAttrSaving(true)
    try {
      const payload = {
        name,
        slug: slug || slugify(name),
        type: attrFormType,
        ...(attrFormType === 'select' && {
          values: attrFormValuesStr.split(',').map((v) => v.trim()).filter(Boolean),
        }),
      }
      if (attrEditingId) {
        await updateAttribute(attrEditingId, payload)
      } else {
        await createAttribute(payload)
      }
      await fetchAttributes()
      closeAttrModal()
    } catch (err) {
      setError(err?.message || (attrEditingId ? 'Failed to update attribute' : 'Failed to create attribute'))
    } finally {
      setAttrSaving(false)
    }
  }

  const columns = [
    { key: 'id', label: 'ID', align: 'left', render: (v) => <span className="font-mono text-xs text-neutral-500">{v}</span> },
    { key: 'name', label: 'Name', align: 'left' },
    { key: 'slug', label: 'Slug', align: 'left' },
    { key: 'hasVariations', label: 'Has variations', align: 'left', render: (v) => (v ? 'Yes' : 'No') },
    { key: 'productCount', label: 'Products', align: 'left', render: (v) => v ?? 0 },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => openEdit(row.id)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => handleDelete(row.id)}
            disabled={deletingId === row.id}
            className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
          >
            {deletingId === row.id ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      ),
    },
  ]

  const attrColumns = [
    { key: 'id', label: 'ID', align: 'left', render: (v) => <span className="font-mono text-xs text-neutral-500">{v}</span> },
    { key: 'name', label: 'Name', align: 'left' },
    { key: 'slug', label: 'Slug', align: 'left' },
    { key: 'type', label: 'Type', align: 'left' },
    { key: 'values', label: 'Values', align: 'left', render: (v) => (Array.isArray(v) && v.length > 0 ? v.join(', ') : '—') },
    {
      key: 'attrActions',
      label: 'Actions',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2">
          <button type="button" onClick={() => openAttrEdit(row.id)} className="text-blue-600 hover:text-blue-700 text-sm font-medium">Edit</button>
          <button type="button" onClick={() => handleAttrDelete(row.id)} disabled={attrDeletingId === row.id} className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50">
            {attrDeletingId === row.id ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
          {error}
        </div>
      )}

      {/* Merged header: title + description on left, buttons on right */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Product Types &amp; Attributes</h1>
          <p className="text-sm text-neutral-600 mt-0.5">
            Product types (e.g. Physical, Digital) for creating products. Attributes (e.g. Size, Color) for variations.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={openCreate}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <PlusIcon />
            Add product type
          </button>
          <button
            type="button"
            onClick={openAttrCreate}
            className="px-4 py-2 border border-neutral-300 text-neutral-700 font-medium rounded-md hover:bg-neutral-50 flex items-center gap-2"
          >
            <PlusIcon />
            Add attribute
          </button>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 border border-neutral-300 text-neutral-700 font-medium rounded-md hover:bg-neutral-50 flex items-center gap-2 disabled:opacity-50"
            title="Refresh both lists"
          >
            <RefreshIcon />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats for both Product Types and Attributes */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <div className="bg-white border border-neutral-300 rounded-lg shadow p-4">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Total types</p>
          <p className="text-xl font-bold text-neutral-900">{totalTypes}</p>
        </div>
        <div className="bg-white border border-neutral-300 rounded-lg shadow p-4">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Types with variations</p>
          <p className="text-xl font-bold text-neutral-900">{withVariations}</p>
        </div>
        <div className="bg-white border border-neutral-300 rounded-lg shadow p-4">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Type product usage</p>
          <p className="text-xl font-bold text-neutral-900">{totalProductUsage}</p>
        </div>
        <div className="bg-white border border-neutral-300 rounded-lg shadow p-4">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Total attributes</p>
          <p className="text-xl font-bold text-neutral-900">{totalAttributes}</p>
        </div>
        <div className="bg-white border border-neutral-300 rounded-lg shadow p-4">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Select type attrs</p>
          <p className="text-xl font-bold text-neutral-900">{attrSelectType}</p>
        </div>
        <div className="bg-white border border-neutral-300 rounded-lg shadow p-4">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Attr product usage</p>
          <p className="text-xl font-bold text-neutral-900">{attrProductUsage}</p>
        </div>
      </div>

      {/* Two tables side by side 50-50 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Product Types */}
        <div className="min-w-0 flex flex-col gap-4">
          {loading ? (
            <div className="bg-white border border-neutral-300 rounded-lg shadow flex items-center justify-center py-16 text-neutral-500 min-h-[200px]">
              Loading product types…
            </div>
          ) : (
            <div className="min-w-0">
              <Table
                columns={columns}
                data={filteredTypes}
                rowKey="id"
                filterBar={
                  <TableFilterBarWithSearch
                    search={
                      <TableSearchInput
                        value={search}
                        onChange={setSearch}
                        placeholder="Search types..."
                      />
                    }
                  />
                }
                emptyState={{
                  message: types.length === 0 ? 'No product types yet' : 'No types match your search.',
                  subMessage: types.length === 0 ? 'Add types like Physical or Digital.' : 'Try a different search.',
                  actionLabel: 'Add product type',
                  onAction: openCreate,
                }}
              />
            </div>
          )}
        </div>

        {/* Right: Attributes */}
        <div className="min-w-0 flex flex-col gap-4">
          {attrLoading ? (
            <div className="bg-white border border-neutral-300 rounded-lg shadow flex items-center justify-center py-16 text-neutral-500 min-h-[200px]">
              Loading attributes…
            </div>
          ) : (
            <div className="min-w-0">
              <Table
                columns={attrColumns}
                data={filteredAttributes}
                rowKey="id"
                filterBar={
                  <TableFilterBarWithSearch
                    search={
                      <TableSearchInput
                        value={attrSearch}
                        onChange={setAttrSearch}
                        placeholder="Search attributes..."
                      />
                    }
                  />
                }
                emptyState={{
                  message: attributes.length === 0 ? 'No attributes yet' : 'No attributes match your search.',
                  subMessage: attributes.length === 0 ? 'Add attributes like Size, Color.' : 'Try a different search.',
                  actionLabel: 'Add attribute',
                  onAction: openAttrCreate,
                }}
              />
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={closeModal}>
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              {editingId ? 'Edit product type' : 'Add product type'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Physical, Digital"
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
                  placeholder="e.g. physical, digital"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="hasVariations"
                  checked={formHasVariations}
                  onChange={(e) => setFormHasVariations(e.target.checked)}
                  className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="hasVariations" className="text-sm font-medium text-neutral-700">
                  Has variations (e.g. size/color)
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-md disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Saving…' : editingId ? 'Update' : 'Add product type'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attribute modal (different from product type modal) */}
      {attrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={closeAttrModal}>
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              {attrEditingId ? 'Edit attribute' : 'Add attribute'}
            </h3>
            <form onSubmit={handleAttrSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
                <input
                  type="text"
                  value={attrFormName}
                  onChange={(e) => handleAttrNameChange(e.target.value)}
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
                  value={attrFormSlug}
                  onChange={(e) => setAttrFormSlug(e.target.value)}
                  placeholder="e.g. size, color"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Type</label>
                <select
                  value={attrFormType}
                  onChange={(e) => setAttrFormType(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                >
                  <option value="select">Select (dropdown with options)</option>
                  <option value="text">Text (free text)</option>
                </select>
              </div>
              {attrFormType === 'select' && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Values (comma-separated)</label>
                  <input
                    type="text"
                    value={attrFormValuesStr}
                    onChange={(e) => setAttrFormValuesStr(e.target.value)}
                    placeholder="e.g. S, M, L, XL"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeAttrModal}
                  disabled={attrSaving}
                  className="px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-md disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={attrSaving}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {attrSaving ? 'Saving…' : attrEditingId ? 'Update' : 'Add attribute'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
