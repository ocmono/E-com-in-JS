/**
 * Product API - all product-related endpoints in one file.
 * Falls back to mock data when no backend is connected.
 */

import { api } from './client.js'
import { mockProducts, mockPaginated } from './mockData.js'
import { useAdminProductStore } from '../stores/adminProductStore.js'

async function withMockFallback(fn, mock) {
  try {
    return await fn()
  } catch {
    return mock
  }
}

function getAdminProducts() {
  return useAdminProductStore.getState().products
}

export async function getProducts(params = {}) {
  return withMockFallback(
    async () => {
      const sp = new URLSearchParams()
      if (params.page) sp.set('page', String(params.page))
      if (params.limit) sp.set('limit', String(params.limit ?? 12))
      if (params.categoryId) sp.set('categoryId', params.categoryId)
      if (params.search) sp.set('search', params.search)
      if (params.sort) sp.set('sort', params.sort)
      if (params.featured != null) sp.set('featured', String(params.featured))
      const q = sp.toString()
      const path = q ? `/products?${q}` : '/products'
      return api.get(path)
    },
    mockPaginated(getAdminProducts().length ? getAdminProducts() : mockProducts, params.page ?? 1, params.limit ?? 12)
  )
}

export async function getProduct(id) {
  return withMockFallback(
    () => api.get(`/products/${id}`),
    getAdminProducts().find((p) => p.id === id) ?? mockProducts.find((p) => p.id === id) ?? mockProducts[0]
  )
}

export async function getProductBySlug(slug) {
  return withMockFallback(
    () => api.get(`/products/slug/${slug}`),
    getAdminProducts().find((p) => p.slug === slug) ?? mockProducts.find((p) => p.slug === slug) ?? mockProducts[0]
  )
}

export async function getCategories() {
  return withMockFallback(() => api.get('/categories'), [])
}

export async function getFeaturedProducts() {
  return withMockFallback(
    () => api.get('/products/featured'),
    getAdminProducts().length ? getAdminProducts() : mockProducts
  )
}
