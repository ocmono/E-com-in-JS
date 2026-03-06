/**
 * Users API - list users for admin.
 */

import { api } from './client.js'

export async function fetchAllUser(params = {}) {
  const sp = new URLSearchParams()
  if (params.page) sp.set('page', String(params.page))
  if (params.limit) sp.set('limit', String(params.limit ?? 10))
  const q = sp.toString()
  const path = q ? `/users/list?${q}` : '/users/list'
  return api.get(path)
}
