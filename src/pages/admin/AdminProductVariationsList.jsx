/**
 * List variations for a single product. Under admin > Product.
 * Route: /admin/products/:productId/variations
 */
import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { listVariations, deleteVariation, getProduct } from '../../api/productVaration.js'

export function AdminProductVariationsList() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [productTitle, setProductTitle] = useState('')
  const [variations, setVariations] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!productId) return
    getProduct(productId)
      .then((p) => setProductTitle(p?.title || p?.name || `Product ${productId}`))
      .catch(() => setProductTitle(`Product ${productId}`))
  }, [productId])

  const fetchVariations = async () => {
    if (!productId) return
    setLoading(true)
    try {
      const res = await listVariations({ product_id: productId })
      const list = Array.isArray(res) ? res : res?.data ?? res?.variations ?? []
      setVariations(list)
    } catch (err) {
      console.error('Failed to fetch variations:', err)
      setVariations([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVariations()
  }, [productId])

  const handleDelete = async (variationId) => {
    if (!confirm('Delete this variation?')) return
    setDeleting(true)
    try {
      await deleteVariation(variationId)
      setVariations((prev) => prev.filter((v) => v.id !== variationId))
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Variations</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Product: {productTitle}. Add or edit SKU, price, stock, and attributes per variation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/admin/products/${productId}/variations/new`}
            className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Add variation
          </Link>
          <Link
            to={`/admin/products/${productId}`}
            className="px-4 py-2 rounded-md border border-neutral-300 bg-white text-neutral-800 text-sm font-medium hover:bg-neutral-50 transition-colors"
          >
            Back to product
          </Link>
          <Link
            to="/admin/products"
            className="px-4 py-2 rounded-md border border-neutral-300 bg-white text-neutral-800 text-sm font-medium hover:bg-neutral-50 transition-colors"
          >
            All products
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="text-neutral-500">Loading variations...</p>
      ) : (
        <div className="bg-white border border-neutral-300 rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">SKU</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Compare</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Weight</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Attributes</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {variations.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-neutral-500">
                      No variations yet.{' '}
                      <Link to={`/admin/products/${productId}/variations/new`} className="text-blue-600 hover:underline">
                        Add variation
                      </Link>
                    </td>
                  </tr>
                ) : (
                  variations.map((v) => (
                    <tr key={v.id} className="hover:bg-neutral-50">
                      <td className="px-4 py-3 text-sm text-neutral-900">{v.title || '—'}</td>
                      <td className="px-4 py-3 text-sm text-neutral-600">{v.sku || '—'}</td>
                      <td className="px-4 py-3 text-sm text-neutral-600">{v.price ?? '—'}</td>
                      <td className="px-4 py-3 text-sm text-neutral-600">{v.compare_price ?? '—'}</td>
                      <td className="px-4 py-3 text-sm text-neutral-600">{v.stock ?? '—'}</td>
                      <td className="px-4 py-3 text-sm text-neutral-600">{v.weight ?? '—'}</td>
                      <td className="px-4 py-3 text-sm text-neutral-600">
                        {Array.isArray(v.attributes) && v.attributes.length
                          ? v.attributes.map((a) => `${a.name}: ${a.variation}`).join(', ')
                          : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded ${v.status ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'}`}>
                          {v.status ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          to={`/admin/products/${productId}/variations/${v.id}`}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium mr-3"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(v.id)}
                          disabled={deleting}
                          className="text-red-600 hover:text-red-700 text-sm disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
