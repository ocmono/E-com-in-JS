/**
 * Admin Variation form – Variation table only.
 * Schema: id, product_id, title, sku, price, compare_price, stock, weight, attributes [{ name, variation }], images, status.
 */
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { createVariation, updateVariation, getVariation, getProduct } from '../../api/productVaration.js'

const inputClass =
  'w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
const labelClass = 'block text-sm font-medium text-neutral-700 mb-1'

export function AdminVariationForm() {
  const { productId, variationId } = useParams()
  const navigate = useNavigate()
  const isEdit = !!variationId

  const [productTitle, setProductTitle] = useState('')
  const [title, setTitle] = useState('')
  const [sku, setSku] = useState('')
  const [price, setPrice] = useState('')
  const [comparePrice, setComparePrice] = useState('')
  const [stock, setStock] = useState('0')
  const [weight, setWeight] = useState('')
  const [attributes, setAttributes] = useState([{ name: 'color', variation: 'white' }, { name: 'size', variation: 'XL' }])
  const [images, setImages] = useState([])
  const [status, setStatus] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (productId) {
      getProduct(productId)
        .then((p) => setProductTitle(p?.title || p?.name || `Product ${productId}`))
        .catch(() => setProductTitle(`Product ${productId}`))
    }
  }, [productId])

  useEffect(() => {
    if (isEdit && variationId) {
      getVariation(variationId)
        .then((v) => {
          if (v) {
            setTitle(v.title || '')
            setSku(v.sku || '')
            setPrice(String(v.price ?? ''))
            setComparePrice(String(v.compare_price ?? ''))
            setStock(String(v.stock ?? '0'))
            setWeight(String(v.weight ?? ''))
            setStatus(v.status !== false)
            if (Array.isArray(v.attributes) && v.attributes.length > 0) {
              setAttributes(v.attributes.map((a) => ({ name: a.name || '', variation: a.variation || '' })))
            }
            if (v.images?.length) {
              setImages(
                v.images.map((img) =>
                  typeof img === 'string'
                    ? { alt_name: '', img_url: img }
                    : { alt_name: img.alt_name || '', img_url: img.img_url || img.url || '' }
                )
              )
            }
          }
        })
        .catch(() => {})
    }
  }, [variationId, isEdit])

  const handleAttributeChange = (idx, field, value) => {
    setAttributes((prev) => prev.map((a, i) => (i === idx ? { ...a, [field]: value } : a)))
  }

  const handleAddAttribute = () => setAttributes((prev) => [...prev, { name: '', variation: '' }])
  const handleRemoveAttribute = (idx) => setAttributes((prev) => prev.filter((_, i) => i !== idx))

  const handleAddImage = () => setImages([...images, { alt_name: '', img_url: '' }])
  const handleImageChange = (idx, field, value) =>
    setImages((im) => im.map((img, i) => (i === idx ? { ...img, [field]: value } : img)))
  const handleRemoveImage = (idx) => setImages((im) => im.filter((_, i) => i !== idx))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      product_id: parseInt(productId, 10),
      title: title || undefined,
      sku: sku || undefined,
      price: parseFloat(price) || 0,
      compare_price: comparePrice ? parseFloat(comparePrice) : undefined,
      stock: parseInt(stock, 10) || 0,
      weight: weight ? parseFloat(weight) : undefined,
      attributes: attributes.filter((a) => a.name && a.variation).map((a) => ({ name: a.name, variation: a.variation })),
      images: images.filter((img) => img?.img_url).map((img) => ({ alt_name: img.alt_name || '', img_url: img.img_url })),
      status,
    }
    try {
      if (isEdit) {
        await updateVariation(variationId, payload)
      } else {
        await createVariation(payload)
      }
      navigate(`/admin/products/${productId}/variations`)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">
            {isEdit ? 'Edit variation' : 'Add variation'}
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            {productTitle && <span>Product: {productTitle}. </span>}
            Variation: title, SKU, price, compare price, stock, weight, attributes, images.
          </p>
        </div>
        <Link
          to={`/admin/products/${productId}/variations`}
          className="px-4 py-2 rounded-md border border-neutral-300 bg-white text-neutral-800 text-sm font-medium hover:bg-neutral-50 transition-colors"
        >
          Back to variations
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="max-w-7xl">
        <div className="bg-white border border-neutral-300 rounded-md p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className={inputClass}
                placeholder="e.g. NIKE WHITE XL"
              />
            </div>
            <div>
              <label className={labelClass}>SKU</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className={inputClass}
                placeholder="e.g. NIKE-WHITE-XL-457"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className={labelClass}>Price *</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Compare price</label>
              <input
                type="number"
                step="0.01"
                value={comparePrice}
                onChange={(e) => setComparePrice(e.target.value)}
                className={inputClass}
                placeholder="0"
              />
            </div>
            <div>
              <label className={labelClass}>Stock</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Weight</label>
              <input
                type="number"
                step="0.01"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className={inputClass}
                placeholder="0"
              />
            </div>
          </div>

          <hr className="border-neutral-200" />
          <h2 className="text-base font-semibold text-neutral-900">Attributes</h2>
          <p className="text-sm text-neutral-600">One value per attribute (e.g. color: white, size: XL).</p>
          {attributes.map((attr, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                type="text"
                value={attr.name}
                onChange={(e) => handleAttributeChange(idx, 'name', e.target.value)}
                className="flex-1 max-w-[120px] px-3 py-2 border border-neutral-300 rounded-md text-sm"
                placeholder="name"
              />
              <input
                type="text"
                value={attr.variation}
                onChange={(e) => handleAttributeChange(idx, 'variation', e.target.value)}
                className="flex-1 max-w-[120px] px-3 py-2 border border-neutral-300 rounded-md text-sm"
                placeholder="variation"
              />
              <button type="button" onClick={() => handleRemoveAttribute(idx)} className="text-red-600 hover:text-red-700 text-sm">
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddAttribute} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            + Add attribute
          </button>

          <hr className="border-neutral-200" />
          <h2 className="text-base font-semibold text-neutral-900">Images</h2>
          {images.map((img, i) => (
            <div key={i} className="flex flex-wrap gap-3 items-end p-3 border border-neutral-200 rounded-lg">
              <div className="min-w-[100px] flex-1">
                <label className={labelClass}>Alt name</label>
                <input
                  type="text"
                  value={img?.alt_name ?? ''}
                  onChange={(e) => handleImageChange(i, 'alt_name', e.target.value)}
                  className={inputClass}
                  placeholder="e.g. white-front"
                />
              </div>
              <div className="flex-[2] min-w-[180px]">
                <label className={labelClass}>Image URL</label>
                <input
                  type="url"
                  value={img?.img_url ?? ''}
                  onChange={(e) => handleImageChange(i, 'img_url', e.target.value)}
                  className={inputClass}
                  placeholder="/products/..."
                />
              </div>
              <button type="button" onClick={() => handleRemoveImage(i)} className="text-sm text-red-600 hover:text-red-700 shrink-0">
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddImage} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            + Add image
          </button>

          <hr className="border-neutral-200" />
          <div className="flex items-center justify-end gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={status} onChange={(e) => setStatus(e.target.checked)} />
              <span className="text-sm">Active</span>
            </label>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : isEdit ? 'Update variation' : 'Create variation'}
            </button>
            <Link to={`/admin/products/${productId}/variations`} className="px-4 py-2 border border-neutral-300 rounded-md text-sm font-medium hover:bg-neutral-50">
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
