/**
 * Auth API - login, register, logout, get current user.
 */

import { api } from './client.js'

export async function login({ email, password }) {
  return api.post('/auth/login', { email, password })
}

export async function register({ email, password, name }) {
  return api.post('/auth/register', { email, password, name })
}

export async function getMe() {
  return api.get('/auth/me')
}

export function logout() {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('token')
  }
}
