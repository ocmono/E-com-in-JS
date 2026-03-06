/**
 * Add/Edit product form - Amazon-style with variations.
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAdminProductStore } from '../../stores/adminProductStore.js'

export function AdminProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const { getProduct, addProduct, updateProduct } = useAdminProductStore()

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [price, setPrice] = useState('')
  const [compareAtPrice, setCompareAtPrice] = useState('')
  const [stock, setStock] = useState('')
  const [featured, setFeatured] = useState(false)
  const [attributeNames, setAttributeNames] = useState(['Size', 'Color'])
  const [attributeValues, setAttributeValues] = useState({ Size: ['S', 'M', 'L'], Color: ['Black', 'White'] })
  const [variants, setVariants] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isEdit) {
      const p = getProduct(id)
      if (p) {
        setName(p.name || '')
        setSlug(p.slug || '')
        setDescription(p.description || '')
        setShortDescription(p.shortDescription || '')
        setPrice(String(p.price ?? ''))
        setCompareAtPrice(String(p.compareAtPrice ?? ''))
        setStock(String(p.stock ?? ''))
        setFeatured(p.featured ?? false)
        if (p.attributes) {
          setAttributeNames(Object.keys(p.attributes))
          setAttributeValues(p.attributes)
        }
        if (p.variants?.length) {
          setVariants(p.variants)
        }
      }
    }
  }, [id, isEdit, getProduct])

  useEffect(() => {
    if (!name) return
    const s = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    if (!slug || slug === slug.replace(/-\d+$/, '')) setSlug(s)
  }, [name])

  const generateVariants = () => {
    const attrs = attributeNames.filter((n) => attributeValues[n]?.length)
    if (attrs.length === 0) return []
    const combos = attrs.reduce(
      (acc, name) => {
        const vals = attributeValues[name] || []
        if (acc.length === 0) return vals.map((v) => ({ [name]: v }))
        return acc.flatMap((combo) => vals.map((v) => ({ ...combo, [name]: v })))
      },
      [{}]
    )
    const basePrice = parseFloat(price) || 0
    return combos.map((attrs, i) => ({
      id: 'v' + Date.now() + i,
      sku: `SKU-${Date.now()}-${i}`,
      attributes: attrs,
      price: basePrice,
      stock: parseInt(stock, 10) || 0,
    }))
  }

  const handleAddAttribute = () => {
    const name = prompt('Attribute name (e.g. Size, Color):')
    if (name) {
      setAttributeNames([...attributeNames, name])
      setAttributeValues({ ...attributeValues, [name]: [''] })
    }
  }

  const handleAttributeValues = (attrName, valuesStr) => {
    const vals = valuesStr.split(',').map((v) => v.trim()).filter(Boolean)
    setAttributeValues({ ...attributeValues, [attrName]: vals })
  }

  const handleVariantChange = (idx, field, value) => {
    setVariants((v) =>
      v.map((v, i) => (i === idx ? { ...v, [field]: value } : v))
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSaving(true)
    const basePrice = parseFloat(price) || 0
    const payload = {
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      description,
      shortDescription,
      price: basePrice,
      compareAtPrice: parseFloat(compareAtPrice) || undefined,
      stock: variants.reduce((s, v) => s + (parseInt(v.stock, 10) || 0), 0) || parseInt(stock, 10) || 0,
      featured,
      categoryIds: [],
      images: [],
      attributes: attributeValues,
      variants: variants.length
        ? variants.map((v) => ({
            ...v,
            price: parseFloat(v.price) || basePrice,
            stock: parseInt(v.stock, 10) || 0,
          }))
        : [{ id: 'v0', sku: 'SIMPLE', attributes: {}, price: basePrice, stock: parseInt(stock, 10) || 0 }],
    }
    if (isEdit) {
      updateProduct(id, payload)
      navigate('/admin/products')
    } else {
      addProduct(payload)
      navigate('/admin/products')
    }
    setSaving(false)
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link to="/admin/products" className="text-neutral-500 hover:text-neutral-700">
          ← Products
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900">
          {isEdit ? 'Edit product' : 'Add product'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
        <div className="bg-admin-bg border border-admin rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Basic info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1">Product name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-admin rounded-md focus:ring-2 focus:ring-red-500"
                placeholder="e.g. Classic Cotton T-Shirt"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">URL slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-2 border border-admin rounded-md focus:ring-2 focus:ring-red-500"
                placeholder="classic-cotton-tshirt"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Short description</label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full px-4 py-2 border border-admin rounded-md focus:ring-2 focus:ring-red-500"
                placeholder="Brief summary"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-admin rounded-md focus:ring-2 focus:ring-red-500"
                placeholder="Full product description"
              />
            </div>
          </div>
        </div>

        <div className="bg-admin-bg border border-admin rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Pricing & inventory</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Price *</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full px-4 py-2 border border-admin rounded-md focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Compare at price</label>
              <input
                type="number"
                step="0.01"
                value={compareAtPrice}
                onChange={(e) => setCompareAtPrice(e.target.value)}
                className="w-full px-4 py-2 border border-admin rounded-md focus:ring-2 focus:ring-red-500"
                placeholder="Original price"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Stock (simple)</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-4 py-2 border border-admin rounded-md focus:ring-2 focus:ring-red-500"
                placeholder="0"
              />
            </div>
            <div className="md:col-span-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                />
                <span className="text-sm font-medium">Featured product</span>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-admin-bg border border-admin rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Attributes & variations (Amazon-style)</h2>
          <p className="text-sm text-neutral-500 mb-4">
            Define attributes (e.g. Size, Color): each combination becomes a variant.
          </p>
          <div className="space-y-4">
            {attributeNames.map((attrName) => (
              <div key={attrName} className="flex gap-4 items-start">
                <div className="w-32">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">{attrName}</label>
                  <input
                    type="text"
                    value={(attributeValues[attrName] || []).join(', ')}
                    onChange={(e) => handleAttributeValues(attrName, e.target.value)}
                    className="w-full px-4 py-2 border border-admin rounded-md focus:ring-2 focus:ring-red-500"
                    placeholder="S, M, L or Black, White"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAttributeNames(attributeNames.filter((n) => n !== attrName))
                    setAttributeValues((v) => {
                      const next = { ...v }
                      delete next[attrName]
                      return next
                    })
                    setVariants([])
                  }}
                  className="mt-6 text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddAttribute}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              + Add attribute
            </button>
          </div>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setVariants(generateVariants())}
              className="px-4 py-2 bg-neutral-200 rounded-md text-sm font-medium hover:bg-neutral-300"
            >
              Generate variants
            </button>
          </div>
        </div>

        {variants.length > 0 && (
          <div className="bg-admin-bg border border-admin rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Variants ({variants.length})</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-admin">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase">SKU</th>
                    {attributeNames.map((n) => (
                      <th key={n} className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase">{n}</th>
                    ))}
                    <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase">Price</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-admin">
                  {variants.map((v, i) => (
                    <tr key={v.id}>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={v.sku}
                          onChange={(e) => handleVariantChange(i, 'sku', e.target.value)}
                          className="w-full px-2 py-1 border border-admin rounded text-sm"
                        />
                      </td>
                      {attributeNames.map((n) => (
                        <td key={n} className="px-4 py-2 text-sm">{v.attributes?.[n] ?? '-'}</td>
                      ))}
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          step="0.01"
                          value={v.price}
                          onChange={(e) => handleVariantChange(i, 'price', e.target.value)}
                          className="w-24 px-2 py-1 border border-admin rounded text-sm"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={v.stock}
                          onChange={(e) => handleVariantChange(i, 'stock', e.target.value)}
                          className="w-20 px-2 py-1 border border-admin rounded text-sm"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : isEdit ? 'Update product' : 'Add product'}
          </button>
          <Link
            to="/admin/products"
            className="px-6 py-2 border border-admin rounded-md font-medium hover:bg-neutral-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
