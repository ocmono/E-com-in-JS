/**
 * Users API - list users for admin.
 */

import { api } from './client.js'

export async function fetchAllUser(params = {}) {
  const sp = new URLSearchParams()
  if (params.page) sp.set('page', String(params.page))
  if (params.limit) sp.set('limit', String(params.limit ?? 10))
  if (params.offset != null) sp.set('offset', String(params.offset))
  if (params.search) sp.set('q', String(params.search))
  if (params.filters && typeof params.filters === 'object') {
    Object.entries(params.filters).forEach(([k, v]) => {
      if (v != null && v !== '') sp.set(k, String(v))
    })
  }
  const q = sp.toString()
  const path = q ? `/users/list?${q}` : '/users/list'
  return api.get(path)
}

export async function deleteUserRole(user_id, role_id) {
  return api.delete(`/roles/unassign/${role_id}/users/${user_id}`)
}