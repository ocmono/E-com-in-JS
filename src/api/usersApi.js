/**
 * Users API - list users for admin.
 */

import { api } from './client.js'

// user role and users related APIs
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

export async function addUser(data) {
  return api.post('/auth/login', {
    email: data.email,
    full_name: data.full_name,
    phone: data.phone,
    password: data.password,
  })
}

export async function assignUserToRole(user_id, role_id) {  
  return api.post(`/roles/assign/${role_id}/users/${user_id}`)
}

export async function unassignUserFromRole(user_id, role_id) {
  return api.delete(`/roles/unassign/${role_id}/users/${user_id}`)
}

// role related APIs
export async function createRole(data) {
  return api.post('/roles/create', data)
}

export async function listRoles() {
  return api.get('/roles/list')
}

export async function getRoleById(role_id) {
  return api.get(`/roles/get/${role_id}`)
}

export async function updateRole(role_id, data) {
  return api.patch(`/roles/update/${role_id}`, data)
}

export async function deleteRole(role_id) {
  return api.delete(`/roles/delete/${role_id}`)
}

