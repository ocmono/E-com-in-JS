/**
 * Order API - list orders, get order detail, create order.
 */

import { api } from './client.js'

export async function getOrders(params = {}) {
  const sp = new URLSearchParams()
  if (params.page) sp.set('page', String(params.page))
  if (params.limit) sp.set('limit', String(params.limit ?? 10))
  const q = sp.toString()
  const path = q ? `/orders?${q}` : '/orders'
  return api.get(path)
}

export async function getOrder(id) {
  return api.get(`/orders/${id}`)
}
