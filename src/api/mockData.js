/**
 * Mock data for when no backend is connected.
 */

export const mockProducts = [
  { id: '1', name: 'Sample Product 1', slug: 'sample-product-1', price: 29.99, description: 'A sample product.', images: [] },
  { id: '2', name: 'Sample Product 2', slug: 'sample-product-2', price: 49.99, description: 'Another sample.', images: [] },
  { id: '3', name: 'Sample Product 3', slug: 'sample-product-3', price: 19.99, description: 'Third sample.', images: [] },
]

export const mockPaginated = (items, page = 1, limit = 12) => ({
  data: items,
  total: items.length,
  page,
  limit,
  totalPages: Math.ceil(items.length / limit) || 1,
})
