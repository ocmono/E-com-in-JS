/**
 * Admin product store - holds products added via admin panel.
 * Used when no backend; catalog reads from here.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const DUMMY_PRODUCTS = [
  {
    id: 'd1',
    name: 'Classic Cotton T-Shirt',
    slug: 'classic-cotton-tshirt',
    description: 'Soft, breathable cotton t-shirt. Perfect for everyday wear.',
    shortDescription: 'Soft cotton tee',
    price: 24.99,
    compareAtPrice: 34.99,
    categoryIds: ['cat1'],
    images: [],
    variants: [
      { id: 'v1', sku: 'TSH-BLK-S', attributes: { Size: 'S', Color: 'Black' }, price: 24.99, stock: 50 },
      { id: 'v2', sku: 'TSH-BLK-M', attributes: { Size: 'M', Color: 'Black' }, price: 24.99, stock: 80 },
      { id: 'v3', sku: 'TSH-BLK-L', attributes: { Size: 'L', Color: 'Black' }, price: 24.99, stock: 45 },
      { id: 'v4', sku: 'TSH-WHT-S', attributes: { Size: 'S', Color: 'White' }, price: 24.99, stock: 60 },
      { id: 'v5', sku: 'TSH-WHT-M', attributes: { Size: 'M', Color: 'White' }, price: 24.99, stock: 70 },
    ],
    attributes: { Size: ['S', 'M', 'L'], Color: ['Black', 'White'] },
    stock: 305,
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'd2',
    name: 'Premium Wireless Earbuds',
    slug: 'premium-wireless-earbuds',
    description: 'High-quality wireless earbuds with noise cancellation. 24hr battery life.',
    shortDescription: 'Wireless earbuds with ANC',
    price: 89.99,
    compareAtPrice: 129.99,
    categoryIds: ['cat2'],
    images: [],
    variants: [
      { id: 'v6', sku: 'EARB-BLK', attributes: { Color: 'Black' }, price: 89.99, stock: 100 },
      { id: 'v7', sku: 'EARB-WHT', attributes: { Color: 'White' }, price: 89.99, stock: 75 },
      { id: 'v8', sku: 'EARB-BLU', attributes: { Color: 'Blue' }, price: 89.99, stock: 50 },
    ],
    attributes: { Color: ['Black', 'White', 'Blue'] },
    stock: 225,
    featured: true,
    createdAt: new Date().toISOString(),
  },
]

export const useAdminProductStore = create(
  persist(
    (set, get) => ({
      products: DUMMY_PRODUCTS,

      addProduct: (product) => {
        const id = 'p' + Date.now()
        const baseSlug = product.slug || product.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'product'
        const slug = baseSlug + '-' + id.slice(-4)
        set((state) => ({
          products: [...state.products, { ...product, id, slug, createdAt: new Date().toISOString() }],
        }))
        return id
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }))
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }))
      },

      getProduct: (id) => get().products.find((p) => p.id === id),
      getProductBySlug: (slug) => get().products.find((p) => p.slug === slug),
    }),
    { name: 'admin-products' }
  )
)
