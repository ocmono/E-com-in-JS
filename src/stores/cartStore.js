/**
 * Cart store - local cart state (no backend required).
 * Items: { productId, variantId?, quantity, product?, price }
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { productId, variantId, quantity = 1, product, price } = item
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === productId && (i.variantId || '') === (variantId || '')
          )
          const items = existing
            ? state.items.map((i) =>
                i.productId === productId && (i.variantId || '') === (variantId || '')
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              )
            : [...state.items, { productId, variantId, quantity, product, price }]
          return { items }
        })
      },

      updateQuantity: (productId, variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && (i.variantId || '') === (variantId || '')
              ? { ...i, quantity }
              : i
          ),
        }))
      },

      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && (i.variantId || '') === (variantId || ''))
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      flyoutOpen: false,
      setFlyoutOpen: (open) => set({ flyoutOpen: open }),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + (i.price ?? 0) * i.quantity, 0),
    }),
    { name: 'cart-storage' }
  )
)
