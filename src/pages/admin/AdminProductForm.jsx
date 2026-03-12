/**
 * Admin Product form – Product table only.
 * Schema: id, title, slug, description, product_type_id, brand, attributes [{ name, variations[] }], images, tags, status.
 */
import { useState, useEffect } from 'react'
import { Editor, BtnBold, BtnItalic, BtnUnderline, BtnBulletList, BtnNumberedList, Toolbar, EditorProvider } from 'react-simple-wysiwyg'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAdminProductStore } from '../../stores/adminProductStore.js'
import {
  createProduct,
  updateProduct as updateProductApi,
  getProduct as getProductApi,
  listVariations,
  createVariation,
} from '../../api/productVaration.js'

const inputClass =
  'w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
const labelClass = 'block text-sm font-medium text-neutral-700 mb-1'

function SectionCard({ id, title, badge, children, expanded, onToggle }) {
  return (
    <div id={`section-${id}`} className="bg-white border border-neutral-300 rounded-md overflow-hidden mb-4">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-neutral-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
          {badge && (
            <span className={`text-xs px-2 py-0.5 rounded ${badge === 'Required' ? 'bg-blue-100 text-blue-700' : 'bg-neutral-100 text-neutral-600'}`}>
              {badge}
            </span>
          )}
        </div>
        <span className="text-neutral-400 shrink-0">
          {expanded ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </span>
      </button>
      {expanded && <div className="px-6 pb-6 pt-0 border-t border-neutral-200">{children}</div>}
    </div>
  )
}

export function AdminProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const { getProduct, addProduct, updateProduct } = useAdminProductStore()

  const [expandedSections, setExpandedSections] = useState(['basic', 'attributes', 'images', 'variations'])
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [productTypeId, setProductTypeId] = useState('')
  const [brand, setBrand] = useState('')
  const [tags, setTags] = useState([])
  const [tagsInput, setTagsInput] = useState('')
  const [status, setStatus] = useState(true)
  const [basePrice, setBasePrice] = useState('')
  const [baseWeight, setBaseWeight] = useState('')
  const [baseStock, setBaseStock] = useState('')
  const [productAttributes, setProductAttributes] = useState([
    // { name: 'color', variations: ['white', 'black', 'red'] },
    // { name: 'size', variations: ['S', 'M', 'L', 'XL'] },
  ])
  const [showNewAttributeInput, setShowNewAttributeInput] = useState(false)
  const [newAttributeNameDraft, setNewAttributeNameDraft] = useState('')
  const [images, setImages] = useState([])
  const [saving, setSaving] = useState(false)
  // Variations (edit mode only)
  const [productVariations, setProductVariations] = useState([])
  const [loadingVariations, setLoadingVariations] = useState(false)
  const [newVarTitle, setNewVarTitle] = useState('')
  const [newVarSku, setNewVarSku] = useState('')
  const [newVarPrice, setNewVarPrice] = useState('')
  const [newVarComparePrice, setNewVarComparePrice] = useState('')
  const [newVarAttributesId, setNewVarAttributesId] = useState('')
  const [newVarWeight, setNewVarWeight] = useState('')
  const [newVarStock, setNewVarStock] = useState('0')
  const [newVarStatus, setNewVarStatus] = useState(true)
  const [newVarImages, setNewVarImages] = useState([])
  const [newVarAttributeSelections, setNewVarAttributeSelections] = useState({})
  const [addingVariation, setAddingVariation] = useState(false)

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((s) => s !== sectionId) : [...prev, sectionId]
    )
  }

  useEffect(() => {
    if (isEdit && id) {
      const load = async () => {
        try {
          const p = await getProductApi(id)
          if (p) {
            setTitle(p.title || p.name || '')
            setSlug(p.slug || '')
            setDescription(p.description || '')
            setProductTypeId(String(p.product_type_id ?? p.productTypeId ?? ''))
            setBrand(p.brand || '')
            if (Array.isArray(p.tags)) {
              setTags(p.tags)
              setTagsInput(p.tags.join(', '))
            } else if (p.tags) setTagsInput(String(p.tags))
            setStatus(p.status !== false)
            if (Array.isArray(p.attributes) && p.attributes.length > 0) {
              setProductAttributes(
                p.attributes.map((a) => ({ name: a.name || '', variations: a.variations || [] }))
              )
            }
            if (p.images?.length) {
              setImages(
                p.images.map((img) =>
                  typeof img === 'string' ? { alt_name: '', img_url: img } : { alt_name: img.alt_name || '', img_url: img.img_url || img.url || '' }
                )
              )
            }
            if (p.base_price != null) setBasePrice(String(p.base_price))
            if (p.base_weight != null) setBaseWeight(String(p.base_weight))
            if (p.base_stock != null) setBaseStock(String(p.base_stock))
          }
        } catch {
          const p = getProduct(id)
          if (p) {
            setTitle(p.title || p.name || '')
            setSlug(p.slug || '')
            setDescription(p.description || '')
            setProductTypeId(String(p.product_type_id ?? p.productTypeId ?? ''))
            setBrand(p.brand || '')
            if (Array.isArray(p.tags)) {
              setTags(p.tags)
              setTagsInput(p.tags.join(', '))
            } else if (p.tags) setTagsInput(String(p.tags))
            setStatus(p.status !== false)
            if (Array.isArray(p.attributes) && p.attributes.length > 0) {
              setProductAttributes(
                p.attributes.map((a) => ({ name: a.name || '', variations: a.variations || [] }))
              )
            }
            if (p.images?.length) {
              setImages(
                p.images.map((img) =>
                  typeof img === 'string' ? { alt_name: '', img_url: img } : { alt_name: img.alt_name || '', img_url: img.img_url || img.url || '' }
                )
              )
            }
            if (p.base_price != null) setBasePrice(String(p.base_price))
            if (p.base_weight != null) setBaseWeight(String(p.base_weight))
            if (p.base_stock != null) setBaseStock(String(p.base_stock))
          }
        }
      }
      load()
    }
  }, [id, isEdit, getProduct])

  useEffect(() => {
    if (isEdit && id) {
      setLoadingVariations(true)
      const productIdNum = parseInt(id, 10)
      listVariations({ product_id: id })
        .then((res) => {
          const list = Array.isArray(res) ? res : res?.data ?? res?.variations ?? []
          const forThisProduct = list.filter((v) => v.product_id == productIdNum)
          setProductVariations(forThisProduct)
        })
        .catch(() => setProductVariations([]))
        .finally(() => setLoadingVariations(false))
    } else {
      setProductVariations([])
    }
  }, [id, isEdit])

  useEffect(() => {
    if (!title) return
    const s = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    if (!slug || slug === slug.replace(/-\d+$/, '')) setSlug(s)
  }, [title])


  const handleProductAttributeVariations = (idx, valuesStr) => {
    const variations = valuesStr
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean)
    setProductAttributes((prev) => prev.map((a, i) => (i === idx ? { ...a, variations } : a)))
  }

  const handleAddProductAttribute = (name = '') => {
    const trimmed = (typeof name === 'string' ? name : '').trim()
    setProductAttributes((prev) => [...prev, { name: trimmed, variations: [] }])
    setShowNewAttributeInput(false)
    setNewAttributeNameDraft('')
  }

  const handleConfirmNewAttributeName = () => {
    const name = newAttributeNameDraft.trim()
    if (name) handleAddProductAttribute(name)
  }

  const handleRemoveProductAttribute = (idx) => {
    setProductAttributes((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleAddImage = () => setImages([...images, { alt_name: '', img_url: '' }])
  const handleImageChange = (idx, field, value) =>
    setImages((im) => im.map((img, i) => (i === idx ? { ...img, [field]: value } : img)))
  const handleRemoveImage = (idx) => setImages((im) => im.filter((_, i) => i !== idx))

  const handleNewVarImageChange = (idx, field, value) =>
    setNewVarImages((im) => im.map((img, i) => (i === idx ? { ...img, [field]: value } : img)))
  const handleNewVarAddImage = () => setNewVarImages((prev) => [...prev, { alt_name: '', img_url: '' }])
  const handleNewVarRemoveImage = (idx) => setNewVarImages((prev) => prev.filter((_, i) => i !== idx))

  const handleNewVarAttributeSelect = (attrName, value) =>
    setNewVarAttributeSelections((prev) => ({ ...prev, [attrName]: value }))

  const handleAddVariation = async (e) => {
    if (e) e.preventDefault()
    if (!id) return
    setAddingVariation(true)
    const productId = parseInt(id, 10)
    const varAttributes = productAttributes
      .filter((a) => a.name && (a.variations || []).length > 0)
      .map((a) => ({ name: a.name || '', variation: newVarAttributeSelections[a.name] || '' }))
      .filter((a) => a.variation)
    const payload = {
      title: newVarTitle.trim() || '',
      sku: newVarSku.trim() || '',
      images: newVarImages.map((img) => ({
        alt_name: img?.alt_name ?? '',
        img_url: img?.img_url ?? '',
      })),
      price: newVarPrice !== '' ? parseFloat(newVarPrice) : 0,
      compare_price: newVarComparePrice !== '' ? parseFloat(newVarComparePrice) : 0,
      attributes: varAttributes,
      attributes_id: newVarAttributesId !== '' ? parseInt(newVarAttributesId, 10) : 0,
      status: newVarStatus,
      weight: newVarWeight !== '' ? parseFloat(newVarWeight) : 0,
      stock: newVarStock !== '' ? parseInt(newVarStock, 10) : 0,
      product_id: productId,
    }
    try {
      const res = await createVariation(payload)
      const created = res?.id ? { ...payload, id: res.id } : { ...payload, id: Date.now() }
      setProductVariations((prev) => [...prev, created])
      setNewVarTitle('')
      setNewVarSku('')
      setNewVarPrice('')
      setNewVarComparePrice('')
      setNewVarAttributesId('')
      setNewVarWeight('')
      setNewVarStock('0')
      setNewVarStatus(true)
      setNewVarImages([])
      setNewVarAttributeSelections({})
    } catch (err) {
      console.error(err)
    } finally {
      setAddingVariation(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const filteredAttributes = productAttributes
      .filter((a) => a.name && (a.variations || []).length > 0)
      .map((a) => ({ name: a.name, variations: a.variations }))
    const productPayload = {
      title,
      slug: slug.trim() || null,
      description: description.trim() || null,
      product_type_id: productTypeId ? parseInt(productTypeId, 10) : null,
      images: images
        .filter((img) => img?.img_url)
        .map((img) => ({ alt_name: img.alt_name || '', img_url: img.img_url })),
      brand: brand.trim() || null,
      attributes: filteredAttributes.length > 0 ? filteredAttributes : null,
      tags:
        tags.length > 0 ? tags : (tagsInput ? tagsInput.split(',').map((t) => t.trim()).filter(Boolean) : []),
      base_price: basePrice !== '' ? parseFloat(basePrice) : null,
      base_weight: baseWeight !== '' ? parseFloat(baseWeight) : null,
      base_stock: baseStock !== '' ? parseInt(baseStock, 10) : null,
      status,
    }
    
    try {
      if (isEdit) {
        await updateProductApi(id, productPayload)
        updateProduct(id, { ...productPayload, id: parseInt(id, 10) })
        navigate('/admin/products')
      } else {
        const res = await createProduct(productPayload)
        const newId = res?.id ?? res?.data?.id
        if (newId) {
          addProduct({ ...productPayload, id: newId })
          navigate(`/admin/products/${newId}/variations`)
        } else {
          addProduct({ ...productPayload, id: Date.now() })
          navigate('/admin/products')
        }
      }
    } catch (err) {
      console.error(err)
      if (isEdit) {
        updateProduct(id, productPayload)
        navigate('/admin/products')
      } else {
        addProduct({ ...productPayload, id: Date.now() })
        navigate('/admin/products')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">
            {isEdit ? 'Edit product' : 'Add product'}
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            {isEdit
              ? 'Update product details (title, attributes, images). Manage variations separately.'
              : 'Create a new product. Add variations from the product edit page.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isEdit && (
            <Link
              to={`/admin/products/${id}/variations`}
              className="px-4 py-2 rounded-md border border-neutral-300 bg-white text-neutral-800 text-sm font-medium hover:bg-neutral-50 transition-colors"
            >
              Manage variations
            </Link>
          )}
          <Link
            to="/admin/products"
            className="px-4 py-2 rounded-md border border-neutral-300 bg-white text-neutral-800 text-sm font-medium hover:bg-neutral-50 transition-colors"
          >
            Back to list
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-4">
        <aside className="w-[10%]">
          <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Sections</h3>
          <nav className="space-y-0.5">
            {['basic', 'attributes', 'images', ...(isEdit ? ['variations'] : [])].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleSection(s)}
                className={`block w-full text-left px-3 py-2 rounded text-sm ${expandedSections.includes(s) ? 'bg-neutral-100 text-neutral-900 font-medium' : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
              >
                {s === 'basic' && 'Basic info'}
                {s === 'attributes' && 'Attributes'}
                {s === 'images' && 'Images'}
                {s === 'variations' && 'Variations'}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <SectionCard
            id="basic"
            title="Basic info"
            badge="Required"
            expanded={expandedSections.includes('basic')}
            onToggle={toggleSection}
          >
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Category ID</label>
                  <input
                    type="number"
                    value={productTypeId}
                    onChange={(e) => setProductTypeId(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. 1"
                  />
                </div>
                <div>
                  <label className={labelClass}>Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className={inputClass}
                    placeholder="e.g. Nike Cotton T-Shirt"
                  />
                </div>
                <div>
                  <label className={labelClass}>Brand</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. NIKE"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Slug (optional)</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. nike-cotton-tshirt"
                />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <div className="border border-neutral-300 rounded-md overflow-hidden">
                  <EditorProvider>
                    <Editor
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    >
                      <Toolbar>
                        <BtnBold />
                        <BtnItalic />
                        <BtnUnderline />
                        <BtnBulletList />
                        <BtnNumberedList />
                      </Toolbar>
                    </Editor>
                  </EditorProvider>
                </div>
              </div>
              <div>
                <label className={labelClass}>Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tagsInput || tags.join(', ')}
                  onChange={(e) => {
                    setTagsInput(e.target.value)
                    setTags(e.target.value.split(',').map((t) => t.trim()).filter(Boolean))
                  }}
                  className={inputClass}
                  placeholder="tshirt, cotton, summer"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Base price</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. 29.99"
                  />
                </div>
                <div>
                  <label className={labelClass}>Base weight</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={baseWeight}
                    onChange={(e) => setBaseWeight(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. 0.25"
                  />
                </div>
                <div>
                  <label className={labelClass}>Base stock</label>
                  <input
                    type="number"
                    min="0"
                    value={baseStock}
                    onChange={(e) => setBaseStock(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. 100"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={status} onChange={(e) => setStatus(e.target.checked)} />
                <span className="text-sm">Active</span>
              </label>
            </div>
          </SectionCard>

          <SectionCard
            id="attributes"
            title="Attributes (variations)"
            badge="For variants"
            expanded={expandedSections.includes('attributes')}
            onToggle={toggleSection}
          >
            <div className="pt-4">
              <p className="text-sm text-neutral-600 mb-4">
                Define attribute names and possible values. Used when creating variations (e.g. Color: white, black | Size: S, M, L, XL).
              </p>
              <div className="flex flex-wrap gap-4">
                {productAttributes.map((attr, idx) => (
                  <div key={idx} className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-neutral-800">{attr.name || '—'} :</span>
                    <div className="min-w-[200px]">
                      <input
                        type="text"
                        value={(attr.variations || []).join(', ')}
                        onChange={(e) => handleProductAttributeVariations(idx, e.target.value)}
                        className="w-full min-w-[180px] px-3 py-1.5 border border-neutral-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. white, black, red"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveProductAttribute(idx)}
                      className="text-red-600 hover:text-red-700 p-1"
                      aria-label="Remove attribute"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              {showNewAttributeInput ? (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={newAttributeNameDraft}
                    onChange={(e) => setNewAttributeNameDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleConfirmNewAttributeName()
                      }
                      if (e.key === 'Escape') setShowNewAttributeInput(false)
                    }}
                    placeholder="e.g. color, size"
                    className="px-3 py-2 border border-neutral-300 rounded-md text-sm min-w-[160px]"
                    autoFocus
                  />
                  <button type="button" onClick={handleConfirmNewAttributeName} disabled={!newAttributeNameDraft.trim()} className="px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
                    Add
                  </button>
                  <button type="button" onClick={() => { setShowNewAttributeInput(false); setNewAttributeNameDraft('') }} className="px-3 py-2 text-sm border border-neutral-400 rounded-md hover:bg-neutral-100">
                    Cancel
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => setShowNewAttributeInput(true)} className="mt-4 px-3 py-2 text-sm font-medium border border-neutral-400 rounded-md hover:bg-neutral-100">
                  + Add attribute
                </button>
              )}
            </div>
          </SectionCard>

          <SectionCard
            id="images"
            title="Images"
            badge="Optional"
            expanded={expandedSections.includes('images')}
            onToggle={toggleSection}
          >
            <div className="pt-4 space-y-3">
              <p className="text-sm text-neutral-600">Product images (alt_name, img_url).</p>
              {images.map((img, i) => (
                <div key={i} className="flex flex-wrap gap-3 items-end p-3 border border-neutral-200 rounded-lg">
                  <div className="min-w-[120px] flex-1">
                    <label className={labelClass}>Alt name</label>
                    <input
                      type="text"
                      value={img?.alt_name ?? ''}
                      onChange={(e) => handleImageChange(i, 'alt_name', e.target.value)}
                      className={inputClass}
                      placeholder="e.g. front, back"
                    />
                  </div>
                  <div className="flex-[2] min-w-[200px]">
                    <label className={labelClass}>Image URL</label>
                    <input
                      type="url"
                      value={img?.img_url ?? ''}
                      onChange={(e) => handleImageChange(i, 'img_url', e.target.value)}
                      className={inputClass}
                      placeholder="/products/... or https://..."
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
            </div>
          </SectionCard>

          {isEdit && (
            <SectionCard
              id="variations"
              title="Variations"
              badge="SKU, price, stock"
              expanded={expandedSections.includes('variations')}
              onToggle={toggleSection}
            >
              <div className="pt-4 space-y-6">
                <p className="text-sm text-neutral-600">
                  Add variations for this product. Each variation has title, SKU, price, attributes_id, weight, stock. Data is saved to the variation table for the selected product.
                </p>

                <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50/50">
                  <h3 className="text-sm font-semibold text-neutral-800 mb-3">Add variation</h3>
                  <p className="text-xs text-neutral-500 mb-3">
                    Submits to POST /products/variations/create: title, sku, images, price, compare_price, attributes, attributes_id, status, weight, stock, product_id.
                  </p>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Title *</label>
                        <input
                          type="text"
                          value={newVarTitle}
                          onChange={(e) => setNewVarTitle(e.target.value)}
                          className={inputClass}
                          placeholder="e.g. Blue - Medium"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>SKU</label>
                        <input
                          type="text"
                          value={newVarSku}
                          onChange={(e) => setNewVarSku(e.target.value)}
                          className={inputClass}
                          placeholder="e.g. TSHIRT-BLU-M"
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-neutral-700 mb-2">Images</h4>
                      {newVarImages.map((img, i) => (
                        <div key={i} className="flex flex-wrap gap-3 items-end p-3 border border-neutral-200 rounded-lg mb-2">
                          <div className="min-w-[100px] flex-1">
                            <label className={labelClass}>Alt name</label>
                            <input
                              type="text"
                              value={img?.alt_name ?? ''}
                              onChange={(e) => handleNewVarImageChange(i, 'alt_name', e.target.value)}
                              className={inputClass}
                              placeholder="e.g. white-front"
                            />
                          </div>
                          <div className="flex-[2] min-w-[180px]">
                            <label className={labelClass}>Image URL</label>
                            <input
                              type="url"
                              value={img?.img_url ?? ''}
                              onChange={(e) => handleNewVarImageChange(i, 'img_url', e.target.value)}
                              className={inputClass}
                              placeholder="/products/..."
                            />
                          </div>
                          <button type="button" onClick={() => handleNewVarRemoveImage(i)} className="text-sm text-red-600 hover:text-red-700 shrink-0">
                            Remove
                          </button>
                        </div>
                      ))}
                      <button type="button" onClick={handleNewVarAddImage} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        + Add image
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className={labelClass}>Price *</label>
                        <input
                          type="number"
                          step="0.01"
                          value={newVarPrice}
                          onChange={(e) => setNewVarPrice(e.target.value)}
                          className={inputClass}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Compare price</label>
                        <input
                          type="number"
                          step="0.01"
                          value={newVarComparePrice}
                          onChange={(e) => setNewVarComparePrice(e.target.value)}
                          className={inputClass}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Weight</label>
                        <input
                          type="number"
                          step="0.01"
                          value={newVarWeight}
                          onChange={(e) => setNewVarWeight(e.target.value)}
                          className={inputClass}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Stock</label>
                        <input
                          type="number"
                          value={newVarStock}
                          onChange={(e) => setNewVarStock(e.target.value)}
                          className={inputClass}
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-neutral-700 mb-2">Attributes (name, variation)</h4>
                      <div className="flex flex-wrap gap-x-5 gap-y-2 items-center">
                        {productAttributes
                          .filter((a) => a.name && (a.variations || []).length > 0)
                          .map((attr) => (
                            <div key={attr.name} className="flex gap-2 items-center">
                              <label className="text-sm font-medium text-neutral-700 shrink-0">
                                {attr.name}:
                              </label>
                              <select
                                value={newVarAttributeSelections[attr.name] ?? ''}
                                onChange={(e) => handleNewVarAttributeSelect(attr.name, e.target.value)}
                                className="flex-1 max-w-[200px] px-3 py-2 border border-neutral-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="">Select {attr.name}</option>
                                {(attr.variations || []).map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ))}
                      </div>
                      {productAttributes.filter((a) => a.name && (a.variations || []).length > 0).length === 0 && (
                        <p className="text-sm text-neutral-500">Define attributes in the Attributes section above, then pick a value per attribute here.</p>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={newVarStatus}
                          onChange={(e) => setNewVarStatus(e.target.checked)}
                        />
                        <span className="text-sm">Status (active)</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleAddVariation}
                        disabled={addingVariation}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {addingVariation ? 'Adding…' : 'Add variation'}
                      </button>
                    </div>
                  </div>
                </div>

                {loadingVariations ? (
                  <p className="text-neutral-500 text-sm">Loading variations…</p>
                ) : (
                  <div className="overflow-x-auto border border-neutral-200 rounded-lg">
                    <table className="min-w-full divide-y divide-neutral-200">
                      <thead className="bg-neutral-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-600 uppercase">Title</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-600 uppercase">SKU</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-600 uppercase">Price</th>
                          {/* <th className="px-4 py-2 text-left text-xs font-medium text-neutral-600 uppercase">Attributes ID</th> */}
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-600 uppercase">Stock</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-600 uppercase">Weight</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-600 uppercase">Status</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-neutral-600 uppercase">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200 bg-white">
                        {(() => {
                          const forThisProduct = productVariations.filter(
                            (v) => v.product_id == id || v.product_id === parseInt(id, 10)
                          )
                          return forThisProduct.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="px-4 py-4 text-center text-neutral-500 text-sm">
                              No variations yet. Add one below.
                            </td>
                          </tr>
                        ) : (
                          forThisProduct.map((v) => (
                            <tr key={v.id} className="hover:bg-neutral-50">
                              <td className="px-4 py-2 text-sm text-neutral-900">{v.title || '—'}</td>
                              <td className="px-4 py-2 text-sm text-neutral-600">{v.sku || '—'}</td>
                              <td className="px-4 py-2 text-sm text-neutral-600">{v.price != null ? `$${Number(v.price).toFixed(2)}` : '—'}</td>
                              <td className="px-4 py-2 text-sm text-neutral-600">{v.attributes_id ?? '—'}</td>
                              <td className="px-4 py-2 text-sm text-neutral-600">{v.stock ?? '—'}</td>
                              <td className="px-4 py-2 text-sm text-neutral-600">{v.weight ?? '—'}</td>
                              <td className="px-4 py-2">
                                <span className={`text-xs px-2 py-0.5 rounded ${v.status ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'}`}>
                                  {v.status ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="px-4 py-2 text-right">
                                <Link
                                  to={`/admin/products/${id}/variations/${v.id}`}
                                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                  Edit
                                </Link>
                              </td>
                            </tr>
                          ))
                        );
                        })()}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>
            </SectionCard>
          )}
        </main>

        <aside className="w-1/5 h-fit shrink-0 bg-white p-6 border border-neutral-300 rounded-lg">
          <div className="space-y-6">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : isEdit ? 'Update product' : 'Create product'}
            </button>
            <Link to="/admin/products" className="w-full py-2.5 border border-neutral-300 rounded-md font-medium text-center hover:bg-neutral-50 block">
              Cancel
            </Link>
          </div>
        </aside>
      </form>
    </div>
  )
}
