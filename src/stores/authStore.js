/**
 * Auth store - user, role, login, logout.
 * Access levels: super_admin | admin | manager | shop_owner | customer
 * Staff roles below have admin panel access (admin bar + /admin routes).
 */

import { create } from 'zustand'
import * as authApi from '../api/authApi.js'
import { getToken, clearToken } from '../api/tokenStorage.js'

/** Roles that can access the admin panel */
const STAFF_ROLES = ['super_admin', 'admin', 'manager', 'shop_owner']
const VALID_ROLES = ['super_admin', 'admin', 'manager', 'shop_owner', 'customer']

export const DEMO_USER = {
  id: 'demo-admin',
  email: 'admin@example.com',
  name: 'Demo Admin',
  role: 'admin',
  roles: [ 'super_admin','admin'],
  createdAt: new Date().toISOString(),
}

function normalizeRole(role) {
  const r = (role ?? '').toString().toLowerCase()
  if (VALID_ROLES.includes(r)) return r
  return 'customer'
}

/** Extract role from user.role or user.roles array (backend returns roles: [{ name, slug }]) */
function getRoleFromUser(user) {
  if (!user) return null
  if (user.role) return user.role
  const roles = user.roles
  if (Array.isArray(roles) && roles.length > 0) {
    const first = roles[0]
    const name = first?.name ?? first?.slug ?? (typeof first === 'string' ? first : null)
    if (name) return name
  }
  return null
}

function getDisplayName(user) {
  if (!user) return null
  if (user.name) return user.name
  const first = user.firstName ?? user.first_name ?? ''
  const last = user.lastName ?? user.last_name ?? ''
  const full = [first, last].filter(Boolean).join(' ')
  if (full) return full
  return user.fullName ?? user.full_name ?? user.email ?? null
}

function normalizeUser(user) {
  if (!user) return null
  const name = getDisplayName(user)
  const role = normalizeRole(getRoleFromUser(user))
  return { ...user, name: name ?? user.name ?? user.email, role }
}

export function isStaff(user) {
  return user && STAFF_ROLES.includes(user.role)
}

export function isSuperAdmin(user) {
  return user && user.role === 'super_admin'
}

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,

  setUser: (user) => set({ user: normalizeUser(user) }),

  login: async (email, password) => {
    set({ loading: true })
    try {
      const res = await authApi.login({ email, password })
      let u = normalizeUser(res.user ?? res)
      if (!u?.email && !u?.id) {
        const me = await authApi.getMe()
        u = normalizeUser(me ?? null)
      }
      set({ user: u, loading: false })
      return { ok: true, user: u }
    } catch (err) {
      set({ loading: false })
      throw err
    }
  },

  register: async (email, password, full_name, phone) => {
    set({ loading: true })
    try {
      const res = await authApi.register({ email, password, full_name, phone })
      let u = normalizeUser(res.user ?? res)
      if (!u?.email && !u?.id) {
        const me = await authApi.getMe()
        u = normalizeUser(me ?? null)
      }
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
    const token = getToken()
    if (token) {
      set({ loading: true })
      try {
        const user = await authApi.getMe()
        set({ user: normalizeUser(user ?? null), loading: false })
      } catch {
        clearToken()
        set({ user: null, loading: false })
      }
      return
    }
    set({ user: null, loading: false })
  },

  useDemoAdmin: () => set({ user: normalizeUser(DEMO_USER) }),
}))
