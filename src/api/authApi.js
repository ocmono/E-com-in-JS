/**
 * Auth API - login, register, logout, get current user.
 */

import { api } from './client.js'
import { setToken, clearToken } from './tokenStorage.js'

export async function login({ email, password }) {
  const res = await api.post('/auth/login', { email, password })
  if (res.access_token ?? res.token) {
    setToken({ access_token: res.access_token ?? res.token, token_type: res.token_type ?? 'bearer' })
  }
  return res
}

export async function register({ email, password, full_name, phone }) {
  const res = await api.post('/auth/register', {
    email,
    password,
    full_name: full_name || null,
    phone: phone || null,
  })
  if (res.access_token ?? res.token) {
    setToken({ access_token: res.access_token ?? res.token, token_type: res.token_type ?? 'bearer' })
  }
  return res
}

export async function getMe() {
  return api.get('/auth/me')
}

export function logout() {
  clearToken()
}
