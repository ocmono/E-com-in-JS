import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader.jsx'
import { categories as initialCategories } from '../../data/adminMockData.js'

const FolderIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
)

const BoxIcon = () => (
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
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

function generateId() {
  return 'cat-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9)
}

export function AdminCategories() {
  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState(initialCategories)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingParentId, setEditingParentId] = useState(null) // null = top-level category
  const [formName, setFormName] = useState('')
  const [formSlug, setFormSlug] = useState('')

  const totalCategories = categories.length
  const emptyCategories = categories.filter((c) => (c.productCount ?? 0) === 0).length
  const avgProducts = totalCategories > 0
    ? (categories.reduce((s, c) => s + (c.productCount ?? 0), 0) / totalCategories).toFixed(1)
    : '0'

  const topLevel = useMemo(
    () => categories.filter((c) => !c.parentId),
    [categories]
  )

  const getChildren = (parentId) =>
    categories.filter((c) => c.parentId === parentId)

  const getCategoryById = (id) => categories.find((c) => c.id === id)

  const filteredTree = useMemo(() => {
    if (!search.trim()) return topLevel
    const q = search.trim().toLowerCase()
    const matches = (c) =>
      c.name.toLowerCase().includes(q) || (c.slug && c.slug.toLowerCase().includes(q))
    const includeIds = new Set()
    categories.forEach((c) => {
      if (matches(c)) {
        includeIds.add(c.id)
        let pid = c.parentId
        while (pid) {
          includeIds.add(pid)
          const parent = getCategoryById(pid)
          pid = parent?.parentId
        }
      }
    })
    return topLevel.filter((c) => includeIds.has(c.id))
  }, [categories, topLevel, search])

  const openAddCategory = () => {
    setEditingParentId(null)
    setFormName('')
    setFormSlug('')
    setModalOpen(true)
  }

  const openAddSubcategory = (parentId) => {
    setEditingParentId(parentId)
    const parent = getCategoryById(parentId)
    setFormName('')
    setFormSlug(parent ? `${parent.slug}-` : '')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingParentId(null)
    setFormName('')
    setFormSlug('')
  }

  const handleNameChange = (name) => {
    setFormName(name)
    if (!formSlug || formSlug === slugify(formName) || formSlug.startsWith(getCategoryById(editingParentId)?.slug + '-')) {
      setFormSlug(editingParentId ? `${getCategoryById(editingParentId)?.slug || ''}-${slugify(name)}` : slugify(name))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const name = formName.trim()
    const slug = (formSlug || slugify(name)).trim()
    if (!name) return
    const newCat = {
      id: generateId(),
      name,
      slug: slug || slugify(name),
      parentId: editingParentId || null,
      productCount: 0,
    }
    setCategories((prev) => [...prev, newCat])
    closeModal()
  }

  const renderCategoryRow = (cat, isChild = false) => {
    const childList = getChildren(cat.id)

    return (
      <div key={cat.id} className={isChild ? 'ml-6 border-l-2 border-neutral-200 pl-4' : ''}>
        <div className="flex items-center justify-between p-4 border border-admin rounded-lg hover:bg-neutral-50 group">
          <div className="flex items-center gap-2 min-w-0">
            {!isChild && (
              <span className="text-neutral-400 shrink-0">
                <FolderIcon />
              </span>
            )}
            <div className="min-w-0">
              <p className="font-medium text-neutral-900">{cat.name}</p>
              <p className="text-sm text-neutral-500">
                {cat.slug} · {cat.productCount ?? 0} products
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => openAddSubcategory(cat.id)}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
              title="Add subcategory"
            >
              <PlusIcon />
              Subcategory
            </button>
            <Link
              to={`/admin/categories/${cat.id}`}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Edit
            </Link>
          </div>
        </div>
        {childList.length > 0 && (
          <div className="mt-2 space-y-2">
            {childList.map((child) => renderCategoryRow(child, true))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <AdminPageHeader
        title="Categories"
        description="Product categories and subcategories. Add or edit, then assign products in the product editor."
      >
        <button
          type="button"
          onClick={openAddCategory}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <PlusIcon />
          Add category
        </button>
      </AdminPageHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-admin-bg border border-admin rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              <FolderIcon />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Total categories</p>
              <p className="text-2xl font-bold text-neutral-900">{totalCategories}</p>
            </div>
          </div>
        </div>
        <div className="bg-admin-bg border border-admin rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
              <FolderIcon />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Empty categories</p>
              <p className="text-2xl font-bold text-neutral-900">{emptyCategories}</p>
            </div>
          </div>
        </div>
        <div className="bg-admin-bg border border-admin rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
              <BoxIcon />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Avg products per category</p>
              <p className="text-2xl font-bold text-neutral-900">{avgProducts}</p>
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
          placeholder="Search name or slug..."
          className="w-full px-4 py-2 border border-admin rounded-md bg-admin-bg"
        />
      </div>

      <div className="bg-admin-bg border border-admin rounded-lg shadow p-6 min-h-[200px]">
        {totalCategories === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16">
            <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-400 mb-4">
              <FolderIcon />
            </div>
            <p className="text-lg font-medium text-neutral-900 mb-1">No categories yet</p>
            <p className="text-neutral-500 mb-6">
              Add a category to organize your products (e.g. Cleansers, Serums, Moisturizers).
            </p>
            <button
              type="button"
              onClick={openAddCategory}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 flex items-center gap-2 w-fit"
            >
              <PlusIcon />
              Add category
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTree.length === 0 ? (
              <p className="text-neutral-500 py-8 text-center">No categories match your search.</p>
            ) : (
              filteredTree.map((cat) => renderCategoryRow(cat))
            )}
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={closeModal}>
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              {editingParentId ? 'Add subcategory' : 'Add category'}
            </h3>
            {editingParentId && (
              <p className="text-sm text-neutral-500 mb-3">
                Parent: <span className="font-medium text-neutral-700">{getCategoryById(editingParentId)?.name}</span>
              </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. T-Shirts"
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
                  placeholder="e.g. t-shirts"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
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
                  {editingParentId ? 'Add subcategory' : 'Add category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
