/**
 * Auth store - user, role, login, logout.
 * Roles: customer | admin | manager | shop_owner
 * Staff (admin, manager, shop_owner) see admin bar and admin routes.
 */

import { create } from 'zustand'
import * as authApi from '../api/authApi.js'

const STAFF_ROLES = ['admin', 'manager', 'shop_owner']

export const DEMO_USER = {
  id: 'demo-admin',
  email: 'admin@example.com',
  name: 'Demo Admin',
  role: 'admin',
  roles: ['admin'],
  createdAt: new Date().toISOString(),
}

function normalizeRole(role) {
  const r = (role ?? '').toString().toLowerCase()
  if (STAFF_ROLES.includes(r)) return r
  return 'customer'
}

function normalizeUser(user) {
  if (!user) return null
  return { ...user, role: normalizeRole(user.role) }
}

export function isStaff(user) {
  return user && STAFF_ROLES.includes(user.role)
}

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,

  setUser: (user) => set({ user: normalizeUser(user) }),

  login: async (email, password) => {
    set({ loading: true })
    try {
      const res = await authApi.login({ email, password })
      if (res.token) {
        localStorage.setItem('token', res.token)
      }
      const u = normalizeUser(res.user ?? res)
      set({ user: u, loading: false })
      return { ok: true, user: u }
    } catch (err) {
      set({ loading: false })
      throw err
    }
  },

  register: async (email, password, name) => {
    set({ loading: true })
    try {
      const res = await authApi.register({ email, password, name })
      if (res.token) {
        localStorage.setItem('token', res.token)
      }
      const u = normalizeUser(res.user ?? res)
      set({ user: u, loading: false })
      return { ok: true, user: u }
    } catch (err) {
      set({ loading: false })
      throw err
    }
  },

  logout: async () => {
    authApi.logout()
    set({ user: null })
  },

  fetchUser: async () => {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null
    if (token) {
      set({ loading: true })
      try {
        const user = await authApi.getMe()
        set({ user: normalizeUser(user ?? null), loading: false })
      } catch {
        localStorage.removeItem('token')
        set({ user: null, loading: false })
      }
      return
    }
    set({ user: null, loading: false })
  },

  useDemoAdmin: () => set({ user: normalizeUser(DEMO_USER) }),
}))
