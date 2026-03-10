/**
 * Add/Edit product form - Section-based layout with left nav, center content, right publish sidebar.
 * Optimized for the provided database schema.
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAdminProductStore } from '../../stores/adminProductStore.js'

const SECTIONS = [
  { id: 'basic', label: 'Basic info' },
  { id: 'variants', label: 'Variants' },
  { id: 'categories', label: 'Categories & Brand' },
  { id: 'images', label: 'Images' },
  { id: 'attributes', label: 'Attributes' },
  { id: 'stock', label: 'Stock & availability' },
  { id: 'seo', label: 'SEO & Tags' },
]

function SectionCard({ id, title, badge, children, expanded, onToggle }) {
  return (
    <div
      id={`section-${id}`}
      className="bg-white border border-neutral-300 rounded-md overflow-hidden mb-4 shadow-sm"
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
      {expanded && <div className="px-6 pb-6 pt-4 border-t border-neutral-300">{children}</div>}
    </div>
  )
}

const inputClass = 'w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
const labelClass = 'block text-sm font-medium text-neutral-700 mb-1'

export function AdminProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const { getProduct, addProduct, updateProduct } = useAdminProductStore()

  const [expandedSections, setExpandedSections] = useState(['basic', 'variants'])
  
  // Product fields
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [productType, setProductType] = useState('simple') // simple or variable
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [status, setStatus] = useState(true) // Published/Unpublished
  
  // Attributes
  const [attributes, setAttributes] = useState([
    { id: 'size', name: 'Size', values: ['S', 'M', 'L'] },
    { id: 'color', name: 'Color', values: ['Black', 'Blue', 'Red'] },
    { id: 'material', name: 'Material', values: ['Cotton', 'Leather'] }
  ])
  
  // Variations
  const [variations, setVariations] = useState([])
  const [expandedVariation, setExpandedVariation] = useState(null)
  
  // Images
  const [productImages, setProductImages] = useState([])
  
  // Stock
  const [stock, setStock] = useState('0')
  const [weight, setWeight] = useState('')
  
  // SEO
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDescription, setSeoDescription] = useState('')
  
  const [saving, setSaving] = useState(false)

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((s) => s !== sectionId) : [...prev, sectionId]
    )
  }

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(`section-${sectionId}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleSectionNavClick = (sectionId) => {
    if (!expandedSections.includes(sectionId)) {
      toggleSection(sectionId)
    }
    scrollToSection(sectionId)
  }

  useEffect(() => {
    if (isEdit) {
      const product = getProduct(id)
      if (product) {
        setTitle(product.title || '')
        setBody(product.body || '')
        setProductType(product.productType || 'simple')
        setBrand(product.brand || '')
        setCategory(product.category || '')
        setTags(product.tags || '')
        setStatus(product.status ?? true)
        
        if (product.images?.length) setProductImages(product.images)
        
        if (product.variations?.length) {
          setVariations(product.variations)
        }
      }
    }
  }, [id, isEdit, getProduct])

  // Generate variations based on selected attributes
  const generateVariations = () => {
    // Get active attributes with values
    const activeAttrs = attributes.filter(attr => attr.values && attr.values.length > 0)
    
    if (activeAttrs.length === 0) return
    
    // Generate all combinations
    const combinations = activeAttrs.reduce(
      (acc, attr) => {
        const vals = attr.values
        if (acc.length === 0) return vals.map(v => ({ [attr.name]: v }))
        return acc.flatMap(combo => 
          vals.map(v => ({ ...combo, [attr.name]: v }))
        )
      },
      []
    )
    
    // Create variations from combinations
    const newVariations = combinations.map((combo, index) => {
      // Generate SKU based on attributes
      const skuParts = Object.values(combo).map(v => v.substring(0, 3).toUpperCase())
      const sku = `${title?.substring(0, 3).toUpperCase() || 'PRD'}-${skuParts.join('-')}-${String(index + 1).padStart(2, '0')}`
      
      return {
        id: `var_${Date.now()}_${index}`,
        sku: sku,
        title: Object.entries(combo).map(([k, v]) => `${k}: ${v}`).join(', '),
        price: '',
        attributes: combo,
        status: true,
        weight: weight || '',
        images: []
      }
    })
    
    setVariations(newVariations)
  }

  const handleAddAttribute = () => {
    const name = prompt('Attribute name (e.g. Size, Color, Material):')
    if (name) {
      setAttributes([...attributes, { id: `attr_${Date.now()}`, name, values: [''] }])
    }
  }

  const handleAttributeValues = (index, valuesStr) => {
    const vals = valuesStr.split(',').map(v => v.trim()).filter(Boolean)
    setAttributes(prev => prev.map((attr, i) => 
      i === index ? { ...attr, values: vals } : attr
    ))
  }

  const handleRemoveAttribute = (index) => {
    setAttributes(prev => prev.filter((_, i) => i !== index))
    // Regenerate variations if needed
    if (productType === 'variable') {
      generateVariations()
    }
  }

  const handleVariationChange = (index, field, value) => {
    setVariations(prev => prev.map((v, i) => 
      i === index ? { ...v, [field]: value } : v
    ))
  }

  const handleRemoveVariation = (index) => {
    setVariations(prev => prev.filter((_, i) => i !== index))
  }

  const handleAddImage = () => setProductImages([...productImages, ''])
  
  const handleImageChange = (index, url) => 
    setProductImages(prev => prev.map((img, i) => i === index ? url : img))
  
  const handleRemoveImage = (index) => 
    setProductImages(prev => prev.filter((_, i) => i !== index))

  const handleVariationImageAdd = (varIndex) => {
    setVariations(prev => prev.map((v, i) => 
      i === varIndex 
        ? { ...v, images: [...(v.images || []), ''] }
        : v
    ))
  }

  const handleVariationImageChange = (varIndex, imgIndex, url) => {
    setVariations(prev => prev.map((v, i) => 
      i === varIndex 
        ? { ...v, images: v.images.map((img, j) => j === imgIndex ? url : img) }
        : v
    ))
  }

  const handleVariationImageRemove = (varIndex, imgIndex) => {
    setVariations(prev => prev.map((v, i) => 
      i === varIndex 
        ? { ...v, images: v.images.filter((_, j) => j !== imgIndex) }
        : v
    ))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSaving(true)
    
    // Prepare variations with proper data
    const preparedVariations = variations.map(v => ({
      sku: v.sku,
      title: v.title,
      price: parseFloat(v.price) || 0,
      attributes: v.attributes,
      status: v.status,
      weight: parseFloat(v.weight) || parseFloat(weight) || 0,
      images: (v.images || []).filter(Boolean)
    }))

    // Prepare product data matching the schema
    const productData = {
      title,
      body,
      product_type: productType,
      brand,
      category,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      status,
      images: productImages.filter(Boolean),
      variations: preparedVariations,
      // Add timestamps
      created: isEdit ? undefined : new Date().toISOString(),
      changed: new Date().toISOString()
    }

    if (isEdit) {
      updateProduct(id, productData)
    } else {
      addProduct(productData)
    }
    
    setTimeout(() => {
      setSaving(false)
      navigate('/admin/products')
    }, 500)
  }

  return (
    <div className="min-h-screen">
      <div className="">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">
              {isEdit ? 'Edit product' : 'Add product'}
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              {isEdit ? 'Update product details, variations, and inventory.' : 'Create a new product with variations and attributes.'}
            </p>
          </div>
          <Link
            to="/admin/products"
            className="px-4 py-2 rounded-md border border-neutral-300 bg-white text-neutral-700 text-sm font-medium hover:bg-neutral-50 transition-colors"
          >
            Back to list
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-6">
          {/* Left sidebar - Sections */}
          <aside className="w-48 shrink-0">
            <div className="sticky top-6">
              <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Sections</h3>
              <nav className="space-y-1">
                {SECTIONS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSectionNavClick(s.id)}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      expandedSections.includes(s.id)
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Center content */}
          <main className="flex-1">
            {/* Basic Info Section */}
            <SectionCard
              id="basic"
              title="Basic information"
              badge="Required"
              expanded={expandedSections.includes('basic')}
              onToggle={toggleSection}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Product type</label>
                    <select
                      value={productType}
                      onChange={(e) => setProductType(e.target.value)}
                      className={inputClass}
                    >
                      <option value="simple">Simple product</option>
                      <option value="variable">Variable product (with variations)</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Status</label>
                    <select
                      value={status ? 'published' : 'unpublished'}
                      onChange={(e) => setStatus(e.target.value === 'published')}
                      className={inputClass}
                    >
                      <option value="published">Published</option>
                      <option value="unpublished">Unpublished</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className={labelClass}>Product title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className={inputClass}
                    placeholder="e.g. Classic T-Shirt"
                  />
                </div>
                
                <div>
                  <label className={labelClass}>Description</label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={4}
                    className={inputClass}
                    placeholder="Full product description"
                  />
                </div>
              </div>
            </SectionCard>

            {/* Variants Section */}
            <SectionCard
              id="variants"
              title="Variations"
              badge={productType === 'variable' ? 'Required' : 'Optional'}
              expanded={expandedSections.includes('variants')}
              onToggle={toggleSection}
            >
              <div className="space-y-4">
                {productType === 'variable' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Variable product:</span> Create variations based on attributes like Size, Color, Material.
                    </p>
                  </div>
                )}

                {/* Variations List */}
                {variations.length > 0 ? (
                  <div className="space-y-3">
                    {variations.map((variation, vIndex) => (
                      <div key={variation.id} className="border border-neutral-200 rounded-md overflow-hidden">
                        <div 
                          className="flex items-center justify-between bg-neutral-50 px-4 py-3 cursor-pointer"
                          onClick={() => setExpandedVariation(expandedVariation === vIndex ? null : vIndex)}
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-sm">{variation.title || `Variation ${vIndex + 1}`}</span>
                            <span className="text-xs bg-neutral-200 px-2 py-0.5 rounded">{variation.sku}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-neutral-600">₹{variation.price || '0'}</span>
                            <svg className={`w-4 h-4 transform transition-transform ${expandedVariation === vIndex ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        
                        {expandedVariation === vIndex && (
                          <div className="p-4 border-t border-neutral-200 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs font-medium text-neutral-600">SKU *</label>
                                <input
                                  type="text"
                                  value={variation.sku}
                                  onChange={(e) => handleVariationChange(vIndex, 'sku', e.target.value)}
                                  className="mt-1 w-full px-3 py-2 border border-neutral-300 rounded-md text-sm"
                                  placeholder="e.g. TSHIRT-BLK-S"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-medium text-neutral-600">Price *</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={variation.price}
                                  onChange={(e) => handleVariationChange(vIndex, 'price', e.target.value)}
                                  className="mt-1 w-full px-3 py-2 border border-neutral-300 rounded-md text-sm"
                                  placeholder="0.00"
                                />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs font-medium text-neutral-600">Stock</label>
                                <input
                                  type="number"
                                  value={variation.stock || 0}
                                  onChange={(e) => handleVariationChange(vIndex, 'stock', e.target.value)}
                                  className="mt-1 w-full px-3 py-2 border border-neutral-300 rounded-md text-sm"
                                  placeholder="0"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-medium text-neutral-600">Weight (kg)</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={variation.weight || weight}
                                  onChange={(e) => handleVariationChange(vIndex, 'weight', e.target.value)}
                                  className="mt-1 w-full px-3 py-2 border border-neutral-300 rounded-md text-sm"
                                  placeholder="0.5"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label className="text-xs font-medium text-neutral-600">Variation images</label>
                              <div className="mt-2 space-y-2">
                                {(variation.images || []).map((img, imgIdx) => (
                                  <div key={imgIdx} className="flex gap-2">
                                    <input
                                      type="url"
                                      value={img}
                                      onChange={(e) => handleVariationImageChange(vIndex, imgIdx, e.target.value)}
                                      className="flex-1 px-3 py-2 border border-neutral-300 rounded-md text-sm"
                                      placeholder="https://example.com/image.jpg"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleVariationImageRemove(vIndex, imgIdx)}
                                      className="px-3 py-2 text-red-600 hover:text-red-700 text-sm"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => handleVariationImageAdd(vIndex)}
                                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                  + Add image
                                </button>
                              </div>
                            </div>
                            
                            <div className="flex justify-end pt-2">
                              <button
                                type="button"
                                onClick={() => handleRemoveVariation(vIndex)}
                                className="text-sm text-red-600 hover:text-red-700"
                              >
                                Remove variation
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-neutral-50 rounded-md border-2 border-dashed border-neutral-300">
                    <p className="text-neutral-500 mb-3">No variations added yet</p>
                    {productType === 'variable' && (
                      <button
                        type="button"
                        onClick={generateVariations}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                      >
                        Generate from attributes
                      </button>
                    )}
                  </div>
                )}

                {/* Add manual variation */}
                <button
                  type="button"
                  onClick={() => {
                    const newVar = {
                      id: `var_${Date.now()}`,
                      sku: '',
                      title: `Variation ${variations.length + 1}`,
                      price: '',
                      attributes: {},
                      status: true,
                      weight: weight,
                      images: []
                    }
                    setVariations([...variations, newVar])
                    setExpandedVariation(variations.length)
                  }}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Add manual variation
                </button>
              </div>
            </SectionCard>

            {/* Categories & Brand Section */}
            <SectionCard
              id="categories"
              title="Categories & Brand"
              expanded={expandedSections.includes('categories')}
              onToggle={toggleSection}
            >
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Brand</label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select brand</option>
                    <option value="nike">Nike</option>
                    <option value="adidas">Adidas</option>
                    <option value="puma">Puma</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className={labelClass}>Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select category</option>
                    <option value="clothing">Clothing</option>
                    <option value="footwear">Footwear</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                
                <div>
                  <label className={labelClass}>Tags (comma separated)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className={inputClass}
                    placeholder="summer, casual, trending"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Used for search keywords</p>
                </div>
              </div>
            </SectionCard>

            {/* Images Section */}
            <SectionCard
              id="images"
              title="Product Images"
              expanded={expandedSections.includes('images')}
              onToggle={toggleSection}
            >
              <div className="space-y-3">
                {productImages.map((url, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => handleImageChange(i, e.target.value)}
                      className={inputClass}
                      placeholder="https://example.com/image.jpg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="px-3 py-2 text-red-600 hover:text-red-700 text-sm shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Add image
                </button>
                <p className="text-xs text-neutral-500 mt-2">
                  First image will be used as the main product image
                </p>
              </div>
            </SectionCard>

            {/* Attributes Section */}
            <SectionCard
              id="attributes"
              title="Attributes"
              expanded={expandedSections.includes('attributes')}
              onToggle={toggleSection}
            >
              <div className="space-y-4">
                <p className="text-sm text-neutral-600">
                  Define attributes like Size, Color, Material. These will be used to generate variations.
                </p>
                
                {attributes.map((attr, index) => (
                  <div key={attr.id} className="border border-neutral-200 rounded-md p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-neutral-800">{attr.name}</h4>
                      {attributes.length > 3 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveAttribute(index)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div>
                      <label className="text-xs text-neutral-600">Values (comma separated)</label>
                      <input
                        type="text"
                        value={attr.values.join(', ')}
                        onChange={(e) => handleAttributeValues(index, e.target.value)}
                        className="mt-1 w-full px-3 py-2 border border-neutral-300 rounded-md text-sm"
                        placeholder="e.g. S, M, L"
                      />
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={handleAddAttribute}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Add attribute
                </button>
                
                {attributes.length > 0 && productType === 'variable' && (
                  <button
                    type="button"
                    onClick={generateVariations}
                    className="mt-2 w-full py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
                  >
                    Generate variations from attributes
                  </button>
                )}
              </div>
            </SectionCard>

            {/* Stock Section */}
            <SectionCard
              id="stock"
              title="Stock & Weight"
              expanded={expandedSections.includes('stock')}
              onToggle={toggleSection}
            >
              <div className="space-y-4">
                {productType === 'simple' && (
                  <div>
                    <label className={labelClass}>Stock quantity</label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className={inputClass}
                      placeholder="0"
                    />
                  </div>
                )}
                
                <div>
                  <label className={labelClass}>Weight (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className={inputClass}
                    placeholder="0.5"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Used for shipping calculations</p>
                </div>
                
                {productType === 'variable' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                    <p className="text-xs text-blue-800">
                      <span className="font-medium">Note:</span> Stock is managed per variation. Set stock quantities in each variation above.
                    </p>
                  </div>
                )}
              </div>
            </SectionCard>

            {/* SEO Section */}
            <SectionCard
              id="seo"
              title="SEO & Tags"
              expanded={expandedSections.includes('seo')}
              onToggle={toggleSection}
            >
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>SEO Title</label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className={inputClass}
                    placeholder="Leave empty to use product title"
                  />
                </div>
                <div>
                  <label className={labelClass}>SEO Description</label>
                  <textarea
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    rows={3}
                    className={inputClass}
                    placeholder="Meta description for search engines"
                  />
                </div>
              </div>
            </SectionCard>
          </main>

          {/* Right sidebar - Publish */}
          <aside className="w-72 shrink-0">
            <div className="bg-white border border-neutral-300 rounded-md p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Publish</h3>
              
              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? 'Saving...' : isEdit ? 'Update product' : 'Create product'}
                </button>
                
                <Link
                  to="/admin/products"
                  className="block w-full py-3 border border-neutral-300 rounded-md text-center text-neutral-700 font-medium hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </Link>
              </div>
              
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={status}
                      onChange={(e) => setStatus(e.target.checked)}
                      className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-neutral-700">Published</span>
                  </label>
                  
                  <div className="text-xs text-neutral-500 space-y-1">
                    <p>Created: {isEdit ? 'Existing product' : 'Now'}</p>
                    <p>Last updated: {isEdit ? 'Just now' : 'Not yet'}</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </div>
  )
}