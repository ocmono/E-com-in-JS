/**
 * Add/Edit product form - Section-based layout with left nav, center content, right publish sidebar.
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAdminProductStore } from '../../stores/adminProductStore.js'

const SECTIONS = [
  { id: 'basic', label: 'Basic info' },
  { id: 'pricing', label: 'Pricing & stock' },
  { id: 'categories', label: 'Categories' },
  { id: 'images', label: 'Images' },
  { id: 'variants', label: 'Variants' },
  { id: 'stock', label: 'Stock & availability' },
  { id: 'seo', label: 'SEO' },
  { id: 'content', label: 'Content sections' },
  { id: 'translations', label: 'Translations' },
  { id: 'legal', label: 'Legal & compliance' },
  { id: 'conditional', label: 'Conditional logic' },
]

function SectionCard({ id, title, badge, children, expanded, onToggle }) {
  return (
    <div
      id={`section-${id}`}
      className="bg-white border border-neutral-300 rounded-md overflow-hidden mb-4"
    >
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-neutral-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
          {badge && (
            <span
              className={`text-xs px-2 py-0.5 rounded ${
                badge === 'Required' ? 'bg-blue-100 text-blue-700' : 'bg-neutral-100 text-neutral-600'
              }`}
            >
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

const inputClass =
  'w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
const labelClass = 'block text-sm font-medium text-neutral-700 mb-1'

export function AdminProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const { getProduct, addProduct, updateProduct } = useAdminProductStore()

  const [expandedSections, setExpandedSections] = useState(['basic', 'pricing'])
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [productType, setProductType] = useState('default')
  const [kind, setKind] = useState('physical')
  const [price, setPrice] = useState('')
  const [compareAtPrice, setCompareAtPrice] = useState('')
  const [stock, setStock] = useState('0')
  const [featured, setFeatured] = useState(false)
  const [requiresLogin, setRequiresLogin] = useState(false)
  const [minOrderQty, setMinOrderQty] = useState('1')
  const [publishFrom, setPublishFrom] = useState('')
  const [publishUntil, setPublishUntil] = useState('')
  const [attributeNames, setAttributeNames] = useState(['Size', 'Color'])
  const [attributeValues, setAttributeValues] = useState({ Size: ['S', 'M', 'L'], Color: ['Black', 'White'] })
  const [variants, setVariants] = useState([])
  const [variantImages, setVariantImages] = useState({})
  const [expandedVariantImages, setExpandedVariantImages] = useState([])
  const [tieredPricing, setTieredPricing] = useState([])
  const [multiCurrencyPrices, setMultiCurrencyPrices] = useState({})
  const [currencyInput, setCurrencyInput] = useState('')
  const [categoryIds, setCategoryIds] = useState([])
  const [images, setImages] = useState([])
  const [allowBackorder, setAllowBackorder] = useState(false)
  const [backorderMessage, setBackorderMessage] = useState('')
  const [lowStockThreshold, setLowStockThreshold] = useState('')
  const [safetyStock, setSafetyStock] = useState('')
  const [reorderLevel, setReorderLevel] = useState('')
  const [allowPreorder, setAllowPreorder] = useState(false)
  const [preorderMessage, setPreorderMessage] = useState('')
  const [leadTimeDays, setLeadTimeDays] = useState('')
  const [autoHideBelow, setAutoHideBelow] = useState('0')
  const [lowStockDisplay, setLowStockDisplay] = useState('none')
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDescription, setSeoDescription] = useState('')
  const [metaKeywords, setMetaKeywords] = useState('')
  const [ogImageUrl, setOgImageUrl] = useState('')
  const [titleTemplate, setTitleTemplate] = useState('{name} | {store_name}')
  const [descriptionTemplate, setDescriptionTemplate] = useState('(short_description)')
  const [technicalSpecs, setTechnicalSpecs] = useState('')
  const [features, setFeatures] = useState('')
  const [faqs, setFaqs] = useState([])
  const [careInstructions, setCareInstructions] = useState('')
  const [translations, setTranslations] = useState({ en: { name: '', slug: '', description: '', shortDescription: '' } })
  const [manufacturingDate, setManufacturingDate] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [ingredientList, setIngredientList] = useState('')
  const [certifications, setCertifications] = useState([])
  const [conditionalLogic, setConditionalLogic] = useState('{}')
  const [saving, setSaving] = useState(false)

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((s) => s !== sectionId) : [...prev, sectionId]
    )
  }

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
          const imgs = {}
          p.variants.forEach((v) => {
            if (v.id && v.images?.length) imgs[v.id] = v.images
          })
          setVariantImages(imgs)
        }
        if (p.images?.length) setImages(p.images)
        if (p.categoryIds?.length) setCategoryIds(p.categoryIds)
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
      compareAt: '-',
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
    setVariants((v) => v.map((v, i) => (i === idx ? { ...v, [field]: value } : v)))
  }

  const handleAddTier = () => {
    setTieredPricing([...tieredPricing, { minQty: '', price: '' }])
  }

  const handleTierChange = (idx, field, value) => {
    setTieredPricing((t) => t.map((t, i) => (i === idx ? { ...t, [field]: value } : t)))
  }

  const handleAddImage = () => setImages([...images, ''])
  const handleImageChange = (idx, url) => setImages((im) => im.map((im, i) => (i === idx ? url : im)))
  const handleRemoveImage = (idx) => setImages((im) => im.filter((_, i) => i !== idx))

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      { id: 'v' + Date.now(), sku: '', attributes: {}, price: 0, compareAt: '-', stock: 0 },
    ])
  }

  const handleRemoveVariant = (idx) => {
    const v = variants[idx]
    setVariants((prev) => prev.filter((_, i) => i !== idx))
    if (v?.id) setVariantImages((prev) => { const next = { ...prev }; delete next[v.id]; return next })
  }

  const handleApplyBasePrice = () => {
    const basePrice = parseFloat(price) || 0
    setVariants((v) => v.map((x) => ({ ...x, price: basePrice })))
  }

  const handleSetStockZero = () => {
    setVariants((v) => v.map((x) => ({ ...x, stock: 0 })))
  }

  const toggleVariantImages = (variantId) => {
    setExpandedVariantImages((prev) =>
      prev.includes(variantId) ? prev.filter((id) => id !== variantId) : [...prev, variantId]
    )
  }

  const handleVariantImageAdd = (variantId) => {
    setVariantImages((prev) => ({
      ...prev,
      [variantId]: [...(prev[variantId] || []), ''],
    }))
  }

  const handleVariantImageChange = (variantId, imageIdx, url) => {
    setVariantImages((prev) => {
      const list = [...(prev[variantId] || [])]
      list[imageIdx] = url
      return { ...prev, [variantId]: list }
    })
  }

  const handleVariantImageRemove = (variantId, imageIdx) => {
    setVariantImages((prev) => {
      const list = (prev[variantId] || []).filter((_, i) => i !== imageIdx)
      const next = { ...prev }
      if (list.length) next[variantId] = list
      else delete next[variantId]
      return next
    })
  }

  const handleAddFaq = () => setFaqs([...faqs, { question: '', answer: '' }])
  const handleFaqChange = (idx, field, value) => {
    setFaqs((f) => f.map((f, i) => (i === idx ? { ...f, [field]: value } : f)))
  }
  const handleRemoveFaq = (idx) => setFaqs((f) => f.filter((_, i) => i !== idx))

  const handleAddCertification = () =>
    setCertifications([...certifications, { name: '', number: '', authority: '' }])
  const handleCertChange = (idx, field, value) => {
    setCertifications((c) => c.map((c, i) => (i === idx ? { ...c, [field]: value } : c)))
  }
  const handleRemoveCert = (idx) => setCertifications((c) => c.filter((_, i) => i !== idx))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSaving(true)
    const basePrice = parseFloat(price) || 0
    const payload = {
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      description,
      shortDescription,
      productType,
      kind,
      price: basePrice,
      compareAtPrice: parseFloat(compareAtPrice) || undefined,
      stock: variants.reduce((s, v) => s + (parseInt(v.stock, 10) || 0), 0) || parseInt(stock, 10) || 0,
      featured,
      requiresLogin,
      minOrderQty: parseInt(minOrderQty, 10) || 1,
      publishFrom: publishFrom || undefined,
      publishUntil: publishUntil || undefined,
      categoryIds,
      images: images.filter(Boolean),
      tieredPricing: tieredPricing.filter((t) => t.minQty && t.price),
      multiCurrencyPrices,
      attributes: attributeValues,
      variants:
        variants.length > 0
        ? variants.map((v) => ({
            ...v,
            price: parseFloat(v.price) || basePrice,
            stock: parseInt(v.stock, 10) || 0,
              images: (variantImages[v.id] || []).filter(Boolean),
            }))
          : [{ id: 'v0', sku: 'DEFAULT', attributes: {}, price: basePrice, stock: parseInt(stock, 10) || 0, images: [] }],
      allowBackorder,
      backorderMessage,
      lowStockThreshold,
      safetyStock,
      reorderLevel,
      allowPreorder,
      preorderMessage,
      leadTimeDays,
      autoHideBelow,
      lowStockDisplay,
      seoTitle,
      seoDescription,
      metaKeywords,
      ogImageUrl,
      titleTemplate,
      descriptionTemplate,
      technicalSpecs,
      features: features.split('\n').filter(Boolean),
      faqs,
      careInstructions,
      translations,
      manufacturingDate,
      expiryDate,
      ingredientList,
      certifications,
      conditionalLogic: (() => {
        try {
          return conditionalLogic.trim() ? JSON.parse(conditionalLogic) : {}
        } catch {
          return {}
        }
      })(),
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
    <div className="min-h-screen ">
      <div className="flex items-center justify-between mb-6">
    <div>
          <h1 className="text-xl font-bold text-neutral-900">
          {isEdit ? 'Edit product' : 'Add product'}
        </h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            {isEdit ? 'Update product details, pricing, and inventory.' : 'Create a new product with type, SKU, price, and categories.'}
          </p>
        </div>
        <Link
          to="/admin/products"
          className="px-4 py-2 rounded-md border border-neutral-300 bg-white text-neutral-800 text-sm font-medium hover:bg-neutral-50 transition-colors"
        >
          Back to list
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-4">
        {/* Left sidebar - Sections */} 
        <aside className="w-[10%]">
          <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Sections</h3>
          <nav className="space-y-0.5">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleSection(s.id)}
                className={`block w-full text-left px-3 py-2 rounded text-sm ${
                  expandedSections.includes(s.id)
                    ? 'bg-neutral-100 text-neutral-900 font-medium'
                    : 'text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Center content */}
        <main className="flex-1  overflow-y-auto">
          <SectionCard
            id="basic"
            title="Basic info"
            badge="Required"
            expanded={expandedSections.includes('basic')}
            onToggle={toggleSection}
          >
            <div className="space-y-4 pt-4">
              <div className="w-1/2">
                <label className={labelClass}>Product type (bundle)</label>
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className={inputClass}
                >
                  <option value="default">Default (no custom fields)</option>
                </select>
                <p className="text-xs text-neutral-500 mt-1">
                  Product type defines custom fields. Variable types support attribute-based variations.
                </p>
              </div>
              <div className="w-1/2">
                <label className={labelClass}>Kind</label>
                <select value={kind} onChange={(e) => setKind(e.target.value)} className={inputClass}>
                  <option value="physical">Physical</option>
                  <option value="digital">Digital</option>
                </select>
                <p className="text-xs text-neutral-500 mt-1">Determines fulfillment and catalog behavior.</p>
              </div>
              <div>
                <label className={labelClass}>Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                  className={inputClass}
                  placeholder="Product name"
              />
            </div>
              <div className="w-1/2">
                <label className={labelClass}>Slug (optional, auto from name if empty)</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                  className={inputClass}
                  placeholder="url-slug"
              />
            </div>
            <div>
                <label className={labelClass}>Short description</label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                  className={inputClass}
                placeholder="Brief summary"
              />
            </div>
              <div>
                <label className={labelClass}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                  className={inputClass}
                  placeholder="Full description"
              />
            </div>
          </div>
          </SectionCard>

          <SectionCard
            id="pricing"
            title="Pricing & stock"
            badge="Required"
            expanded={expandedSections.includes('pricing')}
            onToggle={toggleSection}
          >
            <div className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <label className={labelClass}>Compare at (optional)</label>
              <input
                type="number"
                step="0.01"
                value={compareAtPrice}
                onChange={(e) => setCompareAtPrice(e.target.value)}
                    className={inputClass}
              />
            </div>
            <div>
                  <label className={labelClass}>Stock</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                    className={inputClass}
                placeholder="0"
              />
            </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-neutral-700 mb-2">Tiered pricing (qty slabs: 5 / 10 / 25)</h4>
                <p className="text-xs text-neutral-500 mb-2">
                  When quantity ≥ minQuantity, use this price. Add rows for 5, 10, 25 etc.
                </p>
                {tieredPricing.map((t, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                <input
                      type="number"
                      placeholder="min qty"
                      value={t.minQty}
                      onChange={(e) => handleTierChange(i, 'minQty', e.target.value)}
                      className="w-24 px-3 py-2 border border-neutral-300 rounded text-sm"
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="price"
                      value={t.price}
                      onChange={(e) => handleTierChange(i, 'price', e.target.value)}
                      className="w-24 px-3 py-2 border border-neutral-300 rounded text-sm"
                    />
            </div>
                ))}
                <button type="button" onClick={handleAddTier} className="text-sm text-red-600 hover:text-red-700 font-medium">
                  Add tier
                </button>
          </div>
              <div>
                <h4 className="text-sm font-medium text-neutral-700 mb-2">Multi-currency prices (optional)</h4>
                <p className="text-xs text-neutral-500 mb-2">e.g. EUR, GBP. Key = currency code, value = price.</p>
                <div className="flex flex-wrap items-center gap-3">
                  {Object.entries(multiCurrencyPrices).map(([code, val]) => (
                    <div key={code} className="flex items-center gap-2">
                      <label className="text-sm font-medium text-neutral-700 shrink-0">{code}:</label>
                  <input
                        type="number"
                        step="0.01"
                        value={val}
                        onChange={(e) =>
                          setMultiCurrencyPrices((m) => ({ ...m, [code]: e.target.value }))
                        }
                        placeholder="0"
                        className="w-20 px-3 py-1.5 border border-neutral-300 rounded-md text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                <button
                  type="button"
                        onClick={() =>
                          setMultiCurrencyPrices((m) => {
                            const next = { ...m }
                            delete next[code]
                      return next
                    })
                        }
                        className="text-red-600 hover:text-red-700 text-base leading-none shrink-0"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={currencyInput}
                      onChange={(e) => setCurrencyInput(e.target.value)}
                      placeholder="EUR"
                      className="w-20 px-3 py-1.5 border border-neutral-300 rounded-md text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          const code = currencyInput.trim()
                          if (code) {
                            setMultiCurrencyPrices((m) => ({ ...m, [code]: '' }))
                            setCurrencyInput('')
                          }
                        }
                      }}
                    />
                    <span className="text-xs text-neutral-500 whitespace-nowrap">Press Enter to add</span>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            id="categories"
            title="Categories"
            badge="Required"
            expanded={expandedSections.includes('categories')}
            onToggle={toggleSection}
          >
            <div className="pt-4 w-2/3">
              <label className={labelClass}>Categories</label>
              <select
                multiple
                value={categoryIds}
                onChange={(e) => setCategoryIds([...e.target.selectedOptions].map((o) => o.value))}
                className={`${inputClass} min-h-[120px]`}
              >
                <option value="cat1">Category 1</option>
                <option value="cat2">Category 2</option>
                <option value="cat3">Category 3</option>
              </select>
              <p className="text-xs text-neutral-500 mt-1">Hold Ctrl/Cmd to select multiple.</p>
            </div>
          </SectionCard>

          <SectionCard
            id="images"
            title="Images"
            badge="Required"
            expanded={expandedSections.includes('images')}
            onToggle={toggleSection}
          >
            <div className="pt-4 space-y-2">
              {images.map((url, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => handleImageChange(i, e.target.value)}
                    className={inputClass}
                    placeholder="https://..."
                  />
                  <button type="button" onClick={() => handleRemoveImage(i)} className="text-sm text-red-600 hover:text-red-700 shrink-0">
                  Remove
                </button>
              </div>
            ))}
              <button type="button" onClick={handleAddImage} className="text-sm text-red-600 hover:text-red-700 font-medium">
                Add Image URL
              </button>
            </div>
          </SectionCard>

          <SectionCard
            id="variants"
            title="Variants (SKU, price, stock)"
            badge="Required"
            expanded={expandedSections.includes('variants')}
            onToggle={toggleSection}
          >
            <div className="pt-4 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
                  onClick={handleAddVariant}
                  className="px-3 py-1.5 rounded text-sm font-medium border border-neutral-400 hover:bg-neutral-200"
            >
                  Add variant
            </button>
            <button
              type="button"
              onClick={() => setVariants(generateVariants())}
                  className="px-3 py-1.5 rounded text-sm font-medium border border-neutral-400 hover:bg-neutral-200"
            >
              Generate variants
            </button>
          </div>
              <p className="text-sm text-neutral-600">
                Add at least one variant with a unique SKU, or one variant with SKU "DEFAULT" for simple products. Use
                attribute builder above for Size/Color combinations.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleApplyBasePrice}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Apply base price to all
                </button>
                <button
                  type="button"
                  onClick={handleSetStockZero}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Set stock 0 for all
                </button>
        </div>
              <div className="flex gap-4 flex-wrap">
                {attributeNames.map((attrName) => (
                  <div key={attrName} className="flex gap-2 items-center">
                    <label className="text-sm font-medium">{attrName}</label>
                    <input
                      type="text"
                      value={(attributeValues[attrName] || []).join(', ')}
                      onChange={(e) => handleAttributeValues(attrName, e.target.value)}
                      className="w-32 px-2 py-1 border border-neutral-300 rounded text-sm"
                      placeholder="S, M, L"
                    />
                  </div>
                ))}
                <button type="button" onClick={handleAddAttribute} className="text-sm text-red-600 hover:text-red-700">
                  + Add attribute
                </button>
              </div>
            <div className="overflow-x-auto">
                <table className="min-w-full border border-neutral-200 rounded overflow-hidden">
                <thead>
                    <tr className="bg-neutral-50">
                      <th className="px-4 py-2 text-left text-xs font-medium text-neutral-600">SKU</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-neutral-600">Price</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-neutral-600">Compare at</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-neutral-600">Stock</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-neutral-600">Attributes</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-neutral-600"></th>
                  </tr>
                </thead>
                  <tbody className="divide-y divide-neutral-200">
                  {variants.map((v, i) => (
                    <tr key={v.id}>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={v.sku}
                          onChange={(e) => handleVariantChange(i, 'sku', e.target.value)}
                            className="w-full px-2 py-1 border border-neutral-300 rounded text-sm"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          step="0.01"
                          value={v.price}
                          onChange={(e) => handleVariantChange(i, 'price', e.target.value)}
                            className="w-20 px-2 py-1 border border-neutral-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={v.compareAt ?? '-'}
                            onChange={(e) => handleVariantChange(i, 'compareAt', e.target.value)}
                            className="w-20 px-2 py-1 border border-neutral-300 rounded text-sm"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={v.stock}
                          onChange={(e) => handleVariantChange(i, 'stock', e.target.value)}
                            className="w-16 px-2 py-1 border border-neutral-300 rounded text-sm"
                        />
                      </td>
                        <td className="px-4 py-2 text-sm text-neutral-600">
                          {attributeNames.map((n) => v.attributes?.[n]).filter(Boolean).join(', ') || '-'}
                        </td>
                        <td className="px-4 py-2">
                          <button type="button" onClick={() => handleRemoveVariant(i)} className="text-red-600 hover:text-red-700 text-sm">
                            Remove
                          </button>
                        </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-neutral-700 mb-3">Variant images (optional — per-variant)</h4>
                <div className="space-y-4">
                  {variants.map((v, i) => (
                    <div
                      key={v.id}
                      className="border border-neutral-200 rounded-lg overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => toggleVariantImages(v.id)}
                        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-neutral-50 transition-colors"
                      >
                        <span className="text-sm font-medium text-neutral-900">
                          Variant {i + 1}
                          {v.sku && ` (${v.sku})`}
                        </span>
                        <span className="text-neutral-400">
                          {expandedVariantImages.includes(v.id) ? (
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
                      {expandedVariantImages.includes(v.id) && (
                        <div className="px-4 pb-4 pt-0 border-t border-neutral-100 space-y-2">
                          {(variantImages[v.id] || []).map((url, imgIdx) => (
                            <div key={imgIdx} className="flex gap-2 items-center">
                              <input
                                type="url"
                                value={url}
                                onChange={(e) => handleVariantImageChange(v.id, imgIdx, e.target.value)}
                                className={inputClass}
                                placeholder="https://..."
                              />
                              <button
                                type="button"
                                onClick={() => handleVariantImageRemove(v.id, imgIdx)}
                                className="text-sm text-red-600 hover:text-red-700 shrink-0"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => handleVariantImageAdd(v.id)}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            + Add image
                          </button>
          </div>
        )}
                    </div>
                  ))}
                  {variants.length === 0 && (
                    <p className="text-sm text-neutral-500">Add variants above to add per-variant images.</p>
                  )}
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            id="stock"
            title="Stock & availability"
            badge="Optional"
            expanded={expandedSections.includes('stock')}
            onToggle={toggleSection}
          >
            <div className="pt-4 space-y-4">
              <p className="text-sm text-neutral-600">
                Safety stock, reorder alerts, backorder/preorder, and catalog visibility. See Inventory for reports.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={allowBackorder} onChange={(e) => setAllowBackorder(e.target.checked)} />
                  <span className="text-sm">Allow backorder</span>
                </label>
                <div className="md:col-span-2">
                  <label className={labelClass}>Backorder message (shown when out of stock)</label>
                  <input
                    type="text"
                    value={backorderMessage}
                    onChange={(e) => setBackorderMessage(e.target.value)}
                    className={inputClass}
                    placeholder="Ships when available"
                  />
                </div>
                <div>
                  <label className={labelClass}>Low stock threshold</label>
                  <input
                    type="text" 
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. 5"
                  />
                </div>
                <div>
                  <label className={labelClass}>Safety stock</label>
                  <input
                    type="text"
                    value={safetyStock}
                    onChange={(e) => setSafetyStock(e.target.value)}
                    className={inputClass}
                    placeholder="-"
                  />
                </div>
                <div>
                  <label className={labelClass}>Reorder level</label>
                  <input
                    type="text"
                    value={reorderLevel}
                    onChange={(e) => setReorderLevel(e.target.value)}
                    className={inputClass}
                    placeholder="-"
                  />
                </div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={allowPreorder} onChange={(e) => setAllowPreorder(e.target.checked)} />
                  <span className="text-sm">Allow preorder</span>
                </label>
                <div>
                  <label className={labelClass}>Preorder message</label>
                  <input
                    type="text"
                    value={preorderMessage}
                    onChange={(e) => setPreorderMessage(e.target.value)}
                    className={inputClass}
                    placeholder="Available in X days"
                  />
                </div>
                <div>
                  <label className={labelClass}>Lead time (days)</label>
                  <input
                    type="text"
                    value={leadTimeDays}
                    onChange={(e) => setLeadTimeDays(e.target.value)}
                    className={inputClass}
                    placeholder="-"
                  />
                </div>
                <div>
                  <label className={labelClass}>Auto-hide below</label>
                  <input
                    type="text"
                    value={autoHideBelow}
                    onChange={(e) => setAutoHideBelow(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Low stock display</label>
                  <select
                    value={lowStockDisplay}
                    onChange={(e) => setLowStockDisplay(e.target.value)}
                    className={inputClass}
                  >
                    <option value="none">None</option>
                    <option value="badge">Badge</option>
                    <option value="message">Message</option>
                  </select>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            id="seo"
            title="SEO & discoverability"
            badge="Optional"
            expanded={expandedSections.includes('seo')}
            onToggle={toggleSection}
          >
            <div className="pt-4 space-y-4">
              <p className="text-sm text-neutral-600">
                Meta title/description, OpenGraph image, templates (e.g. {'{name}'} | Store). Canonical URLs and 301
                redirects when slug changes are handled automatically.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelClass}>SEO title (override)</label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className={inputClass}
                    placeholder="Leave empty to use product name"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>SEO description (override)</label>
                  <input
                    type="text"
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    className={inputClass}
                    placeholder="Leave empty to use short description"
                  />
                </div>
                <div>
                  <label className={labelClass}>Meta keywords</label>
                  <input
                    type="text"
                    value={metaKeywords}
                    onChange={(e) => setMetaKeywords(e.target.value)}
                    className={inputClass}
                    placeholder="Comma-separated"
                  />
                </div>
                <div>
                  <label className={labelClass}>OG Image URL</label>
                  <input
                    type="url"
                    value={ogImageUrl}
                    onChange={(e) => setOgImageUrl(e.target.value)}
                    className={inputClass}
                    placeholder="Override for social share"
                  />
                </div>
                <div>
                  <label className={labelClass}>Title template</label>
                  <input
                    type="text"
                    value={titleTemplate}
                    onChange={(e) => setTitleTemplate(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Description template</label>
                  <input
                    type="text"
                    value={descriptionTemplate}
                    onChange={(e) => setDescriptionTemplate(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            id="content"
            title="Content sections"
            badge="Optional"
            expanded={expandedSections.includes('content')}
            onToggle={toggleSection}
          >
            <div className="pt-4 space-y-4">
              <p className="text-sm text-neutral-600">
                Description is above. Add technical specs, features, FAQs, and care instructions. Use Translations for
                multi-language (e.g. English, Hindi, Marathi).
              </p>
              <div>
                <label className={labelClass}>Technical specs</label>
                <textarea
                  value={technicalSpecs}
                  onChange={(e) => setTechnicalSpecs(e.target.value)}
                  rows={3}
                  className={inputClass}
                  placeholder="Key-value or paragraph"
                />
              </div>
              <div>
                <label className={labelClass}>Features (one per line)</label>
                <textarea
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  rows={3}
                  className={inputClass}
                  placeholder="Feature 1\nFeature 2"
                />
              </div>
              <div>
                <label className={labelClass}>FAQs</label>
                {faqs.map((faq, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Question"
                      value={faq.question}
                      onChange={(e) => handleFaqChange(i, 'question', e.target.value)}
                      className="flex-1 px-3 py-2 border border-neutral-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Answer"
                      value={faq.answer}
                      onChange={(e) => handleFaqChange(i, 'answer', e.target.value)}
                      className="flex-1 px-3 py-2 border border-neutral-300 rounded text-sm"
                    />
                    <button type="button" onClick={() => handleRemoveFaq(i)} className="text-red-600 hover:text-red-700 text-sm">
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={handleAddFaq} className="text-sm text-red-600 hover:text-red-700 font-medium">
                  Add FAQ
                </button>
              </div>
              <div>
                <label className={labelClass}>Care instructions</label>
                <textarea
                  value={careInstructions}
                  onChange={(e) => setCareInstructions(e.target.value)}
                  rows={2}
                  className={inputClass}
                  placeholder="Washing, storage, etc."
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            id="translations"
            title="Multi-language translations"
            badge="Optional"
            expanded={expandedSections.includes('translations')}
            onToggle={toggleSection}
          >
            <div className="pt-4 space-y-4">
              <p className="text-sm text-neutral-600">
                Store locales en. Add name, slug, description, and short description per language (e.g. Hindi, Marathi).
              </p>
              {Object.entries(translations).map(([locale, t]) => (
                <div key={locale} className="border border-neutral-200 rounded p-4 space-y-3">
                  <h4 className="font-medium text-neutral-700">{locale}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Name</label>
                      <input
                        type="text"
                        value={t.name}
                        onChange={(e) =>
                          setTranslations((tr) => ({
                            ...tr,
                            [locale]: { ...tr[locale], name: e.target.value },
                          }))
                        }
                        className={inputClass}
                        placeholder={`Product name in ${locale}`}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Slug</label>
                      <input
                        type="text"
                        value={t.slug}
                        onChange={(e) =>
                          setTranslations((tr) => ({
                            ...tr,
                            [locale]: { ...tr[locale], slug: e.target.value },
                          }))
                        }
                        className={inputClass}
                        placeholder={`URL slug in ${locale}`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Description</label>
                    <textarea
                      value={t.description}
                      onChange={(e) =>
                        setTranslations((tr) => ({
                          ...tr,
                          [locale]: { ...tr[locale], description: e.target.value },
                        }))
                      }
                      rows={2}
                      className={inputClass}
                      placeholder={`Description in ${locale}`}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Short description</label>
                    <textarea
                      value={t.shortDescription}
                      onChange={(e) =>
                        setTranslations((tr) => ({
                          ...tr,
                          [locale]: { ...tr[locale], shortDescription: e.target.value },
                        }))
                      }
                      rows={2}
                      className={inputClass}
                      placeholder={`Short description in ${locale}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            id="legal"
            title="Legal & compliance"
            badge="Optional"
            expanded={expandedSections.includes('legal')}
            onToggle={toggleSection}
          >
            <div className="pt-4 space-y-4">
              <p className="text-sm text-neutral-600">
                Manufacturing/expiry dates, ingredient list, certifications (FSSAI, ISO, cosmetic compliance).
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Manufacturing date</label>
                  <input
                    type="text"
                    value={manufacturingDate}
                    onChange={(e) => setManufacturingDate(e.target.value)}
                    className={inputClass}
                    placeholder="dd-mm-yyyy"
                  />
                </div>
                <div>
                  <label className={labelClass}>Expiry date</label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className={inputClass}
                    placeholder="dd-mm-yyyy"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Ingredient list</label>
                <textarea
                  value={ingredientList}
                  onChange={(e) => setIngredientList(e.target.value)}
                  rows={2}
                  className={inputClass}
                  placeholder="Comma-separated or paragraph"
                />
              </div>
              <div>
                <label className={labelClass}>Certifications (name, number, authority)</label>
                {certifications.map((c, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Name"
                      value={c.name}
                      onChange={(e) => handleCertChange(i, 'name', e.target.value)}
                      className="flex-1 px-3 py-2 border border-neutral-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Number"
                      value={c.number}
                      onChange={(e) => handleCertChange(i, 'number', e.target.value)}
                      className="flex-1 px-3 py-2 border border-neutral-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Authority"
                      value={c.authority}
                      onChange={(e) => handleCertChange(i, 'authority', e.target.value)}
                      className="flex-1 px-3 py-2 border border-neutral-300 rounded text-sm"
                    />
                    <button type="button" onClick={() => handleRemoveCert(i)} className="text-red-600 hover:text-red-700 text-sm">
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={handleAddCertification} className="text-sm text-red-600 hover:text-red-700 font-medium">
                  Add certification
                </button>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            id="conditional"
            title="Conditional logic (configurable product)"
            expanded={expandedSections.includes('conditional')}
            onToggle={toggleSection}
          >
            <div className="pt-4">
              <p className="text-sm text-neutral-600 mb-3">
                Optional JSON rules: e.g. show option B only when attribute A = X. Use for conditional options.
              </p>
              <textarea
                value={conditionalLogic}
                onChange={(e) => setConditionalLogic(e.target.value)}
                rows={6}
                className={`${inputClass} font-mono text-sm`}
                placeholder="{}"
              />
            </div>
          </SectionCard>
        </main>

        {/* Right sidebar - Publish */}
        <aside className="w-1/5 h-fit shrink-0 bg-white p-6 border border-neutral-300 rounded-lg">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-4">Publish</h3>
              <div className="flex flex-col gap-3">
          <button
            type="submit"
            disabled={saving}
                  className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50 border border-neutral-300"
          >
                  {saving ? 'Saving...' : isEdit ? 'Update product' : 'Create product'}
          </button>
          <Link
            to="/admin/products"
                  className="w-full py-2.5 border border-neutral-300 rounded-md font-medium text-center hover:bg-neutral-50"
          >
            Cancel
          </Link>
        </div>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
                <span className="text-sm">Featured</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={requiresLogin} onChange={(e) => setRequiresLogin(e.target.checked)} />
                <span className="text-sm">Requires login</span>
              </label>
              <p className="text-xs text-neutral-500">B2B hide from guests until logged in.</p>
              <div>
                <label className={labelClass}>Min order quantity (MOQ)</label>
                <input
                  type="number"
                  value={minOrderQty}
                  onChange={(e) => setMinOrderQty(e.target.value)}
                  className={inputClass}
                  min="1"
                />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-4">Publishing</h3>
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Publish from</label>
                  <input
                    type="datetime-local"
                    value={publishFrom}
                    onChange={(e) => setPublishFrom(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Publish until</label>
                  <input
                    type="datetime-local"
                    value={publishUntil}
                    onChange={(e) => setPublishUntil(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <p className="text-xs text-neutral-500">Leave empty for always visible.</p>
              </div>
            </div>
          </div>
        </aside>
      </form>
    </div>
  )
}
