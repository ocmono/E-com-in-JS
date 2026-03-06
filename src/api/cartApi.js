/**
 * Cart API - get cart, add/update/remove items.
 */

import { api } from './client.js'

export async function getCart() {
  return api.get('/cart')
}

export async function addToCart({ productId, variantId, quantity = 1 }) {
  return api.post('/cart/items', { productId, variantId, quantity })
}

export async function updateCartItem(itemId, quantity) {
  return api.patch(`/cart/items/${itemId}`, { quantity })
}

export async function removeFromCart(itemId) {
  return api.delete(`/cart/items/${itemId}`)
}
